const menuItems = [
    {
        id: 1,
        name: "Hambúrguer Clássico",
        description: "Pão, carne 180g, queijo, alface, tomate e molho especial",
        price: 25.90,
        weight: 300,
        category: "lanches",
        image: "../Img/Hamburger_Categoria.jpeg"
    },
    {
        id: 2,
        name: "Torta de Chocolate",
        description: "Deliciosa torta de chocolate com cobertura de ganache",
        price: 15.90,
        weight: 150,
        category: "sobremesas",
        image: "../Img/Sobremesas_Categoria.jpeg"
    },
    {
        id: 3,
        name: "Suco Natural de Laranja",
        description: "Suco de laranja natural e refrescante",
        price: 8.90,
        weight: 300,
        category: "bebidas",
        image: "../Img/Bebidas_Categoria.jpeg"
    }
];

const menuItemsContainer = document.getElementById('menu-items');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const cartButton = document.getElementById('cart-button');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');

let cart = [];

function renderMenuItems(items) {
    menuItemsContainer.innerHTML = '';
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'col-md-4 menu-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="p-3">
                <h5>${item.name}</h5>
                <p>${item.description}</p>
                <p>Preço: R$ ${item.price.toFixed(2)} | Peso: ${item.weight}g</p>
                <button class="btn btn-primary add-to-cart" data-id="${item.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        menuItemsContainer.appendChild(itemElement);
    });
}

function filterItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) &&
        (selectedCategory === 'all' || item.category === selectedCategory)
    );

    renderMenuItems(filteredItems);
}

function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p>${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
            <button class="btn btn-sm btn-danger remove-from-cart" data-id="${item.id}">Remover</button>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Salvar carrinho no localStorage
    localStorage.setItem('bocadinhasCart', JSON.stringify(cart));
}

function addToCart(id) {
    const item = menuItems.find(item => item.id === id);
    const existingItem = cart.find(cartItem => cartItem.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCart();
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    }
}

// Event Listeners
searchInput.addEventListener('input', filterItems);
categoryFilter.addEventListener('change', filterItems);

menuItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        addToCart(id);
    }
});

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-from-cart')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        removeFromCart(id);
    }
});

cartButton.addEventListener('click', () => {
    cartSidebar.classList.toggle('show');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('show');
});

//botão de finalizar compra no carrinho
function addCheckoutButton() {
    const checkoutButton = document.getElementById('checkoutButton');
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = './pagamento.html';
        } else {
            alert('Adicione itens ao carrinho antes de finalizar a compra');
        }
    });
    cartItemsContainer.appendChild(checkoutButton);
}

// Carregar carrinho do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('bocadinhasCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
    addCheckoutButton();
});

renderMenuItems(menuItems);