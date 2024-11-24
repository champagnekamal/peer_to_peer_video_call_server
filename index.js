const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://peer-to-peer-pern.netlify.app", // Production frontend
];
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"], // Allowed methods for WebSocket requests
    allowedHeaders: ["Content-Type"], // Allowed headers
  },
});

// Express CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type"], // Allowed headers for REST API
  credentials: true, // Include cookies/authorization headers if needed
};
app.use(cors(corsOptions));
const dotenv = require("dotenv").config();
const { createuser } = require("./Controller/User");
const { check, validationResult } = require("express-validator");
const { login } = require("./Controller/Login");
const { RefreshToken } = require("./Controller/RefreshToken");
const { CreatePages } = require("./Controller/Pages");
const { Allusers } = require("./Controller/Allusers");
const { getTrendingSearches } = require("./Controller/Googletrends");


app.use(express.json());

const PORT = process.env.PORT || 5000;

const userValidation = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/\d/)
    .withMessage("Password must contain a number."),
  check("username").notEmpty().withMessage("Username cannot be empty."),
];

// auth routes
app.post("/createuser", userValidation, createuser);
app.post("/login", login);
app.post("/refresh-token", RefreshToken);
app.post("/createpage", CreatePages);
app.get("/getallusers", Allusers);
app.get("/getTrendingSearches", getTrendingSearches);

// for video-call
app.get("/video_call",(req,res)=>{
  res.redirect(`/${Math.random()}`)
})

app.get("/:room",(req,res)=>{
  res.render('room',{roomID:req.params.room })
})
  
let connectedUser = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  const email = socket.handshake.query.email;
  const socketID = socket.id;
  const existingUser = connectedUser.find((user) => user.email === email);
  if (existingUser) {
    // Update the socketid if the user already exists (e.g., on reconnect)
    existingUser.socketid = socket.id;
  }
  else {
    // If the email doesn't exist, add the user to the connectedUsers array
    connectedUser.push({
      socketid: socket.id,
      email: email,
    });
  }


  socket.on("message", (data) => {
    const receiver = connectedUser.find((user) => user.email == data.email);
    if (receiver) {
      io.to(receiver.socketid).emit("receivemessage", data);
      console.log("message sent");  
    }
  });

 
  socket.on("call-request", (data) => {   
    const receiver = connectedUser.find((user) => user.email == data.receiverEmail);
    const callerSocketID = connectedUser.find((user) => user.email == data.callerEmail);
    console.log(data,receiver,"receiver123");
    if (receiver) {
      io.to(receiver.socketid).emit("incoming-call", {
        callerEmail: data.callerEmail,
        callerSocketId: callerSocketID,
      });
      console.log(`Call request sent to ${receiver.email}`);
    } else {
      console.log(`User with email ${data.receiverEmail} not found.`);
    }
  });

  socket.on("accept-call", (data) => {
    io.to(data.to).emit("call-accepted");
    console.log(`Call accepted by ${data.to}`);
  });
  
  socket.on("reject-call", (data) => {
    io.to(data.to).emit("call-rejected");
    console.log(`Call rejected by ${data.to}`);
  });


 // Relay the SDP offer
 socket.on("webrtc-offer", (data) => {
  io.to(data.to).emit("webrtc-offer", {
    offer: data.offer,
    callerSocketId: socket.id,
  });
});

 // Relay the SDP answer
 socket.on("webrtc-answer", (data) => {
  io.to(data.to).emit("webrtc-answer", {
    answer: data.answer,
  });
});

  // Relay ICE candidates
  socket.on("ice-candidate", (data) => {
    console.log("ice-candidate", data);
    io.to(data.to).emit("ice-candidate", {
      candidate: data.candidate,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});

 module.exports = { connectedUser };