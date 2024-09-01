let items = [];

document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    document.getElementById('saveItemBtn').addEventListener('click', saveItem);
    document.getElementById('updateItemBtn').addEventListener('click', updateItem);
});

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
            <td><img src="${item.photo}" alt="${item.name}" class="img-thumbnail"></td>
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
    if (confirm('Tem certeza que deseja excluir este item?')) {
        items = items.filter(item => item.id !== id);
        renderItems();
    }
}