const STORAGE_KEYS = {
  PRODUCTS: 'trackedProducts'
};

const list = document.getElementById('product-list');
const template = document.getElementById('product-template');
const refreshButton = document.getElementById('refresh');
const openOptionsButton = document.getElementById('open-options');

openOptionsButton.addEventListener('click', () => chrome.runtime.openOptionsPage());
refreshButton.addEventListener('click', async () => {
  refreshButton.disabled = true;
  refreshButton.textContent = 'Обновляем...';
  try {
    await chrome.runtime.sendMessage({ action: 'FORCE_PRICE_CHECK' });
    await loadProducts();
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = 'Обновить цены';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'PRODUCT_STATUS_UPDATED') {
    loadProducts();
  }
});

async function loadProducts() {
  const { [STORAGE_KEYS.PRODUCTS]: stored } = await chrome.storage.local.get(STORAGE_KEYS.PRODUCTS);
  const products = Object.values(stored || {});
  renderProducts(products);
}

function renderProducts(products) {
  list.innerHTML = '';
  if (!products.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-message';
    empty.textContent = 'Список отслеживания пуст. Откройте карточку товара и нажмите «Добавить в отслеживание».';
    list.appendChild(empty);
    return;
  }

  products.sort((a, b) => (b.lastUpdate || 0) - (a.lastUpdate || 0));

  for (const product of products) {
    const node = template.content.firstElementChild.cloneNode(true);
    const image = node.querySelector('.product-card__image');
    const title = node.querySelector('.product-card__title');
    const price = node.querySelector('.product-card__price');
    const stats = node.querySelector('.product-card__stats');
    const link = node.querySelector('.product-card__link');
    const remove = node.querySelector('.product-card__remove');

    if (product.image) {
      image.src = product.image;
      image.alt = product.title || 'Товар Ozon';
    } else {
      image.remove();
    }

    title.textContent = product.title || 'Товар без названия';
    price.textContent = `Текущая цена: ${formatPrice(product.lastKnownPrice)}`;

    const average = calculateAverage(product.history);
    const drop = calculateDrop(product.history);
    const lastUpdate = product.lastUpdate ? new Date(product.lastUpdate).toLocaleString('ru-RU') : '—';

    const pieces = [`Средняя: ${average ? formatPrice(average) : 'нет данных'}`, `Обновлено: ${lastUpdate}`];
    if (drop) {
      pieces.unshift(`Снижение: −${formatPrice(drop)}`);
    }
    stats.textContent = pieces.join(' • ');

    link.href = product.url;

    remove.addEventListener('click', async () => {
      await chrome.runtime.sendMessage({ action: 'REMOVE_PRODUCT', payload: { id: product.id } });
      loadProducts();
    });

    list.appendChild(node);
  }
}

function formatPrice(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function calculateAverage(history) {
  if (!history || !history.length) return null;
  const total = history.reduce((sum, entry) => sum + entry.price, 0);
  return Math.round(total / history.length);
}

function calculateDrop(history) {
  if (!history || history.length < 2) return null;
  const prices = history.map((entry) => entry.price);
  const max = Math.max(...prices);
  const current = prices[prices.length - 1];
  const drop = max - current;
  return drop > 0 ? drop : 0;
}
