// Función para mostrar la vista seleccionada
function showView(view) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => v.classList.remove('active'));
    document.getElementById(view).classList.add('active');

    // Cargar datos según la vista
    if (view === 'usuarios') fetchUsuarios();
    else if (view === 'inventario') fetchInventario();
    else if (view === 'pedidos') fetchPedidos();
}

// Funciones para gestionar usuarios
function fetchUsuarios() {
    fetch('http://localhost:5000/usuarios')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#usuariosTable tbody');
            tbody.innerHTML = '';
            data.forEach(usuario => {
                const row = `<tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button onclick="prepareEdit(${usuario.id}, '${usuario.nombre}', '${usuario.rol}')">Modificar</button>
                        <button onclick="deleteUser(${usuario.id})">Eliminar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        });
}

function prepareEdit(id, nombre, rol) {
    document.getElementById('modificarId').value = id;
    document.getElementById('modificarNombre').value = nombre;
    document.getElementById('modificarRol').value = rol;
}

function updateUser() {
    const id = document.getElementById('modificarId').value;
    const nombre = document.getElementById('modificarNombre').value;
    const rol = document.getElementById('modificarRol').value;

    fetch(`http://localhost:5000/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, rol })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        fetchUsuarios();
        clearModifyForm();
    });
}

function clearModifyForm() {
    document.getElementById('modificarId').value = '';
    document.getElementById('modificarNombre').value = '';
    document.getElementById('modificarRol').value = '';
}

// Otras funciones para inventario, pedidos y reportes
function fetchInventario() {
    fetch('http://localhost:5000/inventario')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#inventarioTable tbody');
            tbody.innerHTML = '';
            data.forEach(producto => {
                const row = `<tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.stock}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        });
}

function fetchPedidos() {
    fetch('http://localhost:5000/pedidos')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#pedidosTable tbody');
            tbody.innerHTML = '';
            data.forEach(pedido => {
                const row = `<tr>
                    <td>${pedido.id}</td>
                    <td>${pedido.producto_id}</td>
                    <td>${pedido.cantidad}</td>
                    <td>${pedido.estado}</td>
                    <td>
                        <button onclick="deleteOrder(${pedido.id})">Eliminar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        });
}

function createUser() {
    const nombre = prompt("Ingrese el nombre del nuevo usuario:");
    const rol = prompt("Ingrese el rol del nuevo usuario:");

    fetch('http://localhost:5000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, rol })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        fetchUsuarios();
    });
}

function deleteUser(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        fetch(`http://localhost:5000/usuarios/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.mensaje);
                fetchUsuarios();
            });
    }
}

function createOrder() {
    const producto_id = prompt("Ingrese el ID del producto:");
    const cantidad = prompt("Ingrese la cantidad:");

    fetch('http://localhost:5000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto_id, cantidad })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        fetchPedidos();
    });
}

function deleteOrder(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
        fetch(`http://localhost:5000/pedidos/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.mensaje);
                fetchPedidos();
            });
    }
}

function updateInventory() {
    // Implementar lógica para actualizar el inventario
    alert("Lógica para actualizar el inventario no implementada.");
}

function fetchReport() {
    // Implementar lógica para generar reportes
    alert("Lógica para generar reportes no implementada.");
}
