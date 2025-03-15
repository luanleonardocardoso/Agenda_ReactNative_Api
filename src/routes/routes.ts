import { Router } from "express";
import scheduledTime from "../controller/getSchduledTimes/getScheduledTimes";
import deleteSchedule from "../controller/deleteSchedule/deleteSchedule";
import updateSchedule from "../controller/updateSchedule/updateSchedule";
import createSchedule from "../controller/createSchedule/createSchedule";

const router = Router();

router.use("/scheduled-times", scheduledTime);
router.use("/delete-schedule", deleteSchedule);
router.use("/update-schedule", updateSchedule);
router.use("/create-schedule", createSchedule);

export default router;
