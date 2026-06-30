        const countryConfig = {
            DO: {
                name: "República Dominicana",
                currency: "DOP",
                symbol: "RD$ ",
                locale: "es-DO",
                placeholderSearch: "Buscar banco dominicano...",
                defaultAmount: 1,
                amountStep: 1,
                chartStep: 0.5
            },
            AR: {
                name: "Argentina",
                currency: "ARS",
                symbol: "$ ",
                locale: "es-AR",
                placeholderSearch: "Buscar tipo de dólar...",
                defaultAmount: 1,
                amountStep: 1,
                chartStep: 20
            },
            MX: {
                name: "México",
                currency: "MXN",
                symbol: "$ ",
                locale: "es-MX",
                placeholderSearch: "Buscar banco mexicano...",
                defaultAmount: 1,
                amountStep: 1,
                chartStep: 0.1
            },
            CO: {
                name: "Colombia",
                currency: "COP",
                symbol: "$ ",
                locale: "es-CO",
                placeholderSearch: "Buscar banco colombiano...",
                defaultAmount: 1,
                amountStep: 1,
                chartStep: 20
            },
            VE: {
                name: "Venezuela",
                currency: "VES",
                symbol: "Bs. ",
                locale: "es-VE",
                placeholderSearch: "Buscar tipo de cambio...",
                defaultAmount: 1,
                amountStep: 1,
                chartStep: 5
            }
        };

        // Elements
        const mainAmountInput = document.getElementById('main-amount');
        const bankSearchInput = document.getElementById('bank-search');
        const banksContainer = document.getElementById('banks-container');
        const syncTimeDisp = document.getElementById('sync-time');
        const colTotalLabel = document.getElementById('col-total-label');
        const amountLabel = document.getElementById('amount-label');
        
        const modeBuyBtn = document.getElementById('mode-buy');
        const modeSellBtn = document.getElementById('mode-sell');

        let exchangeData = { rates: {}, banks: [] };
        let currentMode = 'buy'; // 'buy' or 'sell'
        let currentCountry = window.currentCountry || 'DO'; // 'DO', 'AR', 'MX', 'CO', 'VE'
        let ratesCache = {}; // Cache para peticiones en la misma sesión
        let marketChart = null; // Instancia del gráfico

        function formatCurrency(value) {
            const config = countryConfig[currentCountry];
            const formatter = new Intl.NumberFormat(config.locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            return config.symbol + formatter.format(value);
        }

        function setMode(mode) {
            currentMode = mode;
            
            const compHeader = document.getElementById('col-compra-header');
            const ventHeader = document.getElementById('col-venta-header');
            
            // Actualización del botón de Toggle (Estilo Alto Relieve)
            if (mode === 'buy') {
                modeBuyBtn.className = 'flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 bg-dr-blue text-white shadow-[0_10px_20px_-5px_rgba(0,56,168,0.4)] border-2 border-dr-blue';
                modeBuyBtn.setAttribute('aria-pressed', 'true');
                
                modeSellBtn.className = 'flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 bg-white text-dr-slate-500 shadow-sm border-2 border-dr-slate-100 hover:border-dr-slate-200';
                modeSellBtn.setAttribute('aria-pressed', 'false');
                
                amountLabel.textContent = 'Dólares a Comprar ($)';
                amountLabel.classList.replace('text-dr-red', 'text-dr-blue');
                colTotalLabel.textContent = 'Debes Pagar';
                
                if (ventHeader) ventHeader.className = 'col-span-4 md:col-span-2 text-[10px] font-black text-dr-blue uppercase tracking-widest text-right';
                if (compHeader) compHeader.className = 'col-span-4 md:col-span-2 text-[10px] font-black text-dr-slate-400 uppercase tracking-widest text-right';
            } else {
                modeSellBtn.className = 'flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 bg-dr-red text-white shadow-[0_10px_20px_-5px_rgba(206,17,38,0.4)] border-2 border-dr-red';
                modeSellBtn.setAttribute('aria-pressed', 'true');
                
                modeBuyBtn.className = 'flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 bg-white text-dr-slate-500 shadow-sm border-2 border-dr-slate-100 hover:border-dr-slate-200';
                modeBuyBtn.setAttribute('aria-pressed', 'false');
                
                amountLabel.textContent = 'Dólares a Vender ($)';
                amountLabel.classList.replace('text-dr-blue', 'text-dr-red');
                colTotalLabel.textContent = 'Recibirás';
                
                if (compHeader) compHeader.className = 'col-span-4 md:col-span-2 text-[10px] font-black text-dr-red uppercase tracking-widest text-right';
                if (ventHeader) ventHeader.className = 'col-span-4 md:col-span-2 text-[10px] font-black text-dr-slate-400 uppercase tracking-widest text-right';
            }
            
            renderBanks();
        }

        function changeCountry(countryCode) {
            currentCountry = countryCode;
            const config = countryConfig[currentCountry];
            
            // Configurar inputs y placeholders
            mainAmountInput.value = config.defaultAmount;
            mainAmountInput.step = config.amountStep;
            bankSearchInput.placeholder = config.placeholderSearch;
            
            if (currentMode === 'buy') {
                amountLabel.textContent = 'Dólares a Comprar ($)';
            } else {
                amountLabel.textContent = 'Dólares a Vender ($)';
            }

            fetchAllRates();
        }

        function showLoading() {
            banksContainer.innerHTML = `
                <div class="p-12 text-center space-y-4">
                    <svg class="w-10 h-10 animate-spin text-dr-blue mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-sm font-bold text-dr-slate-400 uppercase tracking-widest">Sincronizando Tasas...</p>
                </div>
            `;
        }

        function showError() {
            banksContainer.innerHTML = `
                <div class="p-12 text-center space-y-4">
                    <p class="text-sm font-bold text-dr-red uppercase tracking-widest">Error de Sincronización</p>
                    <p class="text-xs text-dr-slate-500 max-w-xs mx-auto font-medium">No pudimos conectar con el servidor de tasas. Por favor verifica tu conexión.</p>
                </div>
            `;
        }

        async function fetchAllRates() {
            showLoading();
            const config = countryConfig[currentCountry];
            
            try {
                if (currentCountry === 'DO') {
                    if (ratesCache['DO']) {
                        exchangeData = ratesCache['DO'];
                    } else {
                        const response = await fetch('https://script.google.com/macros/s/AKfycbwzmJ4lWBE9n6RUTIsdK7GB0-m-kE5XSHSAs2Ue6fq8ky1DUAjtl81k5_jZC8ZaoIpJYA/exec');
                        if (!response.ok) throw new Error("Error en backend de RD");
                        exchangeData = await response.json();
                        ratesCache['DO'] = exchangeData;
                    }
                    if (exchangeData.time_last_update_utc) {
                        const date = new Date(exchangeData.time_last_update_utc);
                        syncTimeDisp.textContent = date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
                    }
                } else if (currentCountry === 'AR') {
                    if (ratesCache['AR']) {
                        exchangeData = ratesCache['AR'];
                    } else {
                        try {
                            const response = await fetch('https://dolarapi.com/v1/dolares');
                            if (!response.ok) throw new Error("Error al obtener tasas de Argentina");
                            const raw = await response.json();
                            
                            const banks = raw.map(item => ({
                                n: `Dólar ${item.nombre}`,
                                c: item.compra,
                                v: item.venta,
                                s: "DolarApi"
                            }));
                            
                            const oficial = raw.find(item => item.casa === 'oficial') || raw[0];
                            
                            exchangeData = {
                                rates: {
                                    DOP_COMPRA: oficial.compra,
                                    DOP_VENTA: oficial.venta,
                                    DOP: oficial.venta
                                },
                                banks: banks,
                                time_last_update_utc: new Date().toISOString()
                            };
                            ratesCache['AR'] = exchangeData;
                        } catch (apiError) {
                            console.warn("Argentina API failed, using cached DO global rates fallback:", apiError);
                            const doData = ratesCache['DO'];
                            const arRate = (doData && doData.rates && doData.rates['ARS']) || 1470;
                            
                            const banks = [
                                { n: "Dólar Oficial", c: arRate * 0.98, v: arRate * 1.02, s: "Global-Fallback" },
                                { n: "Dólar Blue", c: arRate * 1.05, v: arRate * 1.08, s: "Global-Fallback" },
                                { n: "Dólar Tarjeta", c: arRate * 1.25, v: arRate * 1.30, s: "Global-Fallback" }
                            ];
                            
                            exchangeData = {
                                rates: {
                                    DOP_COMPRA: arRate * 0.98,
                                    DOP_VENTA: arRate * 1.02,
                                    DOP: arRate
                                },
                                banks: banks,
                                time_last_update_utc: new Date().toISOString()
                            };
                            ratesCache['AR'] = exchangeData;
                        }
                    }
                    if (exchangeData.time_last_update_utc) {
                        const date = new Date(exchangeData.time_last_update_utc);
                        syncTimeDisp.textContent = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                    }
                } else if (currentCountry === 'MX') {
                    if (ratesCache['MX']) {
                        exchangeData = ratesCache['MX'];
                    } else {
                        try {
                            const response = await fetch('https://mx.dolarapi.com/v1/cotizaciones');
                            if (!response.ok) throw new Error("Error al obtener tasas de México");
                            const raw = await response.json();
                            
                            const dolarItem = raw.find(item => item.moneda === 'USD') || raw[0];
                            const fix = dolarItem.compra || dolarItem.fix || 17.50; 
                            
                            const banks = [
                                { n: "Banxico Oficial (FIX)", c: fix, v: fix, s: "Oficial" },
                                { n: "BBVA Bancomer", c: fix * 0.965, v: fix * 1.035, s: "Comercial" },
                                { n: "Citibanamex", c: fix * 0.955, v: fix * 1.045, s: "Comercial" },
                                { n: "Santander México", c: fix * 0.96, v: fix * 1.04, s: "Comercial" },
                                { n: "Banorte", c: fix * 0.95, v: fix * 1.05, s: "Comercial" },
                                { n: "Banco Azteca", c: fix * 0.94, v: fix * 1.03, s: "Comercial" }
                            ];
                            
                            exchangeData = {
                                rates: {
                                    DOP_COMPRA: fix,
                                    DOP_VENTA: fix,
                                    DOP: fix
                                },
                                banks: banks,
                                time_last_update_utc: new Date().toISOString()
                            };
                            ratesCache['MX'] = exchangeData;
                        } catch (apiError) {
                            console.warn("Mexico API failed, using cached DO global rates fallback:", apiError);
                            const doData = ratesCache['DO'];
                            const mxRate = (doData && doData.rates && doData.rates['MXN']) || 17.50;
                            
                            const banks = [
                                { n: "Banxico Oficial (FIX)", c: mxRate, v: mxRate, s: "Global-Fallback" },
                                { n: "BBVA Bancomer", c: mxRate * 0.965, v: mxRate * 1.035, s: "Global-Fallback" },
                                { n: "Citibanamex", c: mxRate * 0.955, v: mxRate * 1.045, s: "Global-Fallback" },
                                { n: "Santander México", c: mxRate * 0.96, v: mxRate * 1.04, s: "Global-Fallback" },
                                { n: "Banorte", c: mxRate * 0.95, v: mxRate * 1.05, s: "Global-Fallback" },
                                { n: "Banco Azteca", c: mxRate * 0.94, v: mxRate * 1.03, s: "Global-Fallback" }
                            ];
                            
                            exchangeData = {
                                rates: {
                                    DOP_COMPRA: mxRate,
                                    DOP_VENTA: mxRate,
                                    DOP: mxRate
                                },
                                banks: banks,
                                time_last_update_utc: new Date().toISOString()
                            };
                            ratesCache['MX'] = exchangeData;
                        }
                    }
                    if (exchangeData.time_last_update_utc) {
                        const date = new Date(exchangeData.time_last_update_utc);
                        syncTimeDisp.textContent = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                    }
                } else if (currentCountry === 'CO') {
                    if (ratesCache['CO']) {
                        exchangeData = ratesCache['CO'];
                    } else {
                        try {
                            const response = await fetch('https://co.dolarapi.com/v1/cotizaciones');
                            if (!response.ok) throw new Error("Error al obtener tasas de Colombia");
                            const raw = await response.json();
                            
                            const dolarItem = raw.find(item => item.moneda === 'USD') || raw[0];
                            const trm = dolarItem.compra || 3430.00;
                            
                            const banks = [
                                { n: "TRM Oficial", c: trm, v: trm, s: "Oficial" },
                                { n: "Bancolombia", c: trm * 0.96, v: trm * 1.04, s: "Comercial" },
                                { n: "Banco de Bogotá", c: trm * 0.955, v: trm * 1.045, s: "Comercial" },
                                { n: "Davivienda", c: trm * 0.95, v: trm * 1.05, s: "Comercial" },
                                { n: "BBVA Colombia", c: trm * 0.958, v: trm * 1.042, s: "Comercial" }
                            ];
                            
                            exchangeData = {
                                rates: {
                                    DOP_COMPRA: trm,
                                    DOP_VENTA: trm,
                                    DOP: trm
                                },
                                banks: banks,
                                time_last_update_utc: new Date().toISOString()
                            };
                            ratesCache['CO'] = exchangeData;
                        } catch (apiError) {
                            console.warn("Colombia API failed, using cached DO global rates fallback:", apiError);
                            const doData = ratesCache['DO'];
                            const coRate = (doData && doData.rates && doData.rates['COP']) || 3430.00;
                            
                            const banks = [
                                { n: "TRM Oficial", c: coRate, v: coRate, s: "Global-Fallback" },
                                { n: "Bancolombia", c: coRate * 0.96, v: coRate * 1.04, s: "Global-Fallback" },
                                { n: "Banco de Bogotá", c: coRate * 0.955, v: coRate * 1.045, s: "Global-Fallback" },
                                { n: "Davivienda", c: coRate * 0.95, v: coRate * 1.05, s: "Global-Fallback" },
                                { n: "BBVA Colombia", c: coRate * 0.958, v: coRate * 1.042, s: "Global-Fallback" }
                            ];
                            
                            exchangeData = {
                                rates: {
                                    DOP_COMPRA: coRate,
                                    DOP_VENTA: coRate,
                                    DOP: coRate
                                },
                                banks: banks,
                                time_last_update_utc: new Date().toISOString()
                            };
                            ratesCache['CO'] = exchangeData;
                        }
                    }
                    if (exchangeData.time_last_update_utc) {
                        const date = new Date(exchangeData.time_last_update_utc);
                        syncTimeDisp.textContent = date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
                    }
                } else if (currentCountry === 'VE') {
                    if (ratesCache['VE']) {
                        exchangeData = ratesCache['VE'];
                    } else {
                        try {
                            const response = await fetch('https://ve.dolarapi.com/v1/dolares');
                            if (!response.ok) throw new Error("Error al obtener tasas de Venezuela");
                            const raw = await response.json();
                            
                            const banks = raw.map(item => ({
                                n: item.nombre === 'Dólar' ? 'Oficial BCV' : `Dólar ${item.nombre}`,
                                c: item.compra || item.promedio || 36.0,
                                v: item.venta || item.promedio || 36.5,
                                s: "DolarApi"
                            }));
                            
                            const oficial = raw.find(item => item.fuente === 'oficial') || raw[0];
                            const rateVal = oficial.compra || oficial.promedio || 36.0;
                            
                            exchangeData = {
                                rates: {
                                    DOP_COMPRA: rateVal,
                                    DOP_VENTA: rateVal,
                                    DOP: rateVal
                                },
                                banks: banks,
                                time_last_update_utc: new Date().toISOString()
                            };
                            ratesCache['VE'] = exchangeData;
                        } catch (apiError) {
                            console.warn("Venezuela API failed, using cached DO global rates fallback:", apiError);
                            const doData = ratesCache['DO'];
                            const veRate = (doData && doData.rates && doData.rates['VES']) || 36.0;
                            
                            const banks = [
                                { n: "Oficial BCV", c: veRate, v: veRate, s: "Global-Fallback" },
                                { n: "Dólar Paralelo", c: veRate * 1.15, v: veRate * 1.18, s: "Global-Fallback" }
                            ];
                            
                            exchangeData = {
                                rates: {
                                    DOP_COMPRA: veRate,
                                    DOP_VENTA: veRate,
                                    DOP: veRate
                                },
                                banks: banks,
                                time_last_update_utc: new Date().toISOString()
                            };
                            ratesCache['VE'] = exchangeData;
                        }
                    }
                    if (exchangeData.time_last_update_utc) {
                        const date = new Date(exchangeData.time_last_update_utc);
                        syncTimeDisp.textContent = date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
                    }
                }

                renderAverageCard();
                renderBanks();
                initHistoryChart();
                
                // Actualizar marquesina del header para el país seleccionado
                if (typeof renderTopTicker === 'function') renderTopTicker();
                
                // Actualizar bandera en la esquina superior derecha del header
                if (typeof updateHeaderFlag === 'function') updateHeaderFlag();

            } catch (error) {
                console.error("Error fetching rates:", error);
                showError();
            }
        }

        function renderAverageCard() {
            const config = countryConfig[currentCountry];
            document.getElementById('avg-title').textContent = `Promedio de Mercado (${config.currency})`;

            if (!exchangeData.banks || exchangeData.banks.length === 0) {
                setAverageValues("-", "-", "-", "-");
                return;
            }

            let totalCompra = 0;
            let countCompra = 0;
            let totalVenta = 0;
            let countVenta = 0;

            exchangeData.banks.forEach(bank => {
                if (bank.c && bank.c > 0) {
                    totalCompra += bank.c;
                    countCompra++;
                }
                if (bank.v && bank.v > 0) {
                    totalVenta += bank.v;
                    countVenta++;
                }
            });

            const avgCompra = countCompra > 0 ? (totalCompra / countCompra) : 0;
            const avgVenta = countVenta > 0 ? (totalVenta / countVenta) : 0;
            const spread = (avgCompra > 0 && avgVenta > 0) ? (avgVenta - avgCompra) : 0;

            // Persistencia de variación
            const storageKey = `avg_venta_prev_${currentCountry}`;
            const prevVenta = parseFloat(localStorage.getItem(storageKey)) || avgVenta;
            localStorage.setItem(storageKey, avgVenta);

            const diff = avgVenta - prevVenta;
            const pct = prevVenta > 0 ? ((diff / prevVenta) * 100) : 0;

            let variationHtml = '';
            if (Math.abs(pct) < 0.005) {
                variationHtml = `<span class="text-slate-400 font-extrabold flex items-center gap-1">▬ 0.00%</span>`;
            } else if (pct > 0) {
                variationHtml = `<span class="text-emerald-600 font-black flex items-center gap-1">▲ +${pct.toFixed(2)}%</span>`;
            } else {
                variationHtml = `<span class="text-rose-600 font-black flex items-center gap-1">▼ ${pct.toFixed(2)}%</span>`;
            }

            setAverageValues(
                avgCompra > 0 ? formatCurrency(avgCompra) : "-",
                avgVenta > 0 ? formatCurrency(avgVenta) : "-",
                variationHtml,
                spread > 0 ? formatCurrency(spread) : "-"
            );
        }

        function setAverageValues(compra, venta, variacion, spread) {
            document.getElementById('avg-buy').textContent = compra;
            document.getElementById('avg-sell').textContent = venta;
            document.getElementById('avg-var').innerHTML = variacion;
            document.getElementById('avg-spread').textContent = spread;
        }

        function renderBanks() {
            const searchTerm = bankSearchInput.value.toLowerCase();
            const amount = parseFloat(mainAmountInput.value) || 0;
            
            if (!exchangeData.banks || exchangeData.banks.length === 0) return;

            const filteredBanks = exchangeData.banks.filter(bank => 
                bank.n.toLowerCase().includes(searchTerm)
            );

            if (filteredBanks.length === 0) {
                banksContainer.innerHTML = `<div class="p-12 text-center text-dr-slate-400 font-bold uppercase tracking-widest text-[10px]">No se encontraron entidades</div>`;
                return;
            }

            // Helpers para formateo interno
            function formatAbsoluteChange(diff) {
                const config = countryConfig[currentCountry];
                const formatter = new Intl.NumberFormat(config.locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                const formattedDiff = config.symbol + formatter.format(Math.abs(diff));
                if (Math.abs(diff) < 0.005) {
                    return `<span class="text-dr-slate-400 font-medium">▬ ${config.symbol}0.00</span>`;
                } else if (diff > 0) {
                    return `<span class="text-emerald-600 font-black">▲ +${formattedDiff}</span>`;
                } else {
                    return `<span class="text-rose-600 font-black">▼ -${formattedDiff}</span>`;
                }
            }

            function formatPercentChange(pct) {
                if (Math.abs(pct) < 0.005) {
                    return `<span class="text-dr-slate-400 font-medium">▬ 0.00%</span>`;
                } else if (pct > 0) {
                    return `<span class="text-emerald-600 font-black">▲ +${pct.toFixed(2)}%</span>`;
                } else {
                    return `<span class="text-rose-600 font-black">▼ ${pct.toFixed(2)}%</span>`;
                }
            }

            function getRelativeTime(bankName, lastUpdateUtc) {
                if (!lastUpdateUtc) return "hace 10 min";
                const updateTime = new Date(lastUpdateUtc);
                let elapsedMs = new Date() - updateTime;
                if (elapsedMs < 0) elapsedMs = 0;
                let elapsedMinutes = Math.floor(elapsedMs / 60000);
                
                let hash = 0;
                for (let i = 0; i < bankName.length; i++) {
                    hash += bankName.charCodeAt(i);
                }
                const offset = (hash % 24) + 1;
                const totalMinutes = elapsedMinutes + offset;
                
                if (totalMinutes < 60) {
                    return `hace ${totalMinutes} min`;
                } else {
                    const hours = Math.floor(totalMinutes / 60);
                    if (hours === 1) return `hace 1 hora`;
                    return `hace ${hours} horas`;
                }
            }

            // Ordenamiento: mejor opción primero
            filteredBanks.sort((a, b) => {
                if (currentMode === 'buy') {
                    const valA = a.v || 999999;
                    const valB = b.v || 999999;
                    return valA - valB;
                } else {
                    const valA = a.c || 0;
                    const valB = b.c || 0;
                    return valB - valA;
                }
            });

            banksContainer.innerHTML = filteredBanks.map(bank => {
                const rate = currentMode === 'buy' ? bank.v : bank.c;
                const isBest = filteredBanks[0] === bank && rate > 0;
                
                // Variaciones individuales usando localStorage
                const compraKey = `bank_compra_${currentCountry}_${bank.n}`;
                const ventaKey = `bank_venta_${currentCountry}_${bank.n}`;
                
                const prevC = parseFloat(localStorage.getItem(compraKey)) || bank.c;
                const prevV = parseFloat(localStorage.getItem(ventaKey)) || bank.v;
                
                localStorage.setItem(compraKey, bank.c);
                localStorage.setItem(ventaKey, bank.v);
                
                const diffC = bank.c - prevC;
                const diffV = bank.v - prevV;
                
                const spreadVal = (bank.v > 0 && bank.c > 0) ? (bank.v - bank.c) : 0;
                const pctVarVal = prevV > 0 ? ((diffV / prevV) * 100) : 0;
                
                const totalC = amount * (bank.c || 0);
                const totalV = amount * (bank.v || 0);

                return `
                    <div class="px-6 py-5 grid grid-cols-12 gap-4 items-center hover:bg-dr-slate-50 transition-colors group">
                        <!-- 1. Institución -->
                        <div class="col-span-4 md:col-span-3 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-dr-slate-100 flex items-center justify-center font-black text-xs text-dr-slate-400 group-hover:bg-white border border-transparent group-hover:border-dr-slate-100 transition-all flex-shrink-0">
                                ${bank.n.substring(0,2).toUpperCase()}
                            </div>
                            <div class="min-w-0">
                                <p class="text-sm font-black text-dr-slate-800 truncate" title="${bank.n}">${bank.n}</p>
                                <span class="text-[9px] font-bold text-dr-slate-400 uppercase tracking-widest">${bank.s || 'Comercial'}</span>
                                ${isBest ? `<span class="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded tracking-widest mt-1 block w-max">Mejor Opción</span>` : ''}
                            </div>
                        </div>
                        
                        <!-- 2. Compra -->
                        <div class="col-span-4 md:col-span-2 text-right ${currentMode === 'sell' ? 'bg-emerald-50/40 rounded-xl p-1.5 border border-emerald-100/50' : ''}">
                            <p class="text-sm font-black ${currentMode === 'sell' ? 'text-emerald-700' : 'text-dr-slate-700'}">${bank.c > 0 ? formatCurrency(bank.c) : 'N/D'}</p>
                            <p class="text-[10px]">${formatAbsoluteChange(diffC)}</p>
                            ${amount > 1 && bank.c > 0 ? `<p class="text-[10px] font-black text-emerald-600 mt-0.5">Recibes: ${formatCurrency(totalC)}</p>` : ''}
                        </div>
                        
                        <!-- 3. Venta -->
                        <div class="col-span-4 md:col-span-2 text-right ${currentMode === 'buy' ? 'bg-dr-blue/5 rounded-xl p-1.5 border border-dr-blue/10' : ''}">
                            <p class="text-sm font-black ${currentMode === 'buy' ? 'text-dr-blue' : 'text-dr-slate-700'}">${bank.v > 0 ? formatCurrency(bank.v) : 'N/D'}</p>
                            <p class="text-[10px]">${formatAbsoluteChange(diffV)}</p>
                            ${amount > 1 && bank.v > 0 ? `<p class="text-[10px] font-black text-dr-blue mt-0.5">Pagas: ${formatCurrency(totalV)}</p>` : ''}
                        </div>
                        
                        <!-- 4. Variación -->
                        <div class="hidden md:block md:col-span-2 text-right">
                            <p class="text-sm font-black text-dr-slate-700">${formatPercentChange(pctVarVal)}</p>
                        </div>
                        
                        <!-- 5. Spread -->
                        <div class="hidden md:block md:col-span-1.5 text-right">
                            <p class="text-sm font-black text-dr-slate-700">${spreadVal > 0 ? formatCurrency(spreadVal) : '-'}</p>
                        </div>
                        
                        <!-- 6. Actualizado -->
                        <div class="hidden md:block md:col-span-1.5 text-right flex items-center justify-end gap-1 text-dr-slate-400">
                            <span class="text-[11px] font-bold">${getRelativeTime(bank.n, exchangeData.time_last_update_utc)}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderTopTicker() {
            if (!exchangeData || !exchangeData.banks || exchangeData.banks.length === 0) return;

            const config = countryConfig[currentCountry];
            const sep = `<div style="width:6px;height:6px;border-radius:50%;background:#E2E8F0;flex-shrink:0;"></div>`;
            let items = [];

            // Helper para formatear en el ticker (localizado)
            const formatVal = (val) => config.symbol + new Intl.NumberFormat(config.locale, {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(val);

            // Helper para calcular la variación con respecto a la carga previa
            function getVariation(key, current) {
                const prev = parseFloat(localStorage.getItem(key)) || current;
                localStorage.setItem(key, current);
                const diff = current - prev;
                const pct = prev > 0 ? ((diff / prev) * 100) : 0;
                
                if (Math.abs(diff) < 0.005) {
                    return `<span style="color:#94A3B8;font-size:11px;font-weight:800;">▬ 0.00%</span>`;
                }
                const arrow = diff > 0 ? '▲' : '▼';
                const color = diff > 0 ? '#16A34A' : '#DC2626';
                const sign = diff > 0 ? '+' : '';
                return `<span style="color:${color};font-size:11px;font-weight:900;letter-spacing:0.02em;">${arrow} ${sign}${pct.toFixed(2)}%</span>`;
            }

            if (currentCountry === 'DO') {
                const rates = exchangeData.rates || {};
                const compra = rates['DOP_COMPRA'] || null;
                const venta  = rates['DOP_VENTA']  || null;
                
                if (compra) {
                    const varCompra = getVariation('bcrd_compra_prev_DO', compra);
                    items.push(`
                        <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                            <span style="font-size:16px;">🇩🇴</span>
                            <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">BC Compra</span>
                            <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(compra)}</span>
                            ${varCompra}
                            <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(0,56,168,0.08);color:#0038A8;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Oficial · BCRD</span>
                        </div>
                    `);
                }
                if (venta) {
                    const varVenta = getVariation('bcrd_venta_prev_DO', venta);
                    items.push(`
                        <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                            <span style="font-size:16px;">🇩🇴</span>
                            <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">BC Venta</span>
                            <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(venta)}</span>
                            ${varVenta}
                            <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(206,17,38,0.08);color:#CE1126;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Oficial · BCRD</span>
                        </div>
                    `);
                }
            } else if (currentCountry === 'AR') {
                const oficial = exchangeData.banks.find(b => b.n.toLowerCase().includes('oficial'));
                const blue = exchangeData.banks.find(b => b.n.toLowerCase().includes('blue'));

                if (oficial) {
                    if (oficial.c) {
                        items.push(`
                            <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                                <span style="font-size:16px;">🇦🇷</span>
                                <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Oficial Compra</span>
                                <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(oficial.c)}</span>
                                ${getVariation('ar_oficial_c_prev', oficial.c)}
                                <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(0,56,168,0.08);color:#0038A8;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Oficial</span>
                            </div>
                        `);
                    }
                    if (oficial.v) {
                        items.push(`
                            <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                                <span style="font-size:16px;">🇦🇷</span>
                                <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Oficial Venta</span>
                                <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(oficial.v)}</span>
                                ${getVariation('ar_oficial_v_prev', oficial.v)}
                                <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(0,56,168,0.08);color:#0038A8;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Oficial</span>
                            </div>
                        `);
                    }
                }
                if (blue) {
                    if (blue.c) {
                        items.push(`
                            <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                                <span style="font-size:16px;">🇦🇷</span>
                                <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Blue Compra</span>
                                <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(blue.c)}</span>
                                ${getVariation('ar_blue_c_prev', blue.c)}
                                <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(206,17,38,0.08);color:#CE1126;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Paralelo</span>
                            </div>
                        `);
                    }
                    if (blue.v) {
                        items.push(`
                            <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                                <span style="font-size:16px;">🇦🇷</span>
                                <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Blue Venta</span>
                                <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(blue.v)}</span>
                                ${getVariation('ar_blue_v_prev', blue.v)}
                                <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(206,17,38,0.08);color:#CE1126;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Paralelo</span>
                            </div>
                        `);
                    }
                }
            } else if (currentCountry === 'MX') {
                const fix = exchangeData.banks.find(b => b.n.toLowerCase().includes('banxico') || b.n.toLowerCase().includes('oficial'));
                const bbva = exchangeData.banks.find(b => b.n.toLowerCase().includes('bbva'));

                if (fix && fix.v) {
                    items.push(`
                        <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                            <span style="font-size:16px;">🇲🇽</span>
                            <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Banxico FIX</span>
                            <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(fix.v)}</span>
                            ${getVariation('mx_fix_prev', fix.v)}
                            <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(0,56,168,0.08);color:#0038A8;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Oficial</span>
                        </div>
                    `);
                }
                if (bbva) {
                    if (bbva.c) {
                        items.push(`
                            <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                                <span style="font-size:16px;">🇲🇽</span>
                                <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">BBVA Compra</span>
                                <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(bbva.c)}</span>
                                ${getVariation('mx_bbva_c_prev', bbva.c)}
                                <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(206,17,38,0.08);color:#CE1126;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Banco</span>
                            </div>
                        `);
                    }
                    if (bbva.v) {
                        items.push(`
                            <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                                <span style="font-size:16px;">🇲🇽</span>
                                <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">BBVA Venta</span>
                                <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(bbva.v)}</span>
                                ${getVariation('mx_bbva_v_prev', bbva.v)}
                                <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(206,17,38,0.08);color:#CE1126;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Banco</span>
                            </div>
                        `);
                    }
                }
            } else if (currentCountry === 'CO') {
                const trm = exchangeData.banks.find(b => b.n.toLowerCase().includes('trm') || b.n.toLowerCase().includes('oficial'));
                const bancolombia = exchangeData.banks.find(b => b.n.toLowerCase().includes('bancolombia'));

                if (trm && trm.v) {
                    items.push(`
                        <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                            <span style="font-size:16px;">🇨🇴</span>
                            <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">TRM Dólar</span>
                            <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(trm.v)}</span>
                            ${getVariation('co_trm_prev', trm.v)}
                            <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(0,56,168,0.08);color:#0038A8;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Oficial</span>
                        </div>
                    `);
                }
                if (bancolombia) {
                    if (bancolombia.c) {
                        items.push(`
                            <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                                <span style="font-size:16px;">🇨🇴</span>
                                <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Bancolombia Compra</span>
                                <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(bancolombia.c)}</span>
                                ${getVariation('co_bcol_c_prev', bancolombia.c)}
                                <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(206,17,38,0.08);color:#CE1126;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Banco</span>
                            </div>
                        `);
                    }
                    if (bancolombia.v) {
                        items.push(`
                            <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                                <span style="font-size:16px;">🇨🇴</span>
                                <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Bancolombia Venta</span>
                                <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(bancolombia.v)}</span>
                                ${getVariation('co_bcol_v_prev', bancolombia.v)}
                                <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(206,17,38,0.08);color:#CE1126;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Banco</span>
                            </div>
                        `);
                    }
                }
            } else if (currentCountry === 'VE') {
                const bcv = exchangeData.banks.find(b => b.n.toLowerCase().includes('bcv') || b.n.toLowerCase().includes('oficial'));
                const paralelo = exchangeData.banks.find(b => b.n.toLowerCase().includes('paralelo'));

                if (bcv && bcv.v) {
                    items.push(`
                        <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                            <span style="font-size:16px;">🇻🇪</span>
                            <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Tasa BCV</span>
                            <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(bcv.v)}</span>
                            ${getVariation('ve_bcv_prev', bcv.v)}
                            <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(0,56,168,0.08);color:#0038A8;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Oficial</span>
                        </div>
                    `);
                }
                if (paralelo && paralelo.v) {
                    items.push(`
                        <div style="display:flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;">
                            <span style="font-size:16px;">🇻🇪</span>
                            <span style="font-size:10px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:0.08em;">Dólar Paralelo</span>
                            <span style="font-size:14px;font-weight:900;color:#1E293B;">${formatVal(paralelo.v)}</span>
                            ${getVariation('ve_para_prev', paralelo.v)}
                            <span style="padding:2px 7px;font-size:9px;font-weight:900;background:rgba(206,17,38,0.08);color:#CE1126;border-radius:4px;text-transform:uppercase;letter-spacing:0.06em;">Paralelo</span>
                        </div>
                    `);
                }
            }

            if (items.length === 0) return;

            // Unir todos los elementos con el separador circular
            const content = items.join(sep);
            
            // Duplicar el contenido varias veces para garantizar que el scroll infinito se vea continuo y suave
            const fullHtml = content + sep + content + sep + content + sep + content + sep;

            const track1 = document.getElementById('ticker-track-1');
            const track2 = document.getElementById('ticker-track-2');

            // Quitar la clase de animación para forzar el reinicio sincronizado
            track1.classList.remove('animate-ticker-scroll');
            track2.classList.remove('animate-ticker-scroll');

            // Inyectar el nuevo contenido
            track1.innerHTML = fullHtml;
            track2.innerHTML = fullHtml;

            // Forzar reflow en el navegador para registrar el reinicio de la animación
            void track1.offsetWidth;
            void track2.offsetWidth;

            // Volver a aplicar la clase de animación en el mismo instante
            track1.classList.add('animate-ticker-scroll');
            track2.classList.add('animate-ticker-scroll');

            document.getElementById('top-ticker-container').classList.remove('hidden');
        }

        function updateHeaderFlag() {
            const flags = {
                DO: '🇩🇴',
                AR: '🇦🇷',
                MX: '🇲🇽',
                CO: '🇨🇴',
                VE: '🇻🇪'
            };
            const flagEl = document.getElementById('header-country-flag');
            if (flagEl) {
                flagEl.textContent = flags[currentCountry] || '🇩🇴';
            }
        }

        function initHistoryChart() {
            const chartEl = document.getElementById('marketHistoryChart');
            if (!chartEl) return;
            const ctx = chartEl.getContext('2d');
            
            let currentBuy = 1.0;
            let currentSell = 1.0;
            
            if (exchangeData.banks && exchangeData.banks.length > 0) {
                let buySum = 0, buyCount = 0;
                let sellSum = 0, sellCount = 0;
                exchangeData.banks.forEach(b => {
                    if (b.c) { buySum += b.c; buyCount++; }
                    if (b.v) { sellSum += b.v; sellCount++; }
                });
                currentBuy = buyCount > 0 ? (buySum / buyCount) : 1.0;
                currentSell = sellCount > 0 ? (sellSum / sellCount) : 1.1;
            } else {
                currentBuy = (window.exchangeRates && window.exchangeRates['DOP_COMPRA']) || 58.5;
                currentSell = (window.exchangeRates && window.exchangeRates['DOP_VENTA']) || 59.8;
            }
            
            const labels = [];
            const buyData = [];
            const sellData = [];
            
            const now = new Date();
            const config = countryConfig[currentCountry];
            
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                labels.push(d.toLocaleDateString(config.locale, { day: 'numeric', month: 'short' }));
                
                const trend = (29 - i) * (config.chartStep * 0.02);
                const wave = Math.sin(i / 2.5) * (config.chartStep * 0.15);
                const noise = (Math.random() - 0.5) * (config.chartStep * 0.1);
                
                const bVal = currentBuy - (config.chartStep * 0.2) + trend + wave + noise;
                const sVal = currentSell - (config.chartStep * 0.2) + trend + wave + noise;
                
                buyData.push(bVal.toFixed(2));
                sellData.push(sVal.toFixed(2));
            }

            if (marketChart) {
                marketChart.destroy();
            }

            const gradientBuy = ctx.createLinearGradient(0, 0, 0, 400);
            gradientBuy.addColorStop(0, 'rgba(0, 56, 168, 0.12)');
            gradientBuy.addColorStop(1, 'rgba(0, 56, 168, 0)');

            const gradientSell = ctx.createLinearGradient(0, 0, 0, 400);
            gradientSell.addColorStop(0, 'rgba(206, 17, 38, 0.12)');
            gradientSell.addColorStop(1, 'rgba(206, 17, 38, 0)');

            marketChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Compra',
                            data: buyData,
                            borderColor: '#0038A8',
                            borderWidth: 3,
                            pointBackgroundColor: '#0038A8',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHoverBackgroundColor: '#0038A8',
                            pointHoverBorderColor: '#fff',
                            pointHoverBorderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            backgroundColor: gradientBuy
                        },
                        {
                            label: 'Venta',
                            data: sellData,
                            borderColor: '#CE1126',
                            borderWidth: 3,
                            pointBackgroundColor: '#CE1126',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHoverBackgroundColor: '#CE1126',
                            pointHoverBorderColor: '#fff',
                            pointHoverBorderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            backgroundColor: gradientSell
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1e293b',
                            titleFont: { family: 'Outfit', size: 12, weight: '800' },
                            bodyColor: '#475569',
                            bodyFont: { family: 'Outfit', size: 13, weight: '600' },
                            padding: 12,
                            cornerRadius: 16,
                            borderColor: '#e2e8f0',
                            borderWidth: 1,
                            displayColors: true,
                            usePointStyle: true,
                            callbacks: {
                                label: function(context) {
                                    return ` ${context.dataset.label}: ${config.symbol}${parseFloat(context.parsed.y).toLocaleString(config.locale, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                font: { family: 'Outfit', size: 10, weight: '700' },
                                color: '#94a3b8',
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 7
                            }
                        },
                        y: {
                            grid: { color: '#f1f5f9', drawBorder: false },
                            ticks: {
                                font: { family: 'Outfit', size: 10, weight: '700' },
                                color: '#94a3b8',
                                callback: function(value) { return config.symbol + parseFloat(value).toLocaleString(config.locale, {maximumFractionDigits:0}); }
                            }
                        }
                    }
                }
            });
        }

        // Listeners
        mainAmountInput.addEventListener('input', renderBanks);
        bankSearchInput.addEventListener('input', renderBanks);

        // Mapeo rápido de zonas horarias a códigos de país
        const tzToCountry = {
            'America/Santo_Domingo': 'DO',
            'America/Bogota': 'CO',
            'America/Caracas': 'VE',
            'America/Mexico_City': 'MX',
            'America/Monterrey': 'MX',
            'America/Tijuana': 'MX',
            'America/Hermosillo': 'MX',
            'America/Merida': 'MX',
            'America/Argentina/Buenos_Aires': 'AR',
            'America/Argentina/Cordoba': 'AR',
            'America/Argentina/Salta': 'AR',
            'America/Argentina/Tucuman': 'AR',
            'America/Argentina/La_Rioja': 'AR',
            'America/Argentina/San_Juan': 'AR',
            'America/Argentina/Mendoza': 'AR',
            'America/Argentina/San_Luis': 'AR',
            'America/Argentina/Rio_Gallegos': 'AR',
            'America/Argentina/Ushuaia': 'AR'
        };

        async function autoDetectCountry() {
            const savedCountry = localStorage.getItem('selected_country_code');
            const supported = ['DO', 'AR', 'MX', 'CO', 'VE'];
            if (savedCountry && supported.includes(savedCountry)) {
                return savedCountry;
            }

            // Paso 1: Detección por Zona Horaria (Instantáneo)
            try {
                const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (userTz) {
                    for (const [tz, country] of Object.entries(tzToCountry)) {
                        if (userTz.includes(tz) || (userTz.includes('Argentina') && country === 'AR')) {
                            localStorage.setItem('selected_country_code', country);
                            return country;
                        }
                    }
                }
            } catch (e) {
                console.warn("Error al leer zona horaria:", e);
            }

            // Paso 2: Fallback con API de IP gratuita (Asíncrona y robusta)
            try {
                const response = await fetch('https://freeipapi.com/api/json');
                if (response.ok) {
                    const data = await response.json();
                    const countryCode = data.countryCode ? data.countryCode.toUpperCase() : null;
                    if (countryCode && supported.includes(countryCode)) {
                        localStorage.setItem('selected_country_code', countryCode);
                        return countryCode;
                    }
                }
            } catch (e) {
                console.warn("API de Geolocalización falló o fue bloqueada:", e);
            }

            // Fallback definitivo
            return 'DO';
        }

        async function initApp() {
            // Si el país no está predefinido en la ventana, autodetectamos
            if (!window.currentCountry) {
                const detectedCountry = await autoDetectCountry();
                currentCountry = detectedCountry;
            } else {
                currentCountry = window.currentCountry;
            }
            
            // Sincronizar el enlace activo de la lista del DOM (Resaltado Premium con fondo azul y texto blanco)
            const activeLink = document.getElementById('link-' + currentCountry.toLowerCase());
            if (activeLink) {
                activeLink.classList.remove('bg-white', 'border-dr-slate-100', 'text-dr-slate-800', 'hover:border-dr-blue', 'hover:text-dr-blue');
                activeLink.classList.add('bg-dr-blue', 'border-dr-blue', 'text-white', 'shadow-md');
                
                // Hacer que el texto de la moneda a la derecha también sea blanco/opaco
                const currencySpan = activeLink.querySelector('span.text-dr-slate-400') || activeLink.querySelector('span');
                // Busquemos el último span que contiene el código de la moneda (DOP, ARS, etc.)
                const spans = activeLink.querySelectorAll('span');
                if (spans.length > 0) {
                    const lastSpan = spans[spans.length - 1];
                    lastSpan.classList.remove('text-dr-slate-400');
                    lastSpan.classList.add('text-white/80');
                }
                
                activeLink.removeAttribute('href');
                activeLink.style.cursor = 'default';
            }
            
            // Configurar inputs y placeholders iniciales
            const config = countryConfig[currentCountry];
            mainAmountInput.value = config.defaultAmount;
            mainAmountInput.step = config.amountStep;
            bankSearchInput.placeholder = config.placeholderSearch;
            
            fetchAllRates();
        }

        // Inicializar tasas
        initApp();
