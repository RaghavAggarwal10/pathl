import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoleRoutes from "./routes/userRoleRoutes.js"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/user-roles", userRoleRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
