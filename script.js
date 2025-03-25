// Versão robusta com tratamento de erros
(() => {
    const elements = {
        button: document.getElementById('start-test'),
        progress: document.getElementById('progress-bar'),
        ping: document.getElementById('ping-value')
    };
    
    if (!elements.button) {
        console.error("Elementos não encontrados!");
        return;
    }
    
    elements.button.addEventListener('click', async () => {
        if (typeof SpeedTest === 'undefined') {
            alert("Biblioteca não carregada!\nVerifique o console (F12)");
            return;
        }
        
        try {
            elements.button.disabled = true;
            new SpeedTest()
                .onupdate(updateUI)
                .onend(() => elements.button.disabled = false)
                .start();
        } catch (error) {
            console.error("Teste falhou:", error);
            elements.button.disabled = false;
        }
    });
    
    function updateUI(data) {
        if (elements.progress) {
            elements.progress.style.width = `${data.progress}%`;
        }
        if (data.testState === 4 && elements.ping) {
            elements.ping.textContent = data.ping;
        }
    }
})();