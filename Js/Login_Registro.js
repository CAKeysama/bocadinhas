document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('#login form');
    const cadastroForm = document.querySelector('#registro form');

    // Função para fazer login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita o envio padrão do formulário

        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;

        try {
            const response = await fetch('https://seu-dominio.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (response.ok) {
                const data = await response.json();
                // Alerta de sucesso
                Swal.fire({
                    icon: 'success',
                    title: 'Login bem-sucedido!',
                    text: 'Bem-vindo de volta, ' + data.nome,
                    confirmButtonText: 'OK',
                    backdrop: true,
                    timer: 3000,
                    timerProgressBar: true,
                });
                // Redirecionar ou executar outras ações
            } else {
                throw new Error('Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro:', error);
            // Alerta de erro
            Swal.fire({
                icon: 'error',
                title: 'Falha no login',
                text: 'Verifique suas credenciais e tente novamente.',
                confirmButtonText: 'OK',
                backdrop: true,
            });
        }
    });

    // Função para fazer cadastro
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita o envio padrão do formulário

        const nome = document.getElementById('registroNome').value;
        const cpf = document.getElementById('registroCPF').value;
        const email = document.getElementById('registroEmail').value;
        const senha = document.getElementById('registroSenha').value;
        const foto = document.getElementById('registroFoto').files[0]; // Pega o arquivo da foto

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('cpf', cpf);
        formData.append('email', email);
        formData.append('senha', senha);
        formData.append('foto', foto);

        try {
            const response = await fetch('https://seu-dominio.com/api/cadastro', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // Alerta de sucesso
                Swal.fire({
                    icon: 'success',
                    title: 'Cadastro bem-sucedido!',
                    text: 'Você já pode fazer login agora.',
                    confirmButtonText: 'OK',
                    backdrop: true,
                    timer: 3000,
                    timerProgressBar: true,
                });
                // Redirecionar ou executar outras ações
            } else {
                throw new Error('Erro ao cadastrar');
            }
        } catch (error) {
            console.error('Erro:', error);
            // Alerta de erro
            Swal.fire({
                icon: 'error',
                title: 'Falha no cadastro',
                text: 'Verifique os dados inseridos e tente novamente.',
                confirmButtonText: 'OK',
                backdrop: true,
            });
        }
    });
});