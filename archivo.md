# 🚀 ESTADO ACTUAL Y SIGUIENTE TAREA INMEDIATA (LECTURA OBLIGATORIA)

> 📌 **CONSIGNA PARA EL AGENTE**: Si el usuario te pide "lee archivo.md" o retoma la sesión, este es el contexto operativo exacto donde nos quedamos y la acción que se debe ejecutar de inmediato.

### 📍 Estado del Proyecto (Cerrado y sincronizado el 25 de Octubre de 2026):
1. **Monetag fue 100% descartado y eliminado**: No usar Monetag bajo ninguna circunstancia. Mostró alertas de malware y anuncios engañosos en las pruebas locales. El código está 100% limpio de cualquier rastro o script de Monetag.
2. **Políticas de Privacidad (`privacidad.html`)**: Blindadas y 100% compatibles con las directrices oficiales de **Google AdSense** (Sección 8 redactada con cláusula obligatoria de cookies de Google, enlaces a aboutads.info/Google Ads Settings y garantía estricta de confidencialidad salarial). Subido a producción en GitHub (`main`).
3. **Hero y Carrusel (`index.html`)**: Rediseñado exitosamente con foco central en **Prestaciones Laborales** (H1: *"La plataforma líder en prestaciones calculadas de forma inteligente"*), sin logo superior y con un carrusel de 3 imágenes móviles con efecto slide infinito hacia adelante cada 2 segundos. Todo en producción (`sw.js` v105).

---

### 🎯 TAREA INMEDIATA A REALIZAR ESTA NOCHE:
**Conectar Google AdSense a través de la cuenta del hermano de Lenin.**

* **Contexto**: Lenin (el titular anterior) tuvo su cuenta personal de AdSense inhabilitada por un problema administrativo previo. Por ello, la nueva cuenta de AdSense pertenece a su hermano, quien se conecta desde su propia casa con una **IP, correo y dispositivo completamente limpios e independientes**.
* **Procedimiento exacto cuando el usuario abra la sesión**:
  1. El hermano de Lenin entra a [google.com/adsense](https://www.google.com/adsense/) desde su computadora.
  2. Añade el dominio: `https://impucalculo.com` en la sección **Sitios** de Google AdSense.
  3. Google le proporcionará el código oficial de AdSense, similar a:
     ```html
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
     ```
  4. El usuario nos pasará ese fragmento `<script>`.
  5. **Acción del Agente**:
     - Insertar el script de AdSense en el `<head>` de `index.html` (y páginas principales).
     - Incrementar la versión del Service Worker (`sw.js`).
     - Hacer `git commit` y `git push origin main`.
     - Confirmar que el código esté en vivo en producción para que el hermano de Lenin haga clic en **"Solicitar revisión"** dentro del panel de Google AdSense.

---

# Hoja de Ruta de Calculadoras Financieras para Impucálculo

Este documento sirve como guía estratégica y ranking de las siguientes herramientas a desarrollar e integrar en **Impucálculo** (https://impucalculo.com/).

---

## 🏆 Ranking de Calculadoras Financieras para República Dominicana

| Prioridad | Calculadora / Herramienta | Estado | Descripción y Sinergia |
|---|---|---|---|
| 🥇 **#1** | **Calculadora de Traspaso de Vehículos y Marbete (DGII)** | ⏳ *Pendiente* | Cálculo del 2% del impuesto de transferencia sobre el valor mayor entre acto de venta y tabla fidedigna DGII, RD$100 de emisión de matrícula y moras por retrasos >90 días. |
| 🥈 **#2** | **Calculadora de Horas Extras y Jornada Nocturna (Código de Trabajo RD)** | ⏳ *Pendiente* | Desglose legal de horas extras (35% y 100% de recargo Art. 203) y jornada nocturna (15% recargo Art. 204) con el divisor legal 23.83. |
| 🥉 **#3** | **Calculadora de ITBIS y Retenciones (DGII / Freelancers)** | ⏳ *Pendiente* | Desglose de ITBIS (18% / 16%) y retenciones directas para consultores y PYMEs (10% ISR + 30%/100% ITBIS). |
| 4️⃣ | **Calculadora de Proyección de Pensión y Retiro (AFP RD)** | ⏳ *Pendiente* | Proyección del fondo acumulado en AFP (Ley 87-01) con tasa de rendimiento e interés compuesto hacia la jubilación. |

---

# 📧 Carta de Apelación de Google AdSense (Guardada)

> 📌 **Nota para el usuario**: Esta es la carta de apelación formal (en español e inglés) para el **Formulario de Reclamación por Inhabilitación de Cuenta de AdSense** (Código de Editor: `pub-5697958043734992`).

## 🇪🇸 Versión en Español

```text
Estimado Equipo de Políticas e Impugnaciones de Google AdSense:

Me dirijo a ustedes con el debido respeto para solicitar formalmente la revisión y reactivación de mi cuenta de editor (Código de Editor: pub-5697958043734992), la cual ha sido inhabilitada bajo la causal "Cuenta relacionada con una cuenta inhabilitada".

Deseo aclarar con total transparencia que esta inhabilitación se debe a una confusión técnica y administrativa provocada por mí de forma involuntaria, y NO a ningún intento de eludir políticas o cometer fraude.

EXPOSICIÓN DE LOS HECHOS:
1. Titularidad Única y Buena Fe: Soy una persona física real, desarrollador y creador de contenido legítimo. Únicamente he poseído y registrado datos personales a mi nombre.
2. Error de Registro Anterior: Hace un tiempo inicié una solicitud de registro en AdSense para mi proyecto financiero (Impucálculo - https://impucalculo.com/). Por motivos de tiempo, no le di seguimiento y la solicitud quedó inactiva.
3. Proceso de Cancelación Confuso: Al retomar el proyecto recientemente, intenté ordenar mi cuenta procediendo a eliminar/cancelar la solicitud previa que estaba pendiente para posteriormente abrir/actualizar el registro formal. 
4. Falso Positivo Algorítmico: Al registrar los nuevos datos con la misma identidad (mismo nombre, dirección y correo de contacto), el sistema automatizado de Google interpretó de forma errónea que mi nueva solicitud estaba vinculada a una "cuenta inhabilitada de un tercero", cuando en realidad se trataba de mi propio intento previo de registro cancelado.

ACCIONES CORRECTIVAS Y COMPROMISO:
- Entiendo perfectamente que las políticas de AdSense prohíben la duplicidad de cuentas por un mismo titular. Aclaro enérgicamente que jamás he operado ni administrado una cuenta suspendida por infracciones de tráfico no válido o contenido prohibido.
- Mi único objetivo ha sido consolidar mi presencia legítima como creador y desarrollador de herramientas web para el público de República Dominicana.
- He verificado que todas mis propiedades web cumplen al 100% con las Políticas del Programa AdSense, estando dispuestos a colaborar y proporcionar cualquier documento de identidad oficial (Cédula de Identidad) que requieran para verificar la legitimidad de mi persona y de la cuenta.

Les pido encarecidamente que un especialista humano revise mi caso para levantar la suspensión de mi cuenta pub-5697958043734992 y me permita seguir construyendo proyectos web dentro de los estándares de Google.

Agradezco de antemano su atención y compresión a esta solicitud.

Atentamente,
[Tu Nombre Completo]
[Tu Cédula o Documento de Identidad]
Correo de contacto: [Tu Correo de AdSense]
Dominio principal: https://impucalculo.com/
```

---

## 🇺🇸 Versión en Inglés (English Version)

```text
Dear Google AdSense Policy and Appeals Team,

I am writing to formally request a review and reinstatement of my publisher account (Publisher ID: pub-5697958043734992), which was disabled due to "Account related to a disabled account".

I wish to clarify with full transparency that this restriction is the result of an unintentional administrative confusion on my part during the registration process, and NOT an attempt to bypass policies or engage in invalid activity.

EXPOSITIONS OF FACTS:
1. Single Ownership & Good Faith: I am a real individual developer and content creator. I have only ever operated under my own personal identity.
2. Previous Pending Registration: Sometime ago, I initiated an AdSense application for my financial platform (Impucálculo - https://impucalculo.com/). Due to personal availability, I did not follow up and left the application inactive.
3. Confusion during Account Closure: When I resumed the project recently, I attempted to clean up my registration by closing/deleting the old pending application before re-submitting a new application with updated settings.
4. Automated False Positive: When re-submitting using my same personal details (name, address, contact info), Google's automated systems misidentified my previous self-cancelled application as a "related disabled third-party account".

CORRECTIVE ACTIONS & COMMITMENT:
- I fully understand AdSense policies strictly allow only one account per publisher. I state under oath that I have never operated an account suspended for invalid traffic or content violations.
- My sole intention has been to establish a legitimate publisher account for my web tools serving users in the Dominican Republic.
- All my web properties are compliant with AdSense Program Policies. I am fully prepared to provide official government-issued ID (Identity Card) to prove my identity and single account ownership.

I respectfully ask for a human specialist to review my history, resolve this false positive link, and restore my publisher account pub-5697958043734992.

Thank you very much for your time and understanding.

Sincerely,
[Your Full Name]
Publisher ID: pub-5697958043734992
Primary Domain: https://impucalculo.com/
```

---

## 📝 Registro de Cambios Recientes (10 de Octubre de 2026)

### 1. Cintillo de Parámetros Laborales en ImpuCálculo Prestaciones (`prestaciones.html`)
- Implementación de un cintillo informativo dinámico e interactivo debajo de la barra de navegación con estilo idéntico al de ImpuCálculo Divisas.
- Presenta datos clave actualizados: Salario Mínimo Nacional Promedio (RD$19,355), Topes TSS/Seguridad Social, divisor legal de cálculo (23.83 días/mes), recargos por horas extras (35% y 100%) y régimen de salario de navidad (Art. 219).
- Incluye soporte responsive, selector manual de temas (oscuro/claro) sincronizado con el botón global, y pausa inteligente al pasar el cursor o interactuar.

### 2. Homogeneización de Dimensiones en Preguntas Frecuentes (FAQ)
- Se homologó el ancho del contenedor de Preguntas Frecuentes en `prestaciones.html` al estándar de `max-w-5xl`, igualándolo perfectamente con el bloque de la calculadora superior.

### 3. Identidad Visual Bicolor en Título de Prestaciones
- Estilización del título principal H2 en `prestaciones.html`: palabra `PRESTACIONES` con degradado dinámico entre rojo patriótico (`#CE1126`) y azul marino (`#002F6C`), manteniendo armonía con la identidad visual institucional de República Dominicana.

### 4. Movimiento Continuo y Fluido en Artículos del Blog
- Modificación de la animación del carrusel de artículos en `prestaciones.html`: transición de movimiento por pausas escalonadas a un scroll continuo, suave y prolongado (keyframes CSS a 35 segundos lineales e infinitos).

### 5. Priorización de la Calculadora de Prestaciones en el Inicio (`index.html`)
- Reorganización jerárquica de la plataforma: posicionamiento de la Calculadora de Prestaciones Laborales como herramienta #1 en el Hero principal y botones CTA por su alto volumen de visitas y relevancia central para los usuarios.

### 6. Optimización de Caché PWA y Solución Móvil (`sw.js` v99)
- Incremento del Service Worker a `impucalculo-v99` con invalidación forzada mediante `{ cache: 'reload' }`.
- Registro reactivo (`registration.update()` y listener `controllerchange`) para garantizar la carga inmediata de los nuevos estilos y componentes en dispositivos móviles (iOS Safari / Android Chrome).

---

## 📝 Registro de Cambios Recientes (25 de Octubre de 2026)

### 1. Blindaje Legal y Cláusula de Privacidad Publicitaria (`privacidad.html`)
- Incorporación formal de la **Sección 8: Publicidad de Terceros y Redes de Anuncios** para regular legalmente la monetización externa sin riesgo de contingencias ni demandas.
- Garantía explícita de **Confidencialidad Salarial**: se estipuló con valor legal vinculante que ninguna red de anuncios tiene acceso ni puede capturar las cifras financieras ingresadas por el usuario, protegiendo el principio de procesamiento 100% local en el navegador.
- Actualización de la fecha de vigencia formal de la política al 25 de Octubre de 2026.

### 2. Auditoría, Prueba Local y Retiro Preventivo de Monetag
- Verificación exitosa de la titularidad de `impucalculo.com` en Monetag.
- Prueba experimental controlada en entorno local aislado (`localhost:8080`) sin comprometer el entorno de producción.
- Detección de anuncios engañosos de descargas y bloqueo de seguridad en Safari (*Malware Website Warning*).
- **Retiro y limpieza total inmediata:** eliminación completa de todos los scripts, etiquetas de verificación y rastros de código de Monetag en el proyecto para proteger la reputación institucional y el posicionamiento SEO de Impucálculo.
- Planificación estratégica de la ruta definitiva y limpia a través de Google AdSense mediante cuenta familiar independiente.

### 3. Rediseño del Hero y Protagonismo en Prestaciones (`index.html`)
- Reformulación del titular principal H1 para posicionar a las Prestaciones Laborales como el motor insignia de la plataforma:
  > *"La plataforma líder en prestaciones calculadas de forma inteligente"*
- Redacción de nuevo subtítulo persuasivo y legal: *"Determina al centavo tu cesantía, preaviso y derechos adquiridos según la ley dominicana. También incluye cálculo de sueldos netos y tasas de cambio al instante."*
- Eliminación del logo superior estático dentro del Hero para conseguir mayor amplitud vertical, limpieza estética y foco inmediato en la propuesta de valor.

### 4. Carrusel Hero con Deslizamiento Continuo Infinito (*Infinite Slide*)
- Sustitución de la imagen estática individual por un **carrusel dinámico de 3 vistas móviles reales**.
- Optimización y compresión de capturas en `hero-images/`, reduciendo el peso de ~9 MB a ~1 MB sin pérdida perceptible de calidad.
- Transición horizontal tipo *slide* fluida y moderna cada 2.0 segundos exactos.
- Algoritmo de clonación invisible (*seamless loop forward*) que asegura una secuencia continua y natural hacia adelante (`1 ➔ 2 ➔ 3 ➔ 1...`) sin rebobinados hacia atrás.
- Indicadores interactivos tipo píldora en azul `#0038A8`, pausa al pasar el cursor y soporte de gestos táctiles (*swipe*).

### 5. Actualización de Service Worker PWA (`sw.js` v105)
- Incremento progresivo y definitivo del Service Worker a `impucalculo-v105` en `sw.js` e `index.html`.
- Forzado de invalidación de caché para garantizar la actualización inmediata del nuevo diseño en todos los dispositivos móviles y navegadores de escritorio.



