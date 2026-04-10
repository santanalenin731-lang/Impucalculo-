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

  // 3. Obtener listado de Bancos via LiveDolar (Agregador)
  try {
    var liveResp = UrlFetchApp.fetch('https://livedolar.do/api/rates', { 
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    var liveData = JSON.parse(liveResp.getContentText());
    
    // La API retorna un array directamente
    if (liveData && Array.isArray(liveData)) {
      globalData.banks = liveData.map(function(bank) {
        return {
          n: bank.display_name || bank.bank_name,
          c: parseFloat(bank.buy),
          v: parseFloat(bank.sell)
        };
      });
    }
  } catch (error) {
    globalData.banks_error = error.toString();
  }
  
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
