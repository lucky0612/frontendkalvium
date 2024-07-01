// frontend/app.js
document.getElementById('runButton').addEventListener('click', async () => {
    const language = document.getElementById('language').value;
    const code = document.getElementById('code').value;

    try {
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ language, code })
        });

        const result = await response.json();
        document.getElementById('output').textContent = result.output;
    } catch (error) {
        console.error('Error executing code:', error);
        document.getElementById('output').textContent = 'Error executing code';
    }
});
