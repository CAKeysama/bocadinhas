// Constantes e elementos DOM
const DELIVERY_FEE = 5.00;
let orderNumber;

// Event listeners para métodos de pagamento
document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
        // Limpa seleção anterior
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
        // Adiciona seleção ao método atual
        method.classList.add('selected');
        // Marca o radio button
        const radio = method.querySelector('input[type="radio"]');
        radio.checked = true;
        // Dispara o evento change manualmente
        radio.dispatchEvent(new Event('change'));
    });
});

// Elementos DOM - Payment
const paymentMethods = document.querySelectorAll('.payment-method input[type="radio"]');
const changeSection = document.getElementById('changeSection');
const confirmChangeBtn = document.getElementById('confirmChange');
const noChangeBtn = document.getElementById('noChange');
const changeAmount = document.getElementById('changeAmount');
const finishOrderBtn = document.querySelector('.btn-primary.w-100');

// Funções auxiliares
function getCartFromStorage() {
    const cartData = localStorage.getItem('bocadinhasCart');
    return cartData ? JSON.parse(cartData) : [];
}

function calculateOrderTotal(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
        subtotal: subtotal,
        deliveryFee: DELIVERY_FEE,
        total: subtotal + DELIVERY_FEE
    };
}

function generateOrderNumber() {
    return '#' + Date.now().toString().slice(-6);
}

// Função showCustomAlert atualizada com SweetAlert2
function showCustomAlert(message) {
    Swal.fire({
        text: message,
        toast: true,
        position: 'bottom-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#28a745',
        color: 'white',
        customClass: {
            popup: 'colored-toast'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
}

// Funções de renderização
function renderOrderItems(cart) {
    const orderTableBody = document.querySelector('.table tbody');
    orderTableBody.innerHTML = '';

    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>R$ ${item.price.toFixed(2)}</td>
            <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
        `;
        orderTableBody.appendChild(row);
    });
}

function updateOrderSummary(orderTotals) {
    document.getElementById('subtotal').textContent = `R$ ${orderTotals.subtotal.toFixed(2)}`;
    document.getElementById('delivery-fee').textContent = `R$ ${orderTotals.deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${orderTotals.total.toFixed(2)}`;
}

// Funções de gerenciamento de pedido
function saveOrderToHistory(orderData) {
    const orderHistory = JSON.parse(localStorage.getItem('bocadinhasOrderHistory') || '[]');
    orderHistory.push(orderData);
    localStorage.setItem('bocadinhasOrderHistory', JSON.stringify(orderHistory));
}

function finalizePedido() {
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked').id;
    const cart = getCartFromStorage();
    const orderTotals = calculateOrderTotal(cart);
    
    const orderData = {
        items: cart,
        payment: selectedPayment,
        totals: orderTotals,
        status: 'pending',
        orderNumber: orderNumber,
        timestamp: new Date().toISOString()
    };

    saveOrderToHistory(orderData);
    localStorage.removeItem('bocadinhasCart');
    showCustomAlert(`Pedido ${orderData.orderNumber} confirmado com sucesso!`);
    document.getElementById('order-number').textContent = orderData.orderNumber;
}

// Handlers de eventos
function handlePaymentMethodChange(e) {
    console.log('Método de pagamento alterado:', e.target.id); // Debug
    if (e.target.id === 'money') {
        changeSection.style.display = 'block';
        changeAmount.value = '';
    } else {
        changeSection.style.display = 'none';
    }
}

function handleConfirmChange() {
    const amount = parseFloat(changeAmount.value);
    const total = parseFloat(document.getElementById('total').textContent.replace('R$ ', '').replace(',', '.'));
    
    if (!amount || amount <= 0) {
        showCustomAlert('Por favor, insira um valor válido.');
        return;
    }
    
    if (amount < total) {
        showCustomAlert('O valor informado é menor que o total do pedido.');
        return;
    }
    
    const change = amount - total;
    Swal.fire({
        text: `Seu troco será de R$ ${change.toFixed(2).replace('.', ',')}`,
        toast: true,
        position: 'bottom-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#28a745',
        color: 'white'
    });

    changeSection.style.display = 'none';
}

function handleNoChange() {
    changeAmount.value = '';
    changeSection.style.display = 'none';
}

// Inicialização
function initializePaymentPage() {
    const cart = getCartFromStorage();
    
    if (!cart || cart.length === 0) {
        window.location.href = '/cardapio.html';
        return;
    }

    renderOrderItems(cart);
    const orderTotals = calculateOrderTotal(cart);
    updateOrderSummary(orderTotals);
    
    // Configuração inicial
    changeSection.style.display = 'none';
    orderNumber = generateOrderNumber();

    // Event listeners
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            method.querySelector('input[type="radio"]').checked = true;
        });
    });

    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });

    confirmChangeBtn.addEventListener('click', handleConfirmChange);
    noChangeBtn.addEventListener('click', handleNoChange);
    finishOrderBtn.addEventListener('click', finalizePedido);
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializePaymentPage);
