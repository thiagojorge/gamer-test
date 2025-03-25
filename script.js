document.addEventListener('DOMContentLoaded', function() {
    const startTestBtn = document.getElementById('start-test');
    
    startTestBtn.addEventListener('click', startRealTest);

    function startRealTest() {
        // Resetar valores
        document.querySelectorAll('.value').forEach(el => el.textContent = '--');
        document.querySelectorAll('.status').forEach(el => {
            el.style.width = '0%';
            el.style.background = '';
        });

        // Configurar teste
        startTestBtn.disabled = true;
        startTestBtn.textContent = 'TESTANDO...';
        
        const test = new SpeedTest();
        
        test.onupdate = function(data) {
            // Atualizar interface conforme os dados chegam
            if (data.testState === 4) { // Ping
                document.getElementById('ping-value').textContent = data.ping;
                updateStatus('ping-status', data.ping, [30, 80], true);
                
                if (data.jitter) {
                    document.getElementById('jitter-value').textContent = data.jitter;
                    updateStatus('jitter-status', data.jitter, [10, 20], true);
                }
            } 
            else if (data.testState === 5) { // Download
                const downloadMbps = (data.download / 1000000).toFixed(2);
                document.getElementById('download-value').textContent = downloadMbps;
                updateStatus('download-status', downloadMbps, [30, 10], false);
            } 
            else if (data.testState === 6) { // Upload
                const uploadMbps = (data.upload / 1000000).toFixed(2);
                document.getElementById('upload-value').textContent = uploadMbps;
                updateStatus('upload-status', uploadMbps, [20, 10], false);
            }
            
            document.getElementById('progress-bar').style.width = `${data.progress}%`;
        };
        
        test.onend = function() {
            startTestBtn.disabled = false;
            startTestBtn.textContent = 'NOVO TESTE';
            showTipsBasedOnResults();
        };
        
        test.start();
    }

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

    function showTipsBasedOnResults() {
        const ping = parseFloat(document.getElementById('ping-value').textContent);
        const download = parseFloat(document.getElementById('download-value').textContent);
        const upload = parseFloat(document.getElementById('upload-value').textContent);
        
        let tips = "";
        
        if (ping > 100) {
            tips += "<li>🔴 Ping alto para jogos competitivos (>100ms)</li>";
        } else if (ping > 50) {
            tips += "<li>🟡 Ping moderado (50-100ms) - OK para jogos casuais</li>";
        } else {
            tips += "<li>🟢 Ping excelente para jogos competitivos (<50ms)</li>";
        }
        
        if (download < 10) {
            tips += "<li>🔴 Velocidade de download baixa para jogos modernos</li>";
        }
        
        if (upload < 5) {
            tips += "<li>🔴 Velocidade de upload pode afetar chamadas de voz</li>";
        }
        
        document.querySelector('.gamer-tips ul').innerHTML = tips || 
            "<li>🟢 Sua conexão parece ótima para jogos online!</li>";
    }
});