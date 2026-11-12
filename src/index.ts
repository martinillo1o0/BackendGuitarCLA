//console.log("desde Index.ts Holaaaaaa!!!!!");
import server, { connectDb } from "./server";
import dotenv from 'dotenv';
dotenv.config()
const port = process.env.PORT || 4002;

async function startServer() {
    try {
        await connectDb();
        server.listen(port, () => {
            console.log(`REST API escuchando en http://localhost:${port}`);
        });
    } catch (error) {
        console.error("No se pudo conectar con PostgreSQL:", error);
        process.exitCode = 1;
    }
}

void startServer();