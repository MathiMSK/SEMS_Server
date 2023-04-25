import express from "express";
import auth from "../middleware/auth.js";
import authZ from "../middleware/authz.js";
import { createEvent, getAllEvent, getEventById, updateEvent } from "../controllers/eventController.js";

const router = express.Router();

router.post("/event/createevent",[auth,authZ],createEvent)
router.get("/event/geteventbyid/:id",[auth,authZ],getEventById)
router.get("/event/getallevent",[auth,authZ],getAllEvent)
router.put("/event/updateevent",[auth,authZ],updateEvent)

export default router;