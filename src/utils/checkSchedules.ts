import pool from "../connectionData/dataBaseConnection";
import dayjs from "dayjs";

/**
 * Verifica se o novo horário (starton, finishedon) entra em conflito com algum agendamento já existente no banco.
 * @param starton Novo horário de início (esperado no formato correto)
 * @param finishedon Novo horário de término (esperado no formato correto)
 * @param id (Opcional) ID do agendamento que está sendo editado (para evitar conflito consigo mesmo)
 * @returns true se houver conflito, false se não houver
 */
export const checkSchedulesConflict = async (
  starton: string,
  finishedon: string,
  id?: number
): Promise<boolean> => {
  try {
    if (!dayjs(starton).isValid() || !dayjs(finishedon).isValid()) {
      console.error("⛔ Data inválida detectada:", starton, finishedon);
      return true;
    }

    const formattedStarton = dayjs(starton).format("YYYY-MM-DD HH:mm:ss");
    const formattedFinishedon = dayjs(finishedon).format("YYYY-MM-DD HH:mm:ss");

    console.log(
      `🔍 Verificando conflito: ${formattedStarton} - ${formattedFinishedon}`
    );

    const query = `
  SELECT id FROM scheduled_time 
  WHERE 
    (starton < ? AND finishedon > ?)  
    OR (starton < ? AND finishedon > ?)  
    OR (starton >= ? AND finishedon <= ?) 
    ${id ? "AND id != ?" : ""}
`;

    const params = id
      ? [
          formattedFinishedon,
          formattedFinishedon,
          formattedStarton,
          formattedStarton,
          formattedStarton,
          formattedFinishedon,
          id,
        ]
      : [
          formattedFinishedon,
          formattedFinishedon,
          formattedStarton,
          formattedStarton,
          formattedStarton,
          formattedFinishedon,
        ];

    const [rows] = await pool.query(query, params);

    return (rows as any[]).length > 0;
  } catch (error) {
    console.error("❌ Erro ao verificar conflitos de horário:", error);
    return true;
  }
};
