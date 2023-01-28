import express from 'express';
import { getAll, newBooking, checkRoomIsAvailble, getBookedDates, myBookings, deleteBooking } from '../controllers/bookingController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// router.route("/").post(protect, newBooking).get(protect, admin, getAll);
router.route("/").post(newBooking).get(getAll);
// router.route("/me").get(protect, myBookings);
router.route("/me").get(myBookings);
router.route("/check").post(checkRoomIsAvailble);
router.route("/dates/:roomId").get(getBookedDates);
// router.route("/:id").delete(protect, admin, deleteBooking);
router.route("/:id").delete(deleteBooking);

export default router;

//Commentaires
//La feuille de code configure les routes relatives à toutes les requetes réalisées au serveur.
//Toutes les requetes POST, GET, DELETE sont paramétrés dans la feuille de code puis l'objet ou l'array d'objet de la méthode
//est déterminé par la feuille de code bookingController. Ces requetes sont exécuté en fonction de la racine de l'adresse
//HTML (ex: "/", "/check").