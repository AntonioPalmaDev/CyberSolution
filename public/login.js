
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
function showPassword(input, icon) {
        input.type = 'text'; 
    }

    function hidePassword(input, icon) {
        input.type = 'password'; 
    } 

    togglePassword.addEventListener('mousedown', () => showPassword(passwordInput));
    togglePassword.addEventListener('mouseup', () => hidePassword(passwordInput));
    togglePassword.addEventListener('mouseleave', () => hidePassword(passwordInput)); 

    
    
    document.querySelector('#loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const user = document.getElementById('user').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, password })
            });

            const result = await response.json();
            console.log("Resposta do servidor:", result);

            if (response.ok) {
    alert(result.message);

    // Salva os dados do usuário no localStorage
    localStorage.setItem('user_id', result.user.id);
    localStorage.setItem('user_name', result.user.name); // Armazena o nome do usuário
    localStorage.setItem('user_creation_date', result.user.creation_date); // Armazena a data de criação

    window.location.href = 'feed.html';  // Redireciona para a página de feed
} else {
    alert(`Erro: ${result.error}`);
}

        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar com o servidor. Verifique a conexão e tente novamente.");
        }
    });

