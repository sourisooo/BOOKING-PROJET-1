import express from "express";
import { getAll, getSingle, addRoom, updateRoom, deleteRoom, createRoomReview } from '../controllers/roomController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// router.route("/").get(getAll).post(protect, admin, addRoom);
// router.route("/:id/reviews").post(protect, createRoomReview);
router.route("/:id").get(getSingle).put(protect, updateRoom).delete(protect, admin, deleteRoom);
router.route("/").get(getAll).post(addRoom);
router.route("/:id/reviews").post(createRoomReview);
router.route("/:id").get(getSingle).put(updateRoom).delete(deleteRoom);

export default router;