require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const usersRoute = require('./routes/user');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

// Fixed: Added socket parameter and disconnect handler
io.on('connection', (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on('disconnect', () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log("MongoDB connection error:", e));

app.use('/users', usersRoute);

app.get('/', (req, res) => {
  res.send("API working");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});