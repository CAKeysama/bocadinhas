// pagamento.js
// Função para recuperar dados do carrinho do localStorage
function getCartFromStorage() {
    const cartData = localStorage.getItem('bocadinhasCart');
    return cartData ? JSON.parse(cartData) : [];
}

// Função para calcular o total do pedido
function calculateOrderTotal(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00; // Taxa de entrega fixa
    return {
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: subtotal + deliveryFee
    };
}

// Função para renderizar os itens do pedido
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

// Função para atualizar o resumo do pedido
function updateOrderSummary(orderTotals) {
    document.getElementById('subtotal').textContent = `R$ ${orderTotals.subtotal.toFixed(2)}`;
    document.getElementById('delivery-fee').textContent = `R$ ${orderTotals.deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${orderTotals.total.toFixed(2)}`;
}

var orderNumber;

window.onload = ()  =>  {
  orderNumber = generateOrderNumber();
}


// Função para finalizar o pedido
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

    // Salvar pedido no histórico
    saveOrderToHistory(orderData);
    
    // Limpar carrinho
    localStorage.removeItem('bocadinhasCart');
    
    // Mostrar alerta personalizado
    showCustomAlert(`Pedido   ${orderData.orderNumber} confirmado com sucesso!`);

    // Atualizar conteúdo da página com o número do pedido
    document.getElementById('order-number').textContent = orderData.orderNumber;
}

// Função para mostrar alerta personalizado
function showCustomAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.textContent = message;
    
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.classList.add('visible');
    }, 100);
    
    setTimeout(() => {
        alertBox.classList.remove('visible');
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 500);
    }, 3000);
}

// Adicione estilos para o alerta personalizado
const style = document.createElement('style');
style.textContent = `
    .custom-alert {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.5s, bottom 0.5s;
    }
    .custom-alert.visible {
        opacity: 1;
        bottom: 30px;
    }
`;
document.head.appendChild(style);

// Função para gerar número do pedido
function generateOrderNumber() {
    return '#' + Date.now().toString().slice(-6);
}

// Função para salvar pedido no histórico
function saveOrderToHistory(orderData) {
    const orderHistory = JSON.parse(localStorage.getItem('bocadinhasOrderHistory') || '[]');
    orderHistory.push(orderData);
    localStorage.setItem('bocadinhasOrderHistory', JSON.stringify(orderHistory));
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    const cart = getCartFromStorage();
    
    // Se o carrinho estiver vazio, redireciona para o cardápio
    if (!cart || cart.length === 0) {
        window.location.href = '/cardapio.html';
        return;
    }

    // Renderiza os itens do pedido
    renderOrderItems(cart);

    // Calcula e atualiza os totais
    const orderTotals = calculateOrderTotal(cart);
    updateOrderSummary(orderTotals);

    // Event listener para o botão de finalizar pedido
    document.querySelector('.btn-primary.w-100').addEventListener('click', finalizePedido);

    // Event listeners para os métodos de pagamento
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            // Remove a classe selected de todos
            document.querySelectorAll('.payment-method').forEach(m => 
                m.classList.remove('selected'));
            // Adiciona a classe selected ao método clicado
            method.classList.add('selected');
            // Marca o radio button
            method.querySelector('input[type="radio"]').checked = true;
        });
    });
});