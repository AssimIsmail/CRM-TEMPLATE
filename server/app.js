const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/db.config');
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');  
const app = express();
const path = require('path');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', (message) => {
    socket.broadcast.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// CORS middleware must be applied before any routes
app.use(cors({
  origin: 'http://localhost:4200',  // Autorise seulement les requêtes depuis localhost:4200
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Autorise les méthodes spécifiques
  allowedHeaders: ['Content-Type', 'Authorization'] // Autorise ces en-têtes
}));

app.use(express.json()); // Middleware pour parser les requêtes JSON
require('./associations');

app.use('/api', routes); // Routes API
app.use('/auth', authRoutes); // Routes d'authentification
app.use('/storage/images', express.static(path.join(__dirname, 'storage', 'images'))); // Serve static images
app.use('/storage/profiles', express.static(path.join(__dirname, 'storage', 'profiles'))); // Serve static images

sequelize.sync()
  .then(() => {
    console.log('Les tables ont été créées avec succès.');
  })
  .catch((err) => {
    console.error('Erreur lors de la création des tables:', err);
  });

process.on('uncaughtException', (err) => {
  console.error('Une exception non interceptée a été capturée:', err);
});

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Le serveur Express est en écoute sur le port ${PORT}`);
});
