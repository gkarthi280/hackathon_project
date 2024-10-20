const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("./database");
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

// Load SSL credentials
const privateKey = fs.readFileSync("../client/server.key", "utf8"); // Adjust path if needed
const certificate = fs.readFileSync("../client/server.cert", "utf8"); // Adjust path if needed
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const server = https.createServer(credentials, app);

const io = new Server(server, {
  cors: {
    origin: ["https://10.77.0.149:5173", "https://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: ["https://10.77.0.149:5173", "https://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware to use io in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(bodyParser.json());

// Routes
app.use("/user", userRoutes);
app.use("/game", gameRoutes);

// Now pass io to the admin routes after io is initialized
const adminRoutes = require("./controllers/consoleControllers")(io);
app.use("/admin", adminRoutes); // Mount the routes

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
