const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 5000;

// Configurar middleware
app.use(cors());
app.use(bodyParser.json());

// ============================== RUTAS ==============================

// Usuarios
app.post('/usuarios', (req, res) => {
    const { nombre, rol } = req.body;
    db.run('INSERT INTO usuarios (nombre, rol) VALUES (?, ?)', [nombre, rol], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, nombre, rol });
    });
});

app.get('/usuarios', (req, res) => {
    db.all('SELECT * FROM usuarios', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, rol } = req.body;
    db.run('UPDATE usuarios SET nombre = ?, rol = ? WHERE id = ?', [nombre, rol, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id, nombre, rol });
    });
});

app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM usuarios WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `Usuario con ID ${id} eliminado.` });
    });
});

// Productos
app.post('/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.run('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', [nombre, precio, stock], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, nombre, precio, stock });
    });
});

app.get('/productos', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    db.run('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?', [nombre, precio, stock, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id, nombre, precio, stock });
    });
});

app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM productos WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `Producto con ID ${id} eliminado.` });
    });
});

// Clientes
app.post('/clientes', (req, res) => {
    const { nombre } = req.body;
    db.run('INSERT INTO clientes (nombre) VALUES (?)', [nombre], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, nombre });
    });
});

app.get('/clientes', (req, res) => {
    db.all('SELECT * FROM clientes', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    db.run('UPDATE clientes SET nombre = ? WHERE id = ?', [nombre, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id, nombre });
    });
});

app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM clientes WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `Cliente con ID ${id} eliminado.` });
    });
});

// Pedidos
app.post('/pedidos', (req, res) => {
    const { producto_id, cliente_id, cantidad, fecha } = req.body;
    db.run('INSERT INTO pedidos (producto_id, cliente_id, cantidad, fecha) VALUES (?, ?, ?, ?)', [producto_id, cliente_id, cantidad, fecha], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, producto_id, cliente_id, cantidad, fecha });
    });
});

app.get('/pedidos', (req, res) => {
    db.all(`
        SELECT pedidos.id, productos.nombre AS producto, pedidos.cantidad, clientes.nombre AS cliente, pedidos.fecha
        FROM pedidos
        JOIN productos ON pedidos.producto_id = productos.id
        JOIN clientes ON pedidos.cliente_id = clientes.id
    `, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.put('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const { producto_id, cliente_id, cantidad, fecha } = req.body;
    db.run('UPDATE pedidos SET producto_id = ?, cliente_id = ?, cantidad = ?, fecha = ? WHERE id = ?', [producto_id, cliente_id, cantidad, fecha, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id, producto_id, cliente_id, cantidad, fecha });
    });
});

app.delete('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM pedidos WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: `Pedido con ID ${id} eliminado.` });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
