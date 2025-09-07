const express = require('express');
const { salonesTodos } = require('./configuracion/baseDeDatos');

const app = express();

app.get('/api/salones', async (req, res) => {
    try {
        const salones = await salonesTodos();
        res.json(salones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('API escuchando en puerto 3000');
});