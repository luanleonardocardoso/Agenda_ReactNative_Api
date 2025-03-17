import { Router, Request, Response } from "express";
import pool from "../../connectionData/dataBaseConnection";

const deleteSchedule = Router();

deleteSchedule.delete("/", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      res
        .status(400)
        .json({ success: false, message: "O parâmetro 'id' é obrigatório." });
      return;
    }

    if (isNaN(Number(id))) {
      res
        .status(400)
        .json({ success: false, message: "O ID deve ser um número válido." });
      return;
    }

    const query = `DELETE FROM scheduled_time WHERE id = ?`;

    const [result] = await pool.query(query, [id]);

    if ((result as any).affectedRows === 0) {
      res
        .status(404)
        .json({
          success: false,
          message: "Nenhum agendamento encontrado com esse ID.",
        });
      return;
    }

    res.json({ success: true, message: "Agendamento deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar o horário agendado:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao deletar o horário agendado." });
  }
});

export default deleteSchedule;
