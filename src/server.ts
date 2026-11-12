import express from "express";
import router from "./router";
import db from "./config/db";

export async function connectDb() {
    await db.authenticate();
    await db.sync();
    console.log("Conexion a base de datos exitosa");
}

const server = express();
server.use(express.json());
server.use("/api", router);

export default server;
