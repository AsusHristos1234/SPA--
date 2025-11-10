const API_TIMEOUT = 35; // seconds for long polling

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('Не найден токен. Перед запуском установите переменную окружения BOT_TOKEN.');
  process.exit(1);
}

const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const sessions = new Map();

function createNewState() {
  return {
    stage: 'villageGate',
    hp: 20,
    mana: 10,
    gold: 5,
    inventory: ['Потрёпанный плащ'],
    log: [],
  };
}

const STEPS = {
  villageGate: {
    title: 'Ворота деревни Эльдруин',
    description:
      'Вы стоите у ворот деревни Эльдруин. Ночь сгущается, и вдалеке слышны волчьи завывания. Отсюда можно пройти в таверну, на рыночную площадь или сразу отправиться в тёмный лес.',
    options: [
      {
        text: 'Зайти в таверну «Лунный кабан»',
        next: 'tavern',
        apply: (state) => {
          state.hp = Math.min(state.hp + 3, 20);
          state.gold = Math.max(state.gold - 1, 0);
          return { text: 'Вы заказали тёплый суп. Силы восстановлены (+3 ОЗ), но вам пришлось заплатить 1 золотой.' };
        },
      },
      {
        text: 'Исследовать рыночную площадь',
        next: 'market',
        apply: (state) => {
          state.gold += 3;
          if (!state.inventory.includes('Амулет удачи')) {
            state.inventory.push('Амулет удачи');
          }
          return {
            text: 'Торговец заметил в вас искру отваги и подарил амулет. В кошельке теперь на 3 золотых больше!',
          };
        },
      },
      {
        text: 'Отправиться в тёмный лес',
        next: 'forestEntrance',
        apply: () => ({ text: 'Вы смело шагаете в сторону шепчущих ветвей.' }),
      },
    ],
  },
  tavern: {
    title: 'Таверна «Лунный кабан»',
    description:
      'Гул голосов и запах пряных трав наполняют воздух. Хозяин таверны рассказывает о древнем артефакте — Сердце Бури. Оно спрятано в руинах вглуби леса.',
    options: [
      {
        text: 'Согласиться помочь тавернщику',
        next: 'forestEntrance',
        apply: (state) => {
          if (!state.inventory.includes('Карта руин')) {
            state.inventory.push('Карта руин');
          }
          return {
            text: 'Хозяин благодарит вас и вручает карту руин. Вы чувствуете ответственность за деревню.',
          };
        },
      },
      {
        text: 'Остаться и прислушаться к разговорам',
        next: 'villageGate',
        apply: (state) => {
          state.mana = Math.min(state.mana + 2, 10);
          return {
            text: 'Вы узнали пару полезных заклинаний (+2 Маны) и решили вернуться к воротам.',
          };
        },
      },
    ],
  },
  market: {
    title: 'Рыночная площадь',
    description:
      'Площадь полна торговцев. Один старик показывает свёрток с травами, другой предлагает услугу зачарования.',
    options: [
      {
        text: 'Купить лечебные травы (2 золота)',
        next: 'villageGate',
        apply: (state) => {
          if (state.gold < 2) {
            return {
              text: 'У вас не хватает золота, торговец печально качает головой.',
              next: 'market',
            };
          }
          state.gold -= 2;
          state.inventory.push('Лечебные травы');
          state.hp = Math.min(state.hp + 5, 20);
          return {
            text: 'Травы приятно пахнут. Вы накладываете повязку и восстанавливаете силы (+5 ОЗ).',
          };
        },
      },
      {
        text: 'Оплатить зачарование оружия (3 золота)',
        next: 'villageGate',
        apply: (state) => {
          if (state.gold < 3) {
            return {
              text: 'Мастер-колдун требует 3 золотых, но у вас недостаточно средств.',
              next: 'market',
            };
          }
          state.gold -= 3;
          if (!state.inventory.includes('Зачарованный клинок')) {
            state.inventory.push('Зачарованный клинок');
          }
          state.log.push('Ваш клинок теперь светится мягким голубым сиянием.');
          return { text: 'Клинок наполнился магией, ваши атаки станут сильнее.' };
        },
      },
      {
        text: 'Встретить карлика-ремесленника',
        next: 'forestEntrance',
        apply: (state) => {
          state.gold += 1;
          return {
            text: 'Карлик рассказывает о тропе мимо волчьего логова и вручает вам 1 золотой на удачу.',
          };
        },
      },
    ],
  },
  forestEntrance: {
    title: 'Тёмный лес',
    description:
      'Сквозь ветви доносится едва слышный шёпот. Тропинка разделяется: налево — волчье логово, направо — руины храма.',
    options: [
      {
        text: 'Пойти к волчьему логову',
        next: 'wolfDen',
        apply: () => ({ text: 'Вы ступаете на мягкий мох, стараясь не выдать своё присутствие.' }),
      },
      {
        text: 'Следовать к руинам храма',
        next: 'ancientRuins',
        apply: (state) => {
          if (!state.inventory.includes('Карта руин')) {
            state.hp = Math.max(state.hp - 3, 0);
            return {
              text: 'Без карты вы блуждали и поцарапались о ветви (-3 ОЗ), но всё же нашли путь.',
            };
          }
          return { text: 'Карта помогает без труда добраться до руин.' };
        },
      },
      {
        text: 'Разбить лагерь и отдохнуть',
        next: 'forestEntrance',
        apply: (state) => {
          state.hp = Math.min(state.hp + 2, 20);
          state.mana = Math.min(state.mana + 1, 10);
          return { text: 'Небольшой костёр позволяет перевести дух (+2 ОЗ, +1 Мана).' };
        },
      },
    ],
  },
  wolfDen: {
    title: 'Логово волков',
    description:
      'Впереди слышится рычание. Серебристый альфа-волк вышел навстречу, его глаза горят яростью.',
    options: [
      {
        text: 'Атаковать зачарованным клинком',
        next: 'forestEntrance',
        apply: (state) => {
          const hasSword = state.inventory.includes('Зачарованный клинок');
          const damage = hasSword ? 0 : 4;
          state.hp = Math.max(state.hp - damage, 0);
          state.gold += 4;
          const swordText = hasSword
            ? 'Магия клинка ослепляет волка. Вы побеждаете без единой царапины.'
            : 'Без зачарования бой даётся тяжело. Вы получаете царапины (-4 ОЗ), но побеждаете.';
          return { text: `${swordText} В логове вы находите 4 золотых.` };
        },
      },
      {
        text: 'Применить заклинание сна',
        next: 'forestEntrance',
        apply: (state) => {
          if (state.mana < 3) {
            return {
              text: 'Вы пытаетесь соткать заклинание, но маны не хватает. Приходится отступить.',
              next: 'forestEntrance',
            };
          }
          state.mana -= 3;
          state.gold += 2;
          return { text: 'Заклинание мягко погружает волков в сон. Вы бесшумно забираете 2 золотых.' };
        },
      },
      {
        text: 'Отступить',
        next: 'forestEntrance',
        apply: () => ({ text: 'Вы решаете не рисковать и возвращаетесь к развилке.' }),
      },
    ],
  },
  ancientRuins: {
    title: 'Древние руины',
    description:
      'У входа в руины стоит каменный страж. Его глаза вспыхивают, когда вы приближаетесь.',
    options: [
      {
        text: 'Предъявить амулет удачи',
        next: 'stormHeart',
        apply: (state) => {
          if (!state.inventory.includes('Амулет удачи')) {
            state.hp = Math.max(state.hp - 5, 0);
            return {
              text: 'Без амулета страж наносит вам удар (-5 ОЗ) и вы вынуждены отступить.',
              next: 'ancientRuins',
            };
          }
          return { text: 'Страж кланяется амулету и пропускает вас внутрь.' };
        },
      },
      {
        text: 'Сразиться со стражем',
        next: 'stormHeart',
        apply: (state) => {
          const weaponBonus = state.inventory.includes('Зачарованный клинок') ? 0 : 5;
          state.hp = Math.max(state.hp - weaponBonus, 0);
          state.mana = Math.max(state.mana - 2, 0);
          const text =
            weaponBonus === 0
              ? 'Зачарованный клинок рассеивает каменную броню. Победа даётся легко, хотя вы устали (-2 Маны).'
              : 'Без магического оружия бой суров (-5 ОЗ, -2 Маны), но вы побеждаете.';
          return { text };
        },
      },
      {
        text: 'Использовать лечебные травы',
        next: 'ancientRuins',
        apply: (state) => {
          const index = state.inventory.indexOf('Лечебные травы');
          if (index === -1) {
            return { text: 'В сумке пусто. Лечебных трав не осталось.', next: 'ancientRuins' };
          }
          state.inventory.splice(index, 1);
          state.hp = Math.min(state.hp + 6, 20);
          return { text: 'Вы завариваете травы и восстанавливаете силы (+6 ОЗ). Страж терпеливо ждёт.' };
        },
      },
    ],
  },
  stormHeart: {
    title: 'Сердце Бури',
    description:
      'В центре зала сияет кристалл Сердца Бури. Когда вы протягиваете руки, воздух наполняется электричеством.',
    options: [
      {
        text: 'Забрать артефакт и вернуться в деревню',
        next: 'victory',
        apply: (state) => {
          if (!state.inventory.includes('Сердце Бури')) {
            state.inventory.push('Сердце Бури');
          }
          state.gold += 10;
          return {
            text: 'Энергия наполняет вас, но вы чувствуете, что деревне нужен этот свет. Вы берёте артефакт и направляетесь домой.',
          };
        },
      },
      {
        text: 'Попытаться поглотить мощь артефакта',
        next: 'defeat',
        apply: () => ({ text: 'Сила Сердца Бури слишком велика. Вспышка света — и всё исчезает...' }),
      },
    ],
  },
  victory: {
    title: 'Триумф героя',
    description:
      'Вы возвращаетесь в Эльдруин. Жители встречают вас аплодисментами, а тавернщик устраивает пир в вашу честь. Деревня спасена! 🎉',
    options: [],
  },
  defeat: {
    title: 'Гибель героя',
    description:
      'Сила артефакта оказалась сильнее. Ваши подвиги будут помнить, но путешествие окончено. Попробуйте снова, выбрав иной путь.',
    options: [],
  },
};

function buildKeyboard(stepKey) {
  const step = STEPS[stepKey];
  if (!step || !step.options.length) {
    return undefined;
  }
  const buttons = step.options.map((option, index) => [
    {
      text: option.text,
      callback_data: `${stepKey}|${index}`,
    },
  ]);
  return { inline_keyboard: buttons };
}

function formatStatus(state) {
  return [
    `❤ Здоровье: ${state.hp}`,
    `🔮 Мана: ${state.mana}`,
    `🪙 Золото: ${state.gold}`,
    `🎒 Инвентарь: ${state.inventory.join(', ') || 'пусто'}`,
    state.log.length ? `📝 Памятные события:\n- ${state.log.slice(-5).join('\n- ')}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

async function callApi(method, payload) {
  const response = await fetch(`${API_URL}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ошибка Telegram API: ${response.status} ${text}`);
  }
  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Telegram API вернул ошибку: ${data.description}`);
  }
  return data.result;
}

async function sendMessage(chatId, text, extra = {}) {
  return callApi('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
    ...extra,
  });
}

async function editMessage(chatId, messageId, text, extra = {}) {
  return callApi('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'Markdown',
    ...extra,
  });
}

async function answerCallbackQuery(callbackQueryId, text) {
  return callApi('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false,
  });
}

async function handleStart(chatId, userId) {
  const state = createNewState();
  sessions.set(userId, state);
  await sendMessage(
    chatId,
    '🌟 *Добро пожаловать в "Легенды Эльдруина"!*\n\nЭто пошаговое приключение в стиле фэнтези. Вы управляете героем с помощью кнопок под сообщениями. В любой момент используйте команду /status, чтобы узнать текущее состояние.',
  );
  await sendStep(chatId, userId);
}

async function sendStep(chatId, userId) {
  const state = sessions.get(userId);
  if (!state) {
    return;
  }
  const step = STEPS[state.stage];
  if (!step) {
    await sendMessage(chatId, 'Неизвестный этап приключения. Попробуйте /restart.');
    return;
  }
  const keyboard = buildKeyboard(state.stage);
  const statusText = formatStatus(state);
  const message = `*${step.title}*\n\n${step.description}\n\n${statusText}`;
  await sendMessage(chatId, message, keyboard ? { reply_markup: keyboard } : undefined);
  if (!keyboard) {
    await sendMessage(chatId, 'Приключение завершено! Введите /restart, чтобы начать заново.');
  }
}

async function handleCallback(update) {
  const callback = update.callback_query;
  const { id: callbackId, data, message, from } = callback;
  const userId = from.id;
  const state = sessions.get(userId);
  if (!state) {
    await answerCallbackQuery(callbackId, 'Игра ещё не начата. Используйте /start.');
    return;
  }
  const [stepKey, optionIndex] = data.split('|');
  if (stepKey !== state.stage) {
    await answerCallbackQuery(callbackId, 'Эта кнопка больше неактуальна.');
    return;
  }
  const step = STEPS[stepKey];
  const option = step?.options?.[Number(optionIndex)];
  if (!option) {
    await answerCallbackQuery(callbackId, 'Неизвестный выбор.');
    return;
  }

  const result = option.apply(state) ?? {};
  const resultText = typeof result === 'string' ? result : result.text || 'Вы сделали выбор.';
  const nextStageFromResult = typeof result === 'object' && result.next ? result.next : undefined;

  if (state.hp <= 0) {
    state.stage = 'defeat';
  } else {
    state.stage = nextStageFromResult || option.next;
  }

  await answerCallbackQuery(callbackId, 'Выбор принят!');

  if (message) {
    try {
      await editMessage(
        message.chat.id,
        message.message_id,
        `*${step.title}*\n\n${step.description}\n\n${formatStatus(state)}\n\n_Выбор сделан._`,
        { reply_markup: { inline_keyboard: [] } },
      );
    } catch (error) {
      console.error('Не удалось обновить сообщение:', error.message);
    }
  }

  await sendMessage(update.callback_query.message.chat.id, resultText);
  await sendStep(update.callback_query.message.chat.id, userId);
}

async function handleMessage(update) {
  const message = update.message;
  if (!message || !message.text) {
    return;
  }
  const text = message.text.trim();
  const chatId = message.chat.id;
  const userId = message.from.id;

  if (text === '/start') {
    await handleStart(chatId, userId);
    return;
  }
  if (text === '/restart') {
    sessions.set(userId, createNewState());
    await sendMessage(chatId, '🔄 Игра начата заново!');
    await sendStep(chatId, userId);
    return;
  }
  if (text === '/status') {
    const state = sessions.get(userId);
    if (!state) {
      await sendMessage(chatId, 'Игра ещё не начата. Используйте /start.');
      return;
    }
    await sendMessage(chatId, `Текущий статус героя:\n\n${formatStatus(state)}`);
    return;
  }
  if (text === '/help') {
    await sendMessage(
      chatId,
      'Используйте кнопки под сообщениями, чтобы выбирать действия. Команды: /start — начать, /restart — начать заново, /status — показать состояние героя.',
    );
    return;
  }
  await sendMessage(chatId, 'Неизвестная команда. Используйте кнопки выбора или введите /help.');
}

async function pollUpdates() {
  let offset = 0;
  console.log('Бот запущен. Ожидание событий...');
  while (true) {
    try {
      const response = await fetch(`${API_URL}/getUpdates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeout: API_TIMEOUT,
          offset,
          allowed_updates: ['message', 'callback_query'],
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Ошибка сети: ${response.status} ${text}`);
      }
      const data = await response.json();
      if (!data.ok) {
        throw new Error(`Ошибка Telegram API: ${data.description}`);
      }
      const updates = data.result;
      for (const update of updates) {
        offset = update.update_id + 1;
        if (update.message) {
          await handleMessage(update);
        } else if (update.callback_query) {
          await handleCallback(update);
        }
      }
    } catch (error) {
      console.error('Произошла ошибка при получении обновлений:', error.message);
      console.error('Перезапуск запроса через 5 секунд...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

pollUpdates();

process.on('SIGINT', () => {
  console.log('Остановка бота...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Остановка бота...');
  process.exit(0);
});
