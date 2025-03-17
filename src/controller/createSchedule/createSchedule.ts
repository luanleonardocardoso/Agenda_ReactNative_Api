import { Router, Request, Response } from "express";
import pool from "../../connectionData/dataBaseConnection";
import { OkPacket } from "mysql2";

const createSchedule = Router();

createSchedule.post("/", async (req: Request, res: Response) => {
  try {
    const { short_description, full_description, starton, finishedon } =
      req.body;

    if (!short_description || !full_description || !starton || !finishedon) {
      console.warn("⚠️ Campos obrigatórios ausentes!");
      res
        .status(400)
        .json({ success: false, message: "Todos os campos são obrigatórios." });
      return;
    }

    const query = `
      INSERT INTO scheduled_time (short_description, full_description, starton, finishedon) 
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query<OkPacket>(query, [
      short_description,
      full_description,
      starton,
      finishedon,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(201)
        .json({ success: true, message: "Agendamento criado com sucesso." });
    } else {
      console.error("Falha ao inserir no banco!");
      res
        .status(500)
        .json({ success: false, message: "Erro ao criar o agendamento." });
    }
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao criar o agendamento." });
  }
});

export default createSchedule;
