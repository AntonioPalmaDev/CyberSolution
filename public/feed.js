


function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');  
    localStorage.removeItem('user_creation_date');
    console.log("Logout concluído com sucesso!");
    alert("Logout realizado com sucesso!");
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 100);
}

// Função para carregar e exibir o perfil do usuário
function carregarPerfilUsuario() {
    const userName = localStorage.getItem('user_name');
    const userCreationDate = localStorage.getItem('user_creation_date');

    if (userName) {
        document.getElementById('profileName').textContent = userName;
        document.getElementById('welcomeMessage').textContent = `Bem-vindo(a), ${userName}! Faça sua colaboração e compartilhe seus conhecimentos com a comunidade.`;
    }
    if (userCreationDate) {
        document.getElementById('profileCreationDate').textContent = userCreationDate;
    }
}

// Função para enviar uma nova publicação
async function publicar(event) {
    event.preventDefault();

    const form = document.getElementById('publicationForm');
    const formData = new FormData(form);

    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        alert("Erro: usuário não está logado.");
        return;
    }
    formData.append('user_id', user_id);

    try {
        const response = await fetch('http://localhost:3000/publication', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert("Publicação realizada com sucesso!");
            carregarPublicacoes();  // Recarrega as publicações após publicar
        } else {
            alert(`Erro: ${result.error}`);
        }
    } catch (error) {
        console.error("Erro na publicação:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

// Função para carregar as publicações e exibi-las no feed
async function carregarPublicacoes() {
    try {
        const response = await fetch('http://localhost:3000/publications');
        const publicacoes = await response.json();

        const feed = document.getElementById('feed');
        feed.innerHTML = '';  // Limpa o feed antes de carregar as novas publicações

        publicacoes.forEach(pub => {
            const div = document.createElement('div');
            div.className = 'publicacao';
            div.innerHTML = `
                <strong>Usuário:</strong> ${pub.users.username} <br>
                <strong>Categoria:</strong> ${pub.category} <br>
                <strong>Descrição:</strong> ${pub.description} <br>
                <strong>Arquivo:</strong> <a href="${pub.file_path}" target="_blank">Baixar</a>
                <div class="comentarios">
                    <h4>Comentários:</h4>
                    <div id="comentarios-${pub.id}"></div>
                    <form onsubmit="adicionarComentario(event, ${pub.id})">
                        <textarea name="comment" placeholder="Escreva um comentário..." required></textarea>
                        <button type="submit">Comentar</button>
                    </form>
                </div>
            `;
            feed.appendChild(div);

            const commentsContainer = document.getElementById(`comentarios-${pub.id}`);
            carregarComentarios(pub.id, commentsContainer);
        });
    } catch (error) {
        console.error("Erro ao carregar publicações:", error);
    }
}

// Função para carregar os comentários de uma publicação específica
async function carregarComentarios(publicationId, commentsContainer) {
    try {
        const response = await fetch(`http://localhost:3000/comments/${publicationId}`);
        const comentarios = await response.json();

        commentsContainer.innerHTML = '';  // Limpa os comentários antigos

        comentarios.forEach(comment => {
            const div = document.createElement('div');
            div.className = 'comentario';
            div.innerHTML = `
                <strong>${comment.users.username}:</strong> ${comment.comment} <br>
               
            `;
            commentsContainer.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar comentários:", error);
    }
}

// Função para adicionar um comentário
async function adicionarComentario(event, publicationId) {
    event.preventDefault();

    const form = event.target;
    const comment = form.comment.value;
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
        alert("Você precisa estar logado para comentar.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publication_id: publicationId, user_id, comment })
        });

        if (response.ok) {
            form.reset();
            const commentsContainer = document.getElementById(`comentarios-${publicationId}`);
            carregarComentarios(publicationId, commentsContainer);  // Recarrega os comentários
        } else {
            const error = await response.json();
            alert(`Erro: ${error.error}`);
        }
    } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
    }
}

// Alterna a visibilidade do menu de perfil
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.toggle('open');
}

// Adiciona o evento de submissão ao formulário
document.getElementById('publicationForm').addEventListener('submit', publicar);

// Carrega o perfil do usuário e as publicações quando a página é aberta
window.onload = function() {
    carregarPublicacoes();
    carregarPerfilUsuario();
   
};