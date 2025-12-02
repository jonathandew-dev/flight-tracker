import express, { Application } from "express";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./modules/user/user.routes";
import savedTripRoutes from './modules/savedTrip/savedTrip.routes';
import amadeusRoutes from "./modules/amadeus/amadeus.routes";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use('/users', userRoutes);
app.use("/savedTrips",savedTripRoutes);
app.use("/api/flights", amadeusRoutes);

app.get('/', (req, res) => res.send('Server is running'))

// Error handler
app.use(errorHandler);

export default app;
