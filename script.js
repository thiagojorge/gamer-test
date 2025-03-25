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

    function startRealTest() {
    const test = new SpeedTest();
    
    test.onupdate = function(data) {
        // Atualiza a interface durante o teste
        if (data.testState === 4) { // Teste de ping
            document.getElementById('ping-value').textContent = data.ping;
            updateStatus(document.getElementById('ping-status'), data.ping, [30, 80], true);
            
            if (data.jitter) {
                document.getElementById('jitter-value').textContent = data.jitter;
                updateStatus(document.getElementById('jitter-status'), data.jitter, [10, 20], true);
            }
        }
        else if (data.testState === 5) { // Download
            const downloadMbps = (data.download / 1000000).toFixed(2);
            document.getElementById('download-value').textContent = downloadMbps;
            updateStatus(document.getElementById('download-status'), downloadMbps, [30, 10], false);
        }
        else if (data.testState === 6) { // Upload
            const uploadMbps = (data.upload / 1000000).toFixed(2);
            document.getElementById('upload-value').textContent = uploadMbps;
            updateStatus(document.getElementById('upload-status'), uploadMbps, [20, 10], false);
        }
        
        document.getElementById('progress-bar').style.width = `${data.progress}%`;
    };
    
    test.onend = function(data) {
        document.getElementById('start-test').disabled = false;
        document.getElementById('start-test').textContent = 'NOVO TESTE';
        document.getElementById('progress-bar').style.width = '0%';
        showTipsBasedOnResults();
    };
    
    test.start();
}

// Modifique o event listener para usar a nova função
document.getElementById('start-test').addEventListener('click', startRealTest);

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

    function testPacketLoss() {
    const results = {
        lost: 0,
        total: 10
    };
    
    for(let i = 0; i < results.total; i++) {
        fetch('https://google.com') // Substitua por seu endpoint
            .catch(() => results.lost++);
    }
    
    setTimeout(() => {
        const packetLoss = (results.lost / results.total) * 100;
        console.log(`Perda de pacotes: ${packetLoss}%`);
        // Você pode adicionar isto à sua interface depois
    }, 5000);
}

function showTipsBasedOnResults() {
    const ping = parseFloat(document.getElementById('ping-value').textContent);
    const download = parseFloat(document.getElementById('download-value').textContent);
    const upload = parseFloat(document.getElementById('upload-value').textContent);
    
    let tips = "";
    
    if (ping > 100) {
        tips += "<li>Seu ping está alto para jogos competitivos. Tente conectar via cabo em vez de Wi-Fi</li>";
    }
    
    if (download < 10) {
        tips += "<li>Sua velocidade de download pode causar problemas em jogos com atualizações grandes</li>";
    }
    
    if (upload < 5) {
        tips += "<li>Sua velocidade de upload pode afetar a qualidade de chamadas de voz no jogo</li>";
    }
    
    document.querySelector('.gamer-tips ul').innerHTML = tips;
    
    // Opcional: executar teste de pacotes perdidos
    testPacketLoss();
}
});