const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos SQLite en el archivo database.db
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err.message);
        process.exit(1); // Finaliza el proceso si hay un error de conexión
    } else {
        console.log("Conectado a la base de datos SQLite.");

        // Crear tabla de usuarios si no existe
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                rol TEXT NOT NULL
            );
        `, (err) => {
            if (err) {
                console.error("Error al crear la tabla 'usuarios':", err.message);
            } else {
                console.log("Tabla 'usuarios' verificada o creada exitosamente.");
            }
        });

        // Crear tabla de productos si no existe
        db.run(`
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                precio REAL NOT NULL,
                stock INTEGER NOT NULL
            );
        `, (err) => {
            if (err) {
                console.error("Error al crear la tabla 'productos':", err.message);
            } else {
                console.log("Tabla 'productos' verificada o creada exitosamente.");
            }
        });

        // Crear tabla de pedidos si no existe
        db.run(`
           CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                producto_id INTEGER,
                cantidad INTEGER,
                fecha TEXT,
                FOREIGN KEY (producto_id) REFERENCES productos(id)
            );
        `, (err) => {
            if (err) {
                console.error("Error al crear la tabla 'pedidos':", err.message);
            } else {
                console.log("Tabla 'pedidos' verificada o creada exitosamente.");
            }
        });
    }
});

module.exports = db;
