import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from './config/db.js';
import dotenv from "dotenv";
import { errorHandler, notFound } from './middleware/errorHandler.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use("/api/notes", notesRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("server is running on port :", PORT);
    });
});
