import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {

    getNotifications,

    markAsRead,

    markAllAsRead,

    deleteNotification,

} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:userId", getNotifications);

router.put("/read/:notificationId", markAsRead);

router.get(

"/",

authMiddleware,

getNotifications

);

router.put(

"/read/:notificationId",

authMiddleware,

markAsRead

);

router.put(

"/read-all",

authMiddleware,

markAllAsRead

);

router.delete(

"/:notificationId",

authMiddleware,

deleteNotification

);


export default router;