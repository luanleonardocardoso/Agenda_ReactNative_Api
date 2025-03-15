import express from "express";
import "dotenv/config";
import cors from "cors";
import routes from "./routes/routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
