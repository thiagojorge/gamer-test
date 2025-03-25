document.addEventListener('DOMContentLoaded', function() {
    const startTestBtn = document.getElementById('start-test');
    const pingValue = document.getElementById('ping-value');
    const downloadValue = document.getElementById('download-value');
    const uploadValue = document.getElementById('upload-value');
    const jitterValue = document.getElementById('jitter-value');
    const progressBar = document.getElementById('progress-bar');
    const pingStatus = document.getElementById('ping-status');
    const downloadStatus = document.getElementById('download-status');
    const uploadStatus = document.getElementById('upload-status');
    const jitterStatus = document.getElementById('jitter-status');

    startTestBtn.addEventListener('click', startTest);

    function startTest() {
        // Reset valores e status
        pingValue.textContent = '--';
        downloadValue.textContent = '--';
        uploadValue.textContent = '--';
        jitterValue.textContent = '--';
        
        // Reset barras de status
        pingStatus.style.width = '0%';
        downloadStatus.style.width = '0%';
        uploadStatus.style.width = '0%';
        jitterStatus.style.width = '0%';
        
        // Desabilitar botão durante o teste
        startTestBtn.disabled = true;
        startTestBtn.textContent = 'TESTANDO...';
        
        // Simular progresso (em um site real, isso seria substituído por testes reais)
        simulateTest();
    }

    function simulateTest() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            // Atualizar valores em diferentes estágios do progresso
            if (progress === 20) {
                // Teste de Ping
                const ping = Math.floor(Math.random() * 50) + 10;
                pingValue.textContent = ping;
                updateStatus(pingStatus, ping, [30, 80], true);
                
                // Teste de Jitter (variação do ping)
                const jitter = Math.floor(Math.random() * 15) + 2;
                jitterValue.textContent = jitter;
                updateStatus(jitterStatus, jitter, [10, 20], true);
            } 
            else if (progress === 50) {
                // Teste de Download
                const download = (Math.random() * 90 + 10).toFixed(2);
                downloadValue.textContent = download;
                updateStatus(downloadStatus, download, [30, 10], false);
            } 
            else if (progress === 80) {
                // Teste de Upload
                const upload = (Math.random() * 40 + 5).toFixed(2);
                uploadValue.textContent = upload;
                updateStatus(uploadStatus, upload, [20, 10], false);
            } 
            else if (progress >= 100) {
                clearInterval(interval);
                startTestBtn.disabled = false;
                startTestBtn.textContent = 'NOVO TESTE';
                progressBar.style.width = '0%';
                
                // Mostrar dicas baseadas nos resultados
                showTipsBasedOnResults();
            }
        }, 200);
    }

    function updateStatus(element, value, thresholds, lowerIsBetter) {
        // thresholds: [good, medium] - valores abaixo são bons
        let color, width;
        
        if (lowerIsBetter) {
            if (value <= thresholds[0]) {
                color = 'var(--good)';
                width = '20%';
            } else if (value <= thresholds[1]) {
                color = 'var(--medium)';
                width = '60%';
            } else {
                color = 'var(--bad)';
                width = '100%';
            }
        } else {
            if (value >= thresholds[0]) {
                color = 'var(--good)';
                width = '100%';
            } else if (value >= thresholds[1]) {
                color = 'var(--medium)';
                width = '60%';
            } else {
                color = 'var(--bad)';
                width = '20%';
            }
        }
        
        element.style.background = color;
        element.style.width = width;
    }

    function showTipsBasedOnResults() {
        // Esta função poderia ser expandida para mostrar dicas específicas
        // baseadas nos resultados dos testes
        console.log("Mostrar dicas baseadas nos resultados");
    }
});