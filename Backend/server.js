const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear una ruta automática para la base de datos
const dbPath = path.join(__dirname, 'database.db');

// Crear una conexión a la base de datos SQLite
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Inicializar la base de datos
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        rol TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        precio REAL,
        stock INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producto_id INTEGER,
        cantidad INTEGER,
        fecha TEXT,
        FOREIGN KEY(producto_id) REFERENCES productos(id)
    )`);
});

// Crear el servidor
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint para crear un usuario
app.post('/usuarios', (req, res) => {
    const { nombre, rol } = req.body;
    db.run(`INSERT INTO usuarios (nombre, rol) VALUES (?, ?)`, [nombre, rol], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', id: this.lastID });
    });
});

// Endpoint para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    db.all('SELECT * FROM usuarios', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint para actualizar un usuario
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, rol } = req.body;

    db.get(`SELECT * FROM usuarios WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        db.run(`UPDATE usuarios SET nombre = ?, rol = ? WHERE id = ?`, [nombre, rol, id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ mensaje: 'Usuario actualizado exitosamente' });
        });
    });
});

// Endpoint para eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM usuarios WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    });
});

// Endpoint para crear un pedido
app.post('/pedidos', (req, res) => {
    const { producto_id, cantidad, fecha } = req.body;

    db.run(`INSERT INTO pedidos (producto_id, cantidad, fecha) VALUES (?, ?, ?)`, [producto_id, cantidad, fecha], function (err) {
        if (err) {
            console.error('Error al crear el pedido:', err); // Log del error
            return res.status(500).json({ error: "Error al crear el pedido" });
        }
        res.status(201).json({ mensaje: 'Pedido creado exitosamente', id: this.lastID });
    });
});


// Endpoint para obtener todos los pedidos
app.get('/pedidos', (req, res) => {
    db.all('SELECT * FROM pedidos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint para actualizar un pedido
app.put('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const { producto_id, cantidad, fecha } = req.body;

    db.run(`UPDATE pedidos SET producto_id = ?, cantidad = ?, fecha = ? WHERE id = ?`, [producto_id, cantidad, fecha, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ mensaje: 'Pedido actualizado exitosamente' });
    });
});

// Endpoint para eliminar un pedido
app.delete('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM pedidos WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ mensaje: 'Pedido eliminado exitosamente' });
    });
});

// Endpoint para obtener todos los productos
app.get('/productos', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Error al obtener productos" });
            return;
        }
        res.json(rows);
    });
});

// Endpoint para crear un nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.run(`INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)`, [nombre, precio, stock], function (err) {
        if (err) {
            res.status(500).json({ error: "Error al crear el producto" });
            return;
        }
        res.status(201).json({ mensaje: 'Producto creado exitosamente', id: this.lastID });
    });
});

// Endpoint para actualizar un producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    db.run(`UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?`, [nombre, precio, stock, id], function (err) {
        if (err) {
            res.status(500).json({ error: "Error al actualizar el producto" });
            return;
        }
        res.json({ mensaje: 'Producto actualizado exitosamente' });
    });
});

// Endpoint para eliminar un producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM productos WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ error: "Error al eliminar el producto" });
            return;
        }
        res.json({ mensaje: 'Producto eliminado exitosamente' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
