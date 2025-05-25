import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from './config/db.js';
import dotenv from "dotenv";
import { errorHandler, notFound } from './middleware/errorHandler.js';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database

// Middleware
if(process.env.NODE_ENV !== "production"){
  app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
}

app.use(express.json());

// Routes
app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production"){
  // Serve static files from the frontend/dist directory
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));

  // Handle all other routes by serving the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("server is running on port :", PORT);
    });
});
