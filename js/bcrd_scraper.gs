/**
 * Impucálculo - BCRD Scraper Endpoint
 * Este script automatiza la extracción de las tasas oficiales del
 * Banco Central de la República Dominicana y provee compatibilidad global.
 */

function doGet(e) {
  var limitMinutes = 60; // Cache de 1 hora
  var cache = CacheService.getScriptCache();
  var cachedData = cache.get("tasas_impucalculo");
  
  if (cachedData != null) {
      return responderJSON(cachedData);
  }

  var globalData = {
    rates: {},
    banks: [],
    provider: "Impucalculo Scraper Proxy x Multi-Source"
  };

  // 1. Tasa Base Global (Para monedas secundarias como EUR, CAD, GBP)
  try {
      var globalRatesUrl = 'https://open.er-api.com/v6/latest/USD';
      var globalResponse = UrlFetchApp.fetch(globalRatesUrl, { muteHttpExceptions: true });
      var tempGlobal = JSON.parse(globalResponse.getContentText());
      globalData.rates = tempGlobal.rates || {};
  } catch (error) {
      console.error("Error Global Rates: " + error);
  }
  
  // 2. Extraer Tasa de Dólar Oficial BCRD (Prioridad Alta)
  try {
     var bcrdUrl = 'https://www.bancentral.gov.do/';
     var bcrdResponse = UrlFetchApp.fetch(bcrdUrl, { muteHttpExceptions: true });
     var bcrdHtml = bcrdResponse.getContentText();
     
     var compraMatch = bcrdHtml.match(/<small>Compra<\/small>[\s\S]*?<h5>\s*([\d.]+)\s*<\/h5>/i);
     var ventaMatch = bcrdHtml.match(/<small>Venta<\/small>[\s\S]*?<h5>\s*([\d.]+)\s*<\/h5>/i);
     
     if (compraMatch && compraMatch[1]) {
       globalData.rates['DOP_COMPRA'] = parseFloat(compraMatch[1]);
     }
     if (ventaMatch && ventaMatch[1]) {
       var bcrdVenta = parseFloat(ventaMatch[1]);
       globalData.rates['DOP_VENTA'] = bcrdVenta;
       globalData.rates['DOP'] = bcrdVenta; 
     }
  } catch (error) {
      globalData.bcrd_error = error.toString();
  }

  // 3. Obtener listado de Bancos via LiveDolar (Agregador 1)
  var banksMap = {};

  try {
    var liveResp = UrlFetchApp.fetch('https://livedolar.do/api/rates', { 
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    var liveData = JSON.parse(liveResp.getContentText());
    
    if (liveData && Array.isArray(liveData)) {
      liveData.forEach(function(bank) {
        var name = bank.display_name || bank.bank_name;
        banksMap[name] = {
          n: name,
          c: parseFloat(bank.buy),
          v: parseFloat(bank.sell),
          s: "LiveDolar"
        };
      });
    }
  } catch (error) {
    globalData.livedolar_error = error.toString();
  }

  // 4. Fuente Redundante: Scrape Directo Banco Popular (API Interna)
  // Esto asegura que el banco más grande de RD esté presente aunque el agregador falle.
  try {
    var bpdUrl = "https://popularenlinea.com/_api/web/lists/getbytitle('Rates')/items?$filter=ItemID%20eq%20'1'";
    var bpdResp = UrlFetchApp.fetch(bpdUrl, {
      muteHttpExceptions: true,
      headers: { "Accept": "application/json;odata=verbose" }
    });
    var bpdData = JSON.parse(bpdResp.getContentText());
    
    if (bpdData && bpdData.d && bpdData.d.results && bpdData.d.results.length > 0) {
      var item = bpdData.d.results[0];
      var bpdName = "Banco Popular";
      // Si ya existe en el mapa, el dato directo del banco suele ser más fresco o confiable
      banksMap[bpdName] = {
        n: bpdName,
        c: parseFloat(item.DollarBuyRate),
        v: parseFloat(item.DollarSellRate),
        s: "BPD-Direct"
      };
    }
  } catch (error) {
    globalData.bpd_direct_error = error.toString();
  }

  // Convertir el mapa a un array para la respuesta
  globalData.banks = Object.keys(banksMap).map(function(key) {
    return banksMap[key];
  });
  
  var currentDate = new Date();
  globalData.time_last_update_utc = currentDate.toUTCString();
  
  var finalOutput = JSON.stringify(globalData);
  // Cambiamos la clave del caché para forzar la actualización inmediata
  cache.put("tasas_multi_v1", finalOutput, limitMinutes * 60);
  
  return responderJSON(finalOutput);
}

// Función auxiliar para responder CORS de forma correcta a la App
function responderJSON(stringPayload) {
  return ContentService.createTextOutput(stringPayload)
    .setMimeType(ContentService.MimeType.JSON);
}
