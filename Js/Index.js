const cartButton = document.getElementById('cart-button');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');

cartButton.addEventListener('click', () => {
    cartSidebar.classList.toggle('show');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('show');
});


// Função para simular o login/logout (você pode modificar isso para usar autenticação real)
let isLoggedIn = true;

function toggleLoginState() {
    isLoggedIn = !isLoggedIn;
    updateLoginUI();
}

function updateLoginUI() {
    const loginButton = document.getElementById('login-button');
    const profileIcon = document.getElementById('profile-icon');
    
    if (isLoggedIn) {
        loginButton.style.display = 'none';
        profileIcon.style.display = 'block';
    } else {
        loginButton.style.display = 'block';
        profileIcon.style.display = 'none';
    }
}

// Evento de clique no botão de logout no modal
document.getElementById('logout-button').addEventListener('click', function() {
    toggleLoginState();
    $('#logoutModal').modal('hide'); // Fecha o modal após o logout
    $('#logoutModal').hide(); // Adiciona essa linha para esconder o modal
});

// Inicializa a UI baseada no estado inicial
updateLoginUI();