import { Router, Request, Response } from "express";
import pool from "../../connectionData/dataBaseConnection";
import { checkSchedulesConflict } from "../../utils/checkSchedules";

const updateSchedule: Router = Router();

// 🔥 Endpoint para atualizar um horário agendado
updateSchedule.put("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, short_description, full_description, starton, finishedon } =
      req.body;

    console.log("📥 Dados recebidos do Frontend:", {
      id,
      short_description,
      full_description,
      starton,
      finishedon,
    });

    if (!id) {
      res
        .status(400)
        .json({ success: false, message: "O parâmetro 'id' é obrigatório." });
      return;
    }

    if (!short_description && !full_description && !starton && !finishedon) {
      res
        .status(400)
        .json({
          success: false,
          message: "Nenhum dado enviado para atualização.",
        });
      return;
    }

    const formattedStarton = starton
      ? starton.replace("T", " ").split(".")[0]
      : null;
    const formattedFinishedon = finishedon
      ? finishedon.replace("T", " ").split(".")[0]
      : null;

    console.log("🔍 Dados processados (sem conversão de fuso horário):", {
      formattedStarton,
      formattedFinishedon,
    });

    if (
      (starton && !formattedStarton) ||
      (finishedon && !formattedFinishedon)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Os horários informados são inválidos. Certifique-se de usar o formato correto: YYYY-MM-DD HH:mm:ss",
      });
      return;
    }

    if (formattedStarton && formattedFinishedon) {
      const hasConflict = await checkSchedulesConflict(
        formattedStarton,
        formattedFinishedon,
        id
      );
      if (hasConflict) {
        console.log("Conflito detectado para:", {
          formattedStarton,
          formattedFinishedon,
        });

        res.status(400).json({
          success: false,
          message: `O horário selecionado (${formattedStarton} - ${formattedFinishedon}) entra em conflito com outro agendamento já existente. Por favor, escolha um horário diferente.`,
        });
        return;
      }
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (short_description) {
      fields.push("short_description = ?");
      values.push(short_description);
    }

    if (full_description) {
      fields.push("full_description = ?");
      values.push(full_description);
    }

    if (formattedStarton) {
      fields.push("starton = ?");
      values.push(formattedStarton);
    }

    if (formattedFinishedon) {
      fields.push("finishedon = ?");
      values.push(formattedFinishedon);
    }

    values.push(id);

    if (fields.length === 0) {
      res
        .status(400)
        .json({
          success: false,
          message: "Nenhum campo válido foi enviado para atualização.",
        });
      return;
    }

    const query = `UPDATE scheduled_time SET ${fields.join(", ")} WHERE id = ?`;
    console.log("📝 Query SQL:", query, " | Valores:", values);

    const [result] = await pool.query(query, values);

    if ((result as any).affectedRows === 0) {
      res
        .status(404)
        .json({
          success: false,
          message: "Nenhum agendamento encontrado com esse ID.",
        });
      return;
    }

    console.log("✅ Agendamento atualizado com sucesso!");
    res.json({ success: true, message: "Agendamento atualizado com sucesso." });
  } catch (error) {
    console.error("❌ Erro ao atualizar o horário agendado:", error);
    res
      .status(500)
      .json({
        success: false,
        message:
          "Erro ao atualizar o horário agendado. Tente novamente mais tarde.",
      });
  }
});

export default updateSchedule;
