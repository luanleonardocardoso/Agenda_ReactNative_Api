import { Router, Request, Response } from "express";
import pool from "../../connectionData/dataBaseConnection";

const scheduledTime = Router();

scheduledTime.get("/", async (req: Request, res: Response) => {
  try {
    const { starton, finishedon } = req.query;

    if (!starton || !finishedon) {
      res
        .status(400)
        .json({
          success: false,
          message: "Parâmetros 'starton' e 'finishedon' são obrigatórios.",
        });
      return;
    }

    if (
      isNaN(Date.parse(starton as string)) ||
      isNaN(Date.parse(finishedon as string))
    ) {
      res
        .status(400)
        .json({
          success: false,
          message:
            "Os parâmetros 'starton' e 'finishedon' devem estar no formato de data válido.",
        });
      return;
    }

    const query = `
      SELECT 
        SC.id,
        SC.short_description,
        SC.full_description,
        SC.starton,
        SC.finishedon
      FROM scheduled_time SC
      WHERE SC.starton >= ? AND SC.finishedon <= ?
      Order by SC.starton
    `;

    const [rows] = await pool.query(query, [starton, finishedon]);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erro ao buscar horários agendados:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar horários agendados" });
  }
});

export default scheduledTime;
