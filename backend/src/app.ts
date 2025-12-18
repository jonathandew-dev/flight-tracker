import express, { Application,Request,Response } from "express";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet'; 
import cors from 'cors';


import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import savedTripRoutes from "./modules/savedTrip/savedTrip.routes.js";
import amadeusRoutes from "./modules/amadeus/amadeus.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";


const app: Application = express();

// ----------------------
// Middleware
// ----------------------

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/api/saved-trips",savedTripRoutes);
app.use("/api/amadeus", amadeusRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});
// Error handler
app.use(errorHandler);

export default app;
