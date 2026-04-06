# Bitácora e Ingeniería del Sistema: Impucálculo

> ⚠️ **ATENCIÓN IA / MODELOS DE LENGUAJE:**
> **REGLA CRUCIAL DE DESPLIEGUE:** NO debes subir, confirmar (commit) ni empujar (push) NINGÚN cambio a GitHub o cualquier entorno de producción sin recibir una AUTORIZACIÓN EXPLÍCITA Y DIRECTA del usuario en tu turno actual. Nunca asumas la autorización de subir cambios a Git. Espera siempre la palabra clave del usuario para hacer push.

**Impucálculo** es una plataforma de herramientas financieras enfocada en el marco económico y fiscal de la República Dominicana. Este documento sirve como mapa referencial de la arquitectura y como bitácora de actualizaciones progresivas del sistema.

---

## 1. Funcionamiento General y Arquitectura de la App

La aplicación está construida sobre una arquitectura predominantemente **Frontend (Estática Vanilla)**, garantizando tiempos de carga ultrarrápidos y máxima compatibilidad de alojamiento (GitHub Pages, Vercel, Firebase Hosting, etc.).

### Módulos Principales:
- **`index.html`**: Tablero principal (Landing Page). Presenta los diversos módulos financieros disponibles para el usuario y establece la identidad y diseño CSS global (modo claro/oscuro, tipografías "Outfit", paletas de color gubernamentales como `dr-blue` y `dr-red`).
- **`calculadora.html`**: Calculadora Fiscal. Ejecuta el cálculo de retenciones del Impuesto Sobre la Renta (ISR) para personas físicas o jurídicas, apoyado en la escala progresiva vigente en RD.
- **`prestaciones.html`**: Calculadora de Prestaciones Laborales. Contempla el código de trabajo dominicano, calculando preaviso, cesantía, vacaciones y salario de navidad (regalía pascual) de forma dinámica mediante JavaScript en el cliente.
- **`divisas.html`**: Plataforma de Conversión de Monedas. Interfaz que transforma montos entre diferentes pares de divisas extranjeras hacia y desde el Peso Dominicano (DOP).
- **Integraciones de 3eros (`js/firebase-analytics.js`)**: Conexión base configurada para la ingesta de métricas de uso y telemetría a través de Firebase/Google Analytics.

---

## 2. Tecnologías Clave Utilizadas
* **Capa Estructural y Estilos:** HTML5 Semántico, Tailwind CSS (inyectado vía CDN/nube para agilidad de cambios).
* **Capa Lógica Lado del Cliente:** JavaScript (Vanilla JS), `fetch` API.
* **Capa Backend / Proxys Seguros:** Google Apps Script (Servicio Serverless, `bcrd_scraper.gs`).

---

## 3. Bitácora de Actualizaciones

A continuación se documentan las intervenciones críticas y construcciones de nuevas características progresivamente:

### [Actualización] Refactorización del Módulo de Divisas (BCRD Scraper Proxy)
**Fecha:** 5 de Abril de 2026
**Objetivo:** Aumentar la frecuencia de sincronización de la tasa del dólar de 1 vez al día a actualizaciones constantes de 1 hora, consumiendo el Banco Central oficial en lugar de tasas base globales promediadas, todo ello eludiendo límites de peticiones (Rate Limit).

**Acciones Realizadas:**
1. **Creación del Backend Personalizado (`js/bcrd_scraper.gs`):** 
   - Se diseñó un script independiente en Google Apps Script que raspa (scrapea) explícitamente el HTML en vivo de `https://www.bancentral.gov.do/`.
   - Se programa una expresión regular (Regex) robusta para conseguir los valores oficiales de "Compra" y "Venta" del USD con respecto al DOP.
   - El script atrapa cualquier fallo y cuenta con la lógica auxiliar de inyectar las métricas de otras monedas como respaldo usando `ExchangeRate-API`.
   - **Manejo de Caché Térmica (`CacheService`):** El backend almacena en la nube la respuesta durante el lapso estricto de **60 minutos**. Esto garantiza velocidad milisegundo en la entrega de la tasa en `divisas.html` a miles de usuarios sin bloquear los servidores del BCRD.

2. **Reconfiguración del Frontend (`divisas.html`):**
   - Eliminación de la vulnerabilidad de cuotas gratuitas apuntando al Web App Exec de Apps Script provisto como "Endpoint".
   - Modificación inteligente (Condicional UX) en el bloque frontal de información `Tasa de Cambio del Día`: El panel HTML ahora reconoce si la respuesta de la nube es "Oficial" o Global. Si es Oficial BCRD, emite dinámicamente dos métricas de valor (Compra y Venta separado) en texto resaltado, omitiendo la unificación plana del sistema anterior.

3. **[Hotfix] Adaptación del Regex BCRD y Cache:**
   - Se ajustó la expresión regular en el script para mitigar la inyección de saltos de línea (`\s*`) invisibles del lado del portal BCRD que rompían la lectura de tasas.
   - Rotación manual de la clave temporal (`tasas_v2`) para forzar la expiración de caché de Google.

### [Actualización] Reorganización Estética (Landing UI/UX)
**Fecha:** 5 de Abril de 2026
**Objetivo:** Afinar la estética de la Landing Page principal tras la integración de las Divisas, purificando la jerarquía visual de los Call-to-Actions (CTAs) y la simetría del área de Pilares Financieros.

**Acciones Realizadas (`index.html`):**
1. **Simetría de Tarjetas:** Fusión del pilar "AFP" y "ARS" bajo un consolidado llamado **Seguridad Social (TSS)**. Esto restauró la simetría par visual (6 tarjetas / 2 filas completas en Grid).
2. **Jerarquización del Footer:** Destrucción y reemplazo del bloque de tarjetas pesadas de "Contacto/Legal" en favor de 3 logotipos sutiles e iterativos en la zona inferior.
3. **Optimización SEO:** Expansión del Título, Meta Tags y Keywords, integrando "Divisas", "Banco Central" y "Dólar".

### [Estándar Técnico] Implementación Progressive Web App (PWA)
**Fecha:** 5 de Abril de 2026
**Objetivo:** Transformar Impucálculo de un portal web tradicional a una plataforma móvil de nivel nativo instalable y compatible con funcionamientos sin conexión (offline mode) para optimizar la experiencia financiera sin interrupciones.

**Acciones Realizadas:**
1. **Generación de `manifest.json` y Assets:** Se integró un manifiesto web que define a Impucálculo como un `standalone` app con identidad de tema `dr-blue` (#0038A8) y mapeo estricto a las variaciones de iconos de alta resolución (`192px` y `512px`).
2. **Infraestructura de `sw.js` (Service Worker):**
   - **Pre-Cache:** La aplicación registra de manera silenciosa (en background) todos los pilares HTML y el motor gráfico de iconos.
   - **Políticas de Cache:** Se activó la estrategia *Network First* para las transacciones dinámicas y enrutado central de plantillas HTML y un *Cache First* sólido para alijerar el peso estático de imágenes y fuentes tipográficas.
3. **Enganche y Botón Instalador:** A través de API nativas del entorno Google Chrome/PWA (`beforeinstallprompt`), todos los modulos inyectan un botón flotante reactivo de instalación de uso contextual.
4. **[Hotfix] Dimensiones Exactas de Íconos PWA:** Se procesaron y redimensionaron los íconos de la app instalable a medidas matemáticamente cuadradas en pixeles (exactamente `192x192` y `512x512`) utilizando un script de *padding* transparente para evadir las restricciones estrictas del motor de PWA en Google Chrome (especialmente en macOS) y garantizar la renderización del logo corporativo en el sistema operativo y Launchpad.

---

*Nota: Cualquier desarrollador o técnico que construya en Impucálculo de forma concurrente, deberá registrar su intervención bajo la sección de la Bitácora para preservar la trazabilidad de esta herramienta.*
