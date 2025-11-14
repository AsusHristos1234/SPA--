(function () {
  if (window.__ozonTrackerBridgeInstalled) {
    return;
  }
  window.__ozonTrackerBridgeInstalled = true;

  var REQUEST_EVENT = 'ozon-tracker-request';
  var RESPONSE_EVENT = 'ozon-tracker-response';
  var CATEGORY_SCAN_LIMIT = 1200;

  function splitCategoryString(value) {
    if (value === undefined || value === null) {
      return [];
    }
    return String(value)
      .split(/\s*[>›»«/|,\n\r]+\s*/)
      .map(function (part) {
        return part.trim();
      })
      .filter(function (part) {
        return Boolean(part);
      });
  }

  function collectCategoryCandidates(node, collected, visited, depth, budget) {
    if (!node || budget.count >= CATEGORY_SCAN_LIMIT || depth > 6) {
      return;
    }

    var nodeType = typeof node;
    if (nodeType === 'string' || nodeType === 'number') {
      var pieces = splitCategoryString(node);
      if (pieces.length) {
        Array.prototype.push.apply(collected, pieces);
      }
      budget.count += 1;
      return;
    }

    if (nodeType === 'boolean') {
      budget.count += 1;
      return;
    }

    if (Array.isArray(node)) {
      budget.count += 1;
      if (node.length && node.every(function (item) { return typeof item === 'string'; })) {
        for (var s = 0; s < node.length; s += 1) {
          var parts = splitCategoryString(node[s]);
          if (parts.length) {
            Array.prototype.push.apply(collected, parts);
          }
        }
        return;
      }
      for (var i = 0; i < node.length && budget.count < CATEGORY_SCAN_LIMIT; i += 1) {
        collectCategoryCandidates(node[i], collected, visited, depth + 1, budget);
      }
      return;
    }

    if (nodeType === 'object') {
      if (visited.has(node)) {
        return;
      }
      visited.add(node);
      budget.count += 1;

      var candidateKeys = [
        'category',
        'categoryName',
        'categoryTitle',
        'category_path',
        'categoryPath',
        'category_path_text',
        'catalogCategory',
        'catalogSection',
        'catalog_name',
        'categories',
        'categoryLabel',
        'sectionName',
        'superCategory'
      ];

      for (var c = 0; c < candidateKeys.length; c += 1) {
        var key = candidateKeys[c];
        if (!Object.prototype.hasOwnProperty.call(node, key)) {
          continue;
        }
        var value = node[key];
        if (value === undefined || value === null) {
          continue;
        }
        if (typeof value === 'string' || typeof value === 'number') {
          var valueParts = splitCategoryString(value);
          if (valueParts.length) {
            Array.prototype.push.apply(collected, valueParts);
          }
        } else if (Array.isArray(value)) {
          collectCategoryCandidates(value, collected, visited, depth + 1, budget);
        } else if (typeof value === 'object') {
          collectCategoryCandidates(value, collected, visited, depth + 1, budget);
        }
      }

      var breadcrumbKeys = [
        'breadcrumbs',
        'breadCrumbs',
        'breadcrumb',
        'categoryBreadcrumbs',
        'categoryCrumbs',
        'path'
      ];

      for (var b = 0; b < breadcrumbKeys.length; b += 1) {
        var breadKey = breadcrumbKeys[b];
        if (!Object.prototype.hasOwnProperty.call(node, breadKey)) {
          continue;
        }
        var breadValue = node[breadKey];
        if (!breadValue) {
          continue;
        }
        if (Array.isArray(breadValue)) {
          for (var j = 0; j < breadValue.length; j += 1) {
            var entry = breadValue[j];
            if (entry === undefined || entry === null) {
              continue;
            }
            if (typeof entry === 'string' || typeof entry === 'number') {
              var entryParts = splitCategoryString(entry);
              if (entryParts.length) {
                Array.prototype.push.apply(collected, entryParts);
              }
            } else if (typeof entry === 'object') {
              var label = entry && (entry.name || entry.title || entry.text || entry.label);
              if (label) {
                var labelParts = splitCategoryString(label);
                if (labelParts.length) {
                  Array.prototype.push.apply(collected, labelParts);
                }
              }
              collectCategoryCandidates(entry, collected, visited, depth + 1, budget);
            }
          }
        } else if (typeof breadValue === 'object') {
          collectCategoryCandidates(breadValue, collected, visited, depth + 1, budget);
        }
      }

      var keys = Object.keys(node);
      for (var k = 0; k < keys.length && budget.count < CATEGORY_SCAN_LIMIT; k += 1) {
        var nestedValue = node[keys[k]];
        if (nestedValue === undefined || nestedValue === null) {
          continue;
        }
        if (
          typeof nestedValue === 'string' ||
          typeof nestedValue === 'number' ||
          Array.isArray(nestedValue) ||
          (typeof nestedValue === 'object' && nestedValue !== null)
        ) {
          collectCategoryCandidates(nestedValue, collected, visited, depth + 1, budget);
        }
      }
    }
  }

  function gatherCategoriesFromPageState() {
    var sources = [];
    if (window.__NUXT__ && window.__NUXT__.state) {
      sources.push(window.__NUXT__.state);
    }
    if (window.__NUXT__ && window.__NUXT__.data) {
      sources.push(window.__NUXT__.data);
    }
    if (window.__NUXT__) {
      sources.push(window.__NUXT__);
    }
    if (window.__NUXT_DATA__) {
      sources.push(window.__NUXT_DATA__);
    }
    if (window.__NEXT_DATA__) {
      sources.push(window.__NEXT_DATA__);
    }
    if (window.__INITIAL_STATE__) {
      sources.push(window.__INITIAL_STATE__);
    }
    if (window.__APP_STATE__) {
      sources.push(window.__APP_STATE__);
    }
    if (window.OZON_APP_STATE) {
      sources.push(window.OZON_APP_STATE);
    }
    if (window.OZON_STATE) {
      sources.push(window.OZON_STATE);
    }
    if (window.__OZON__) {
      sources.push(window.__OZON__);
    }
    if (window.ozon) {
      sources.push(window.ozon);
      if (window.ozon.state) {
        sources.push(window.ozon.state);
      }
      if (window.ozon.config) {
        sources.push(window.ozon.config);
      }
    }

    var collected = [];
    var visited = new WeakSet();
    var budget = { count: 0 };

    for (var i = 0; i < sources.length && budget.count < CATEGORY_SCAN_LIMIT; i += 1) {
      var source = sources[i];
      if (!source) {
        continue;
      }
      collectCategoryCandidates(source, collected, visited, 0, budget);
    }

    return collected;
  }

  function gatherCategoriesFromDataLayer() {
    var layer = window.dataLayer;
    if (!Array.isArray(layer) || !layer.length) {
      return [];
    }
    var collected = [];
    var visited = new WeakSet();
    var budget = { count: 0 };
    for (var i = 0; i < layer.length && budget.count < CATEGORY_SCAN_LIMIT; i += 1) {
      collectCategoryCandidates(layer[i], collected, visited, 0, budget);
    }
    return collected;
  }

  function gatherCategories() {
    var combined = [];
    var fromState = gatherCategoriesFromPageState();
    if (fromState.length) {
      Array.prototype.push.apply(combined, fromState);
    }
    var fromLayer = gatherCategoriesFromDataLayer();
    if (fromLayer.length) {
      Array.prototype.push.apply(combined, fromLayer);
    }
    return combined;
  }

  document.addEventListener(REQUEST_EVENT, function (event) {
    if (!event || !event.detail || event.detail.type !== 'categories') {
      return;
    }
    var categories;
    try {
      categories = gatherCategories();
    } catch (error) {
      categories = [];
    }
    var detail = {
      id: event.detail.id,
      type: event.detail.type,
      categories: categories
    };
    document.dispatchEvent(new CustomEvent(RESPONSE_EVENT, { detail: detail }));
  });
})();
