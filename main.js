const express = require('express');
const mysql = require('mysql2/promise');

// Conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crudnodejs'
});

// Crear un servidor Express
const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

// Crear un nuevo registro
app.post('/api/registros', async (req, res) => {
  try {
    const { nombre, edad } = req.body;
    const resultado = await pool.query('INSERT INTO registros (nombre, edad) VALUES (?, ?)', [nombre, edad]);
    res.json({ mensaje: 'Registro creado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear registro' });
  }
});

// Leer todos los registros
app.get('/api/registros', async (req, res) => {
  try {
    const resultados = await pool.query('SELECT * FROM registros');
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al leer registros' });
  }
});

// Leer un registro por ID
app.get('/api/registros/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await pool.query('SELECT * FROM registros WHERE id = ?', [id]);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ mensaje: 'Registro no encontrado' });
  }
});

// Actualizar un registro
app.put('/api/registros/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, edad } = req.body;
    const resultado = await pool.query('UPDATE registros SET nombre = ?, edad = ? WHERE id = ?', [nombre, edad, id]);
    res.json({ mensaje: 'Registro actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar registro' });
  }
});

// Eliminar un registro
app.delete('/api/registros/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await pool.query('DELETE FROM registros WHERE id = ?', [id]);
    res.json({ mensaje: 'Registro eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar registro' });
  }
});

// Iniciar el servidor
const puerto = 4000;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});