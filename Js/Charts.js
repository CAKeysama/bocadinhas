const salesData = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    data: [1200, 1900, 1500, 2000, 2400, 3000, 2500]
};

const topItemsData = {
    labels: ['Hambúrguer Clássico', 'Batata Frita', 'Refrigerante', 'Milk Shake', 'Sundae'],
    data: [120, 80, 100, 60, 40]
};

const avgPriceCategoryData = {
    labels: ['Lanches', 'Acompanhamentos', 'Bebidas', 'Sobremesas'],
    data: [25.90, 12.50, 8.00, 15.00]
};

const priceDistributionData = {
    labels: ['R$0-10', 'R$10-20', 'R$20-30', 'R$30-40', 'R$40+'],
    data: [10, 25, 35, 20, 10]
};

// Função para criar os gráficos
function createCharts() {
    // Gráfico de Vendas Recentes
    new Chart(document.getElementById('recentSalesChart'), {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Vendas (R$)',
                data: salesData.data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Itens Mais Vendidos
    new Chart(document.getElementById('topItemsChart'), {
        type: 'bar',
        data: {
            labels: topItemsData.labels,
            datasets: [{
                label: 'Quantidade Vendida',
                data: topItemsData.data,
                backgroundColor: 'rgba(255, 99, 132, 0.8)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Média de Preço por Categoria
    new Chart(document.getElementById('avgPriceCategoryChart'), {
        type: 'radar',
        data: {
            labels: avgPriceCategoryData.labels,
            datasets: [{
                label: 'Preço Médio (R$)',
                data: avgPriceCategoryData.data,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Distribuição de Preços
    new Chart(document.getElementById('priceDistributionChart'), {
        type: 'doughnut',
        data: {
            labels: priceDistributionData.labels,
            datasets: [{
                label: 'Distribuição de Preços',
                data: priceDistributionData.data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Criar os gráficos quando o modal for aberto
document.getElementById('infoModal').addEventListener('shown.bs.modal', function () {
    createCharts();
});