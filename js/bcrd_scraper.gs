/**
 * Impucálculo - BCRD Scraper Endpoint
 * Este script automatiza la extracción de las tasas oficiales del
 * Banco Central de la República Dominicana y provee compatibilidad global.
 */

function doGet(e) {
  var limitMinutes = 60; // Configurar a 60 minutos = 1 hr de caché
  var cache = CacheService.getScriptCache();
  var cachedData = cache.get("tasas_impucalculo");
  
  if (cachedData != null) {
      // Devolver los datos desde la memoria caché acelerada
      return responderJSON(cachedData);
  }

  // 1. Obtener la Tasa Base Global (Para monedas secundarias como EUR, CAD, GBP)
  var globalData = {};
  try {
      var globalRatesUrl = 'https://open.er-api.com/v6/latest/USD';
      var globalResponse = UrlFetchApp.fetch(globalRatesUrl, { muteHttpExceptions: true });
      globalData = JSON.parse(globalResponse.getContentText());
  } catch (error) {
      globalData = { result: "error_global", rates: {} };
  }
  
  // 2. Extraer Tasa de Dólar Oficial BCRD
  try {
     var bcrdUrl = 'https://www.bancentral.gov.do/';
     var bcrdResponse = UrlFetchApp.fetch(bcrdUrl, { muteHttpExceptions: true });
     var bcrdHtml = bcrdResponse.getContentText();
     
     // Buscar y hacer coincidir "Compra" seguido del h5 numérico en HTML
     var compraMatch = bcrdHtml.match(/<small>Compra<\/small>[\s\S]*?<h5>\s*([\d.]+)\s*<\/h5>/i);
     var ventaMatch = bcrdHtml.match(/<small>Venta<\/small>[\s\S]*?<h5>\s*([\d.]+)\s*<\/h5>/i);
     
     if (compraMatch && compraMatch[1]) {
       globalData.rates['DOP_COMPRA'] = parseFloat(compraMatch[1]);
     }
     if (ventaMatch && ventaMatch[1]) {
       var bcrdVenta = parseFloat(ventaMatch[1]);
       globalData.rates['DOP_VENTA'] = bcrdVenta;
       // Sobrescribir DOP global con la Venta oficial dominicana (la que le interesa al usuario comúnmente)
       globalData.rates['DOP'] = bcrdVenta; 
     }
  } catch (error) {
      // Si el banco central no responde, usaremos la global (fallback)
      globalData.bcrd_error = error.toString();
  }
  
  // 3. Forzar hora de actualización con Date()
  var currentDate = new Date();
  globalData.time_last_update_utc = currentDate.toUTCString();
  globalData.provider = "Impucalculo Scraper Proxy x BCRD";
  
  var finalOutput = JSON.stringify(globalData);
  
  // Almacenar en caché masivo por X minutos
  cache.put("tasas_impucalculo", finalOutput, limitMinutes * 60);
  
  return responderJSON(finalOutput);
}

// Función auxiliar para responder CORS de forma correcta a la App
function responderJSON(stringPayload) {
  return ContentService.createTextOutput(stringPayload)
    .setMimeType(ContentService.MimeType.JSON);
}
