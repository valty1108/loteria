const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir los archivos HTML estáticos
app.use(express.static(path.join(__dirname, '/')));

// Guardamos el estado de la carta actual en la sala
let cartaActual = { name: "¡Esperando inicio!", emoji: "🎪" };

io.on('connection', (socket) => {
    console.log('Un jugador se ha conectado: ' + socket.id);

    // Al conectarse, le enviamos la carta que va actualmente en la sala
    socket.emit('actualizarCarta', cartaActual);

    // Cuando el "Cantor" saca una nueva carta, la comparte a todos
    socket.on('cartaCantada', (carta) => {
        cartaActual = carta;
        io.emit('actualizarCarta', cartaActual); // Envía a TODOS los conectados
    });

    // Cuando alguien grita ¡Lotería!
    socket.on('gritarLoteria', (nombreJugador) => {
        io.emit('anuncioGanador', nombreJugador);
    });

    socket.on('disconnect', () => {
        console.log('Un jugador se ha desconectado.');
    });
});

// Render asigna un puerto automático, si no existe usa el 3000
const PORT = process.env.PORT || 3000; 

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});