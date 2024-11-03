// Variáveis globais
let items = [];
let transactions = [];
let cashRegister = {
    isOpen: false,
    startAmount: 0,
    currentTotal: 0
};


// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do gerenciamento de itens
    loadItems();
    document.getElementById('saveItemBtn').addEventListener('click', saveItem);
    document.getElementById('updateItemBtn').addEventListener('click', updateItem);

    // Inicialização do caixa
    document.getElementById('openCashRegisterBtn').addEventListener('click', openCashRegister);
    document.getElementById('closeCashRegisterBtn').addEventListener('click', closeCashRegister);
    document.getElementById('recordSaleBtn').addEventListener('click', recordSale);
    updateCashRegisterDisplay();
});

// Funções de gerenciamento de itens
function loadItems() {
    // aqui você pode fazer uma requisição para o backend para buscar os itens
    // e então chamar a função renderItems() com os itens retornados
    items = [
        { id: 1, name: 'Hambúrguer Clássico', price: 25.90, description: 'Delicioso hambúrguer com queijo, alface e tomate', weight: 200, photo: '../Img/Hamburger_Categoria.jpeg' },
        { id: 2, name: 'Sorvete de Morango Silvestre', price: 12.90, description: 'Sorevete delicioso feito com morangos frescos', weight: 150, photo: '../Img/Sobremesas_Categoria.jpeg' }
    ];
    renderItems();
}

function renderItems() {
    const tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>R$ ${item.price.toFixed(2)}</td>
            <td class="d-none d-md-table-cell">${item.description}</td>
            <td class="d-none d-md-table-cell">${item.weight}g</td>
            <td><img src="${item.photo}" alt="${item.name}" class="img-thumbnail item-image"></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // adiciona os eventos de clique nos botões de editar e excluir
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editItem(parseInt(btn.getAttribute('data-id'))));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteItem(parseInt(btn.getAttribute('data-id'))));
    });
}

function saveItem() {
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const description = document.getElementById('itemDescription').value;
    const weight = parseInt(document.getElementById('itemWeight').value);
    const photoInput = document.getElementById('itemPhoto');
    
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newItem = {
                id: items.length + 1,
                name,
                price,
                description,
                weight,
                photo: e.target.result
            };
            items.push(newItem);
            renderItems();
            const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
            addItemModal.hide();
            document.getElementById('addItemForm').reset();
        }
        reader.readAsDataURL(photoInput.files[0]);
    }
}

function editItem(id) {
    const item = items.find(item => item.id === id);
    if (item) {
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemPrice').value = item.price;
        document.getElementById('editItemDescription').value = item.description;
        document.getElementById('editItemWeight').value = item.weight;
        const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
        editItemModal.show();
    }
}

function updateItem() {
    const id = parseInt(document.getElementById('editItemId').value);
    const name = document.getElementById('editItemName').value;
    const price = parseFloat(document.getElementById('editItemPrice').value);
    const description = document.getElementById('editItemDescription').value;
    const weight = parseInt(document.getElementById('editItemWeight').value);
    const photoInput = document.getElementById('editItemPhoto');
    
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        items[itemIndex].name = name;
        items[itemIndex].price = price;
        items[itemIndex].description = description;
        items[itemIndex].weight = weight;
        
        if (photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                items[itemIndex].photo = e.target.result;
                renderItems();
                const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
                editItemModal.hide();
            }
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            renderItems();
            const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
            editItemModal.hide();
        }
    }
}

function deleteItem(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            items = items.filter(item => item.id !== id);
            renderItems();
            Swal.fire(
                'Excluído!',
                'O item foi excluído com sucesso.',
                'success'
            );
        }
    });
}


// Funções de gerenciamento do caixa
function openCashRegister() {
    if (!cashRegister.isOpen) {
        cashRegister.isOpen = true;
        cashRegister.startAmount = 100; // Exemplo de valor inicial
        cashRegister.currentTotal = cashRegister.startAmount;
        updateCashRegisterDisplay();
        Swal.fire({
            icon: 'success',
            title: 'Caixa Aberto',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

function closeCashRegister() {
    if (cashRegister.isOpen) {
        cashRegister.isOpen = false;
        cashRegister.currentTotal = 0;
        updateCashRegisterDisplay();
        Swal.fire({
            icon: 'success',
            title: 'Caixa Fechado',
            showConfirmButton: false,
            timer: 1500
        });
    }
}


function recordSale() {
    if (!cashRegister.isOpen) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Abra o caixa antes de registrar uma venda.'
        });
        return;
    }

    const saleAmount = parseFloat(prompt('Digite o valor da venda:'));
    const paymentMethod = prompt('Digite o método de pagamento (Pix, Crédito, Débito, Dinheiro):');

    if (!isNaN(saleAmount) && saleAmount > 0 && ['Pix', 'Crédito', 'Débito', 'Dinheiro'].includes(paymentMethod)) {
        transactions.push({
            amount: saleAmount,
            method: paymentMethod,
            date: new Date()
        });
        cashRegister.currentTotal += saleAmount;
        alert('Venda registrada com sucesso!');
        updateCashRegisterDisplay();
        renderTransactions();
    } else {
        alert('Informações inválidas! Tente novamente.');
    }
}

function updateCashRegisterDisplay() {
    const cashStatus = document.getElementById('cashStatus');
    const cashTotal = document.getElementById('cashTotal');
    
    if (cashRegister.isOpen) {
        cashStatus.textContent = "Aberto";
        cashStatus.classList.remove("text-danger");
        cashStatus.classList.add("text-success");
        cashTotal.textContent = `R$ ${cashRegister.currentTotal.toFixed(2)}`;
    } else {
        cashStatus.textContent = "Fechado";
        cashStatus.classList.remove("text-success");
        cashStatus.classList.add("text-danger");
        cashTotal.textContent = "R$ 0,00";
    }
}


function renderTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';
    transactions.forEach(transaction => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>R$ ${transaction.amount.toFixed(2)}</td>
            <td>${transaction.method}</td>
            <td>${transaction.date.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}