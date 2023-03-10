import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Booking, { IBooking } from '../models/Booking';
import { IUserRequest } from '../models/User';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment as any);

// @Desc new booking
// @Route /api/bookings
// @Method POST
export const newBooking = asyncHandler(async (req: IUserRequest, res: Response) => {

    const { room, checkInDate, checkOutDate, amountPaid, daysOfStay, paymentInfo } = req.body;

    const booking = await Booking.create({
        room,
        user: req.user._id,
        checkInDate,
        checkOutDate,
        amountPaid,
        daysOfStay,
        paymentInfo,
        paidAt: Date.now(),
    });

    res.status(201).json(booking);

})

// @Desc Check room is available for booking
// @Route /api/bookings/check
// @Method POST
export const checkRoomIsAvailble = asyncHandler(async (req: Request, res: Response) => {

    const { roomId, checkInDate, checkOutDate } = req.body;

    const room = await Booking.find({ room: roomId, $and: [{
            checkInDate: {
                $lte: checkOutDate
            }
        }, {
            checkOutDate: {
                $gte: checkInDate
            }
        }]});

    let roomAvailable;

    if(room && room.length === 0) {
        roomAvailable = true;
    } else {
        roomAvailable = false;
    }

    res.status(201).json({ roomAvailable });

})

// @Desc Get all bookings current user
// @Route /api/bookings/me
// @Method GET
export const myBookings = asyncHandler(async (req: IUserRequest, res: Response) => {

    const bookings = await Booking.find({ user: req.user._id }).populate("user", "name email").populate("room", "name images");

    if(!bookings) {
        res.status(401);
        throw new Error("Bookings not found");
    }

    res.status(201).json(bookings);

})

// @Desc Get booked dates
// Route /api/bookings/dates/:roomId
// @Route GET
export const getBookedDates = asyncHandler(async (req: Request, res: Response) => {

    const bookings = await Booking.find({ room: req.params.roomId });

    let bookedDates: {}[] = [];

    const timeDiffernece = moment().utcOffset() / 60;

    bookings.forEach((booking: IBooking) => {

        const checkInDate = moment(booking.checkInDate).add(timeDiffernece, 'hours')
        const checkOutDate = moment(booking.checkOutDate).add(timeDiffernece, 'hours')

        const range = moment.range(moment(checkInDate), moment(checkOutDate));

        const dates = Array.from(range.by('day'));
        bookedDates = bookedDates.concat(dates);
    })

    res.status(200).json(bookedDates);

})

// @Desc Get all bookings
// @Route /api/bookings
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Booking.countDocuments();
    const bookings = await Booking.find({}).populate("room", "name").populate("user", "name email").limit(pageSize).skip(pageSize * (page - 1));
    res.status(201).json({
        bookings,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
})

// @Desc Delete booking 
// @Route /api/bookings/:id
// @Method DELETE
export const deleteBooking = asyncHandler(async (req: Request, res: Response) => {

    const booking = await Booking.findById(req.params.id);

    if(!booking) {
        res.status(401);
        throw new Error("Booking not found");
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(201).json({});

})

//Commentaires
//La feuille de code g??re toutes les requetes r??alis??ees au serveur sur l'adresse /api/bookings et portant sur
//l'array d'objet booking. asyncHandler permet de g??rer les erreurs avec express. La constante newBooking
//stocke le resultat d'une fonction asychrone. Cete fonction asyncrhone prend en entr??e deux objets requetes 
//et r??ponse. Le param??tre body de la requete est sp??cifi??e de tel mani??re ?? cadrer avec le type d'objet booking.
//Une demande de cr??ation d'objet booking de type schema est r??alis??e en utilisant les sp??cifications de la requete.
//Un r??ponse est envoy??e au client en envoyant l'objet pr??c??demment cr??e au format JSON.
//La constante stocke le r??sultat d'une fonction asynchrone prenant en entr??e deux objets requetes et r??ponse.
//e param??tre body de la requete est sp??cifi??e de tel mani??re ?? cadrer avec les param??tres checkin et checkout de d'objet booking.
//Une recherche est r??alis??e sur l'array d'objet booking en tenant comptes des param??tres d'entr??e.
//La r??ponse est envoy??e au client, en envoyant l'objet trouv?? pr??cedemment en format JSON.
//La constante myBookings stocke le r??sultat d'une fonction asynchrone prenant pour entr??e deux objets requetes et r??ponses
//Le param??tre body de la requete est sp??cifi??e. Populate est une m??thode sp??cifi??e mongoose permettant de retrouver une variable
//sp??ficique de l'objet appartenant ?? l'array d'objet de type schema. Une recherche est r??alis??e dans l'array d'objet booking
//puis des valeurs de param??tres/variables associ??es ?? cet objet sont rapatri??s. La r??ponse est envoy??e au client en envoyant
//l'objet en format JSON.
//La constante getBookedDates stocke le r??sultat d'une fonction asynchrone prenant pour entr??e deux objets requetes et r??ponses.
//Une recherche est r??alis??e sur l'array booking pour retourn??e un array d'objet. Chaque objet de l'array est affect?? une
//date de d??part et une date d'arriv??e. Puis est retourn??e l'array d'objet et leur date de d??part et d'arriv??e et le tout
//est envoy??e au client en format JSON.
//La constante getall stocke le r??sultat d'une fonction asynchrone prenant pour entr??e deux objets requetes et r??ponses.
//Une recherche est r??alis??e sur l'int??gralit?? de l'array d'objet booking de type schema, en retournant certains param??tres,
// La m??thode impl??ment??e mongoose skip permet de skipper une certain nombre de document. Une r??ponse est envoy??e au client
//en envoyant les objets bookings (arrays), page, pages, count.
//La constante deleteBooking stocke le r??sultat d'une fonction asynchrone prenant pour entr??e deux objets requetes et r??ponses.
//Une recherche est faite sur l'array d'objet booking puis l'objet trouv?? est supprim?? de l'array d'objet booking puis une
//r??ponse au client est envoy??e en envoyant un objet vide en format JSON.

