// Definir la función mostrarVista de forma global
function mostrarVista(vista) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach((v) => v.classList.remove('active'));
    document.getElementById(vista).classList.add('active');
}

document.addEventListener("DOMContentLoaded", function() {
    const API_URL = 'http://localhost:5000';

    document.getElementById('form-usuario').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const rol = document.getElementById('rol').value;

        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, rol })
            });
            const data = await response.json();
            alert(data.mensaje);
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    });

    document.getElementById('form-pedido').addEventListener('submit', async (e) => {
        e.preventDefault();
        const producto = document.getElementById('producto').value;
        const cantidad = document.getElementById('cantidad').value;

        try {
            const response = await fetch(`${API_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ producto, cantidad })
            });
            const data = await response.json();
            alert(data.mensaje);
            cargarPedidos();
        } catch (error) {
            console.error('Error al crear el pedido:', error);
        }
    });

    async function cargarInventario() {
        try {
            const response = await fetch(`${API_URL}/inventario`);
            const inventario = await response.json();

            const tbody = document.querySelector('#lista-inventario tbody');
            tbody.innerHTML = '';
            if (Array.isArray(inventario)) {
                inventario.forEach((item) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.nombre}</td>
                        <td>${item.stock}</td>
                        <td><button onclick="actualizarInventario(${item.id})">Actualizar</button></td>
                    `;
                    tbody.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error al cargar el inventario:', error);
        }
    }

    async function actualizarInventario(id) {
        const cantidad = prompt('Nueva cantidad:');
        if (!cantidad || isNaN(cantidad)) {
            alert("Por favor, ingresa una cantidad válida.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/inventario/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: parseInt(cantidad) })
            });
            const data = await response.json();
            alert(data.mensaje);
            cargarInventario();
        } catch (error) {
            console.error('Error al actualizar el inventario:', error);
        }
    }

    async function cargarPedidos() {
        try {
            const response = await fetch(`${API_URL}/pedidos`);
            const pedidos = await response.json();

            const listaPedidos = document.getElementById('lista-pedidos');
            listaPedidos.innerHTML = Array.isArray(pedidos)
                ? pedidos.map(p => `<p>Producto: ${p.producto_id}, Cantidad: ${p.cantidad}</p>`).join('')
                : `<p>Error al cargar pedidos</p>`;
        } catch (error) {
            console.error('Error al cargar los pedidos:', error);
        }
    }

    async function cargarSeguimientoPedidos() {
        try {
            const response = await fetch(`${API_URL}/seguimiento`);
            const seguimiento = await response.json();

            const listaSeguimiento = document.getElementById('lista-seguimiento');
            listaSeguimiento.innerHTML = Array.isArray(seguimiento)
                ? seguimiento.map(s => `<p>Pedido ID: ${s.id}, Estado: ${s.estado}, Fecha: ${s.fecha}</p>`).join('')
                : `<p>Error al cargar el seguimiento de pedidos</p>`;
        } catch (error) {
            console.error('Error al cargar el seguimiento de pedidos:', error);
        }
    }

    async function cargarReportes() {
        try {
            const response = await fetch(`${API_URL}/reportes`);
            const reportes = await response.json();

            const contenidoReportes = document.getElementById('contenido-reportes');
            contenidoReportes.innerHTML = Array.isArray(reportes)
                ? reportes.map(r => `<p>Producto: ${r.producto}, Total Vendido: ${r.total_vendido}</p>`).join('')
                : `<p>Error al cargar reportes</p>`;
        } catch (error) {
            console.error('Error al cargar los reportes:', error);
        }
    }

    cargarInventario();
    cargarPedidos();
    cargarSeguimientoPedidos();
    cargarReportes();
});
