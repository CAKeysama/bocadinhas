const cartButton = document.getElementById('cart-button');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');

cartButton.addEventListener('click', () => {
    cartSidebar.classList.toggle('show');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('show');
});