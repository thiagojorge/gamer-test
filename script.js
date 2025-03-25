document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const startTestBtn = document.getElementById('start-test');
    
    // Configurar o teste ao clicar no botão
    startTestBtn.addEventListener('click', startRealTest);

    function startRealTest() {
        // Resetar todos os valores
        document.querySelectorAll('.value').forEach(el => el.textContent = '--');
        document.querySelectorAll('.status').forEach(el => {
            el.style.width = '0%';
            el.style.background = '';
        });

        // Configurar estado do teste
        startTestBtn.disabled = true;
        startTestBtn.textContent = 'TESTANDO...';
        document.getElementById('progress-bar').style.width = '0%';
        
        // Iniciar teste real com Librespeed
        const test = new SpeedTest();
        
        // Atualizações durante o teste
        test.onupdate = function(data) {
            // Teste de Ping
            if (data.testState === 4) {
                document.getElementById('ping-value').textContent = data.ping;
                updateStatus('ping-status', data.ping, [30, 80], true);
                
                // Jitter (variação do ping)
                if (data.jitter) {
                    document.getElementById('jitter-value').textContent = data.jitter;
                    updateStatus('jitter-status', data.jitter, [10, 20], true);
                }
            } 
            // Teste de Download
            else if (data.testState === 5) {
                const downloadMbps = (data.download / 1000000).toFixed(2);
                document.getElementById('download-value').textContent = downloadMbps;
                updateStatus('download-status', downloadMbps, [30, 10], false);
            } 
            // Teste de Upload
            else if (data.testState === 6) {
                const uploadMbps = (data.upload / 1000000).toFixed(2);
                document.getElementById('upload-value').textContent = uploadMbps;
                updateStatus('upload-status', uploadMbps, [20, 10], false);
            }
            
            // Atualizar barra de progresso
            document.getElementById('progress-bar').style.width = `${data.progress}%`;
        };
        
        // Quando o teste terminar
        test.onend = function() {
            startTestBtn.disabled = false;
            startTestBtn.textContent = 'NOVO TESTE';
            document.getElementById('progress-bar').style.width = '0%';
            showTipsBasedOnResults();
        };
        
        // Iniciar o teste
        test.start();
    }

    // Função para atualizar as barras de status
    function updateStatus(elementId, value, thresholds, lowerIsBetter) {
        const element = document.getElementById(elementId);
        let color, width;
        
        if (lowerIsBetter) {
            width = value <= thresholds[0] ? '20%' : 
                   value <= thresholds[1] ? '60%' : '100%';
            color = value <= thresholds[0] ? 'var(--good)' : 
                   value <= thresholds[1] ? 'var(--medium)' : 'var(--bad)';
        } else {
            width = value >= thresholds[0] ? '100%' : 
                   value >= thresholds[1] ? '60%' : '20%';
            color = value >= thresholds[0] ? 'var(--good)' : 
                   value >= thresholds[1] ? 'var(--medium)' : 'var(--bad)';
        }
        
        element.style.background = color;
        element.style.width = width;
    }

    // Mostrar dicas baseadas nos resultados
    function showTipsBasedOnResults() {
        const ping = parseFloat(document.getElementById('ping-value').textContent) || 0;
        const download = parseFloat(document.getElementById('download-value').textContent) || 0;
        const upload = parseFloat(document.getElementById('upload-value').textContent) || 0;
        const jitter = parseFloat(document.getElementById('jitter-value').textContent) || 0;
        
        let tips = "";
        
        // Dicas de ping
        if (ping > 150) {
            tips += "<li>🔴 <strong>Ping MUITO ALTO</strong> (>150ms) - Inviável para jogos competitivos</li>";
        } else if (ping > 100) {
            tips += "<li>🟠 <strong>Ping alto</strong> (100-150ms) - Pode ter lag em jogos FPS</li>";
        } else if (ping > 50) {
            tips += "<li>🟡 <strong>Ping moderado</strong> (50-100ms) - OK para a maioria dos jogos</li>";
        } else if (ping > 0) {
            tips += "<li>🟢 <strong>Ping excelente</strong> (<50ms) - Ideal para jogos competitivos</li>";
        }
        
        // Dicas de download
        if (download < 5) {
            tips += "<li>🔴 <strong>Download muito lento</strong> (<5Mbps) - Problemas com atualizações e streaming</li>";
        } else if (download < 15) {
            tips += "<li>🟠 <strong>Download limitado</strong> (5-15Mbps) - Pode ter lentidão em jogos com muitos assets</li>";
        } else if (download < 30) {
            tips += "<li>🟡 <strong>Download bom</strong> (15-30Mbps) - Suficiente para a maioria dos jogos</li>";
        } else if (download > 0) {
            tips += "<li>🟢 <strong>Download excelente</strong> (>30Mbps) - Ótimo para qualquer jogo</li>";
        }
        
        // Dicas de upload
        if (upload < 3) {
            tips += "<li>🔴 <strong>Upload muito lento</strong> (<3Mbps) - Pode afetar chamadas de voz e multiplayer</li>";
        } else if (upload < 5) {
            tips += "<li>🟠 <strong>Upload limitado</strong> (3-5Mbps) - Suficiente para jogos mas pode ter qualidade reduzida</li>";
        } else if (upload > 0) {
            tips += "<li>🟢 <strong>Upload bom</strong> (>5Mbps) - Ideal para streaming e voz</li>";
        }
        
        // Dicas de jitter
        if (jitter > 30) {
            tips += "<li>🔴 <strong>Jitter muito alto</strong> (>30ms) - Conexão instável, pode causar lag spikes</li>";
        } else if (jitter > 15) {
            tips += "<li>🟠 <strong>Jitter moderado</strong> (15-30ms) - Alguma variação no ping</li>";
        } else if (jitter > 0) {
            tips += "<li>🟢 <strong>Jitter baixo</strong> (<15ms) - Conexão estável</li>";
        }
        
        document.querySelector('.gamer-tips ul').innerHTML = tips || 
            "<li>🟢 Sua conexão parece perfeita para jogos online!</li>";
    }
});