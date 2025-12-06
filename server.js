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

io.on('connection', () => {
  console.log("Client connected");
});

app.set('io', io);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

app.use('/users', usersRoute);

app.get('/', (req, res) => {
  res.send("API working");
});

server.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
