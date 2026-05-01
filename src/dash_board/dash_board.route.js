import { Router } from "express";

import { AdminUserGuard } from "../middleware/guardMiddleware.js";
import { getReport } from "./dash_board.controller.js";

const DashboardRouter = Router();

DashboardRouter.get("/report", AdminUserGuard, getReport);

export default DashboardRouter;
