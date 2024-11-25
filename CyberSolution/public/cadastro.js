const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('Confirmpassword');

    
    function showPassword(input, icon) {
        input.type = 'text'; 
    }

    function hidePassword(input, icon) {
        input.type = 'password'; 
    } 

    togglePassword.addEventListener('mousedown', () => showPassword(passwordInput));
    togglePassword.addEventListener('mouseup', () => hidePassword(passwordInput));
    togglePassword.addEventListener('mouseleave', () => hidePassword(passwordInput)); 
    toggleConfirmPassword.addEventListener('mousedown', () => showPassword(confirmPasswordInput));
    toggleConfirmPassword.addEventListener('mouseup', () => hidePassword(confirmPasswordInput));
    toggleConfirmPassword.addEventListener('mouseleave', () => hidePassword(confirmPasswordInput)); 

    
    document.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Converte FormData para um objeto JSON
        const data = Object.fromEntries(formData.entries());
        console.log('Dados enviados:', data);

        const response = await fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            console.log('Redirecionando para login.html'); 
            window.location.href = 'login.html'; 
        } else {
            alert(`Erro: ${result.error}`);
            console.error('Erro na resposta:', result.error); // Adiciona um log de erro para depuração
        }
    });