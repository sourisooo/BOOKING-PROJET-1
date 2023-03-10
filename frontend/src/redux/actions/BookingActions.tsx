import { Dispatch } from "redux";
import axios from 'axios';
import * as actions from '../constants/BookingConstants';
import { IRoom } from "../../interfaces/IRoom";
import { IBooking, ICreateBooking } from "../../interfaces/IBooking";

export const checkRoomBooking = (id: IRoom['_id'], checkInDate: Date, checkOutDate: Date) => async (dispatch: Dispatch) => {

    try {
        dispatch({ type: actions.CHECK_ROOM_BOOKING_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/JSON",
            }
        }

        await axios.post(`/api/bookings/check`, {id, checkInDate, checkOutDate}, config);

        dispatch({ type: actions.CHECK_ROOM_BOOKING_SUCCESS });

    } catch (error: any) {
        dispatch({ 
            type: actions.CHECK_ROOM_BOOKING_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const createBooking = (bookingData: ICreateBooking) => async (dispatch: Dispatch, getState: any) => {

    try {
        dispatch({ type: actions.CREATE_BOOKING_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                "Content-Type": "application/JSON",
                "Authorization": `Bearer ${userInfo.token}`
            }
        }

        await axios.post(`/api/bookings`, bookingData, config);

        dispatch({ type: actions.CREATE_BOOKING_SUCCESS });

    } catch (error: any) {
        dispatch({ 
            type: actions.CREATE_BOOKING_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const getBookedDates = (roomId:  IRoom['_id']) => async (dispatch: Dispatch) => {

    try {
        dispatch({ type: actions.GET_BOOKED_DATES_REQUEST });

        const { data } = await axios.get(`/api/bookings/dates/${roomId}`);

        dispatch({ type: actions.GET_BOOKED_DATES_SUCCESS, payload: data });

    } catch (error: any) {
        dispatch({ 
            type: actions.GET_BOOKED_DATES_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const getMyBookings = () => async (dispatch: Dispatch, getState: any) => {

    try {
        dispatch({ type: actions.GET_MY_BOOKINGS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                "Content-Type": "application/JSON",
                "Authorization": `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/bookings/me`, config);

        dispatch({ type: actions.GET_MY_BOOKINGS_SUCCESS, payload: data });

    } catch (error: any) {
        dispatch({ 
            type: actions.GET_MY_BOOKINGS_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const getAllBookings = (currentPage: number) => async (dispatch: Dispatch, getState: any) => {

    try {
        dispatch({ type: actions.FETCH_BOOKINGS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                "Content-Type": "application/JSON",
                "Authorization": `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/bookings/?pageNumber=${currentPage}`, config);

        dispatch({ type: actions.FETCH_BOOKINGS_SUCCESS, payload: data });

    } catch (error: any) {
        dispatch({ 
            type: actions.FETCH_BOOKINGS_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const deleteBooking = (bookingId: IBooking['_id']) => async (dispatch: Dispatch, getState: any) => {

    try {
        dispatch({ type: actions.DELETE_BOOKING_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                "Authorization": `Bearer ${userInfo.token}`
            }
        };

        await axios.delete(`/api/bookings/${bookingId}`, config);

        dispatch({ type: actions.DELETE_BOOKING_SUCCESS });

    } catch (error: any) {
        dispatch({ 
            type: actions.DELETE_BOOKING_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

//Commentaires
//La feuilles de code g??re toutes les requetes r??alis??es au serveur ?? l'adresse /api/bookings/. Chaque fonction sp??cifie un type
//de requete sp??cifique put/get/udpate au serveur puis r??alise une affectation de valeur/param??tre via le dispatch d'un sc??narii redux,
//de la meme mani??re que le projet reactbooking.
//La variable checkRoomBooking stocke le r??sultat d'une fonction prenant pour entr??e un string et deux date, elle meme appelant une 
//fonction asynchrone prenant pour entr??e un sc??nari (utilisable par l'appel de dispatch). La fonction asynchrone va ensuite
//appel?? le sc??narii actions.CHECK_ROOM_BOOKING_REQUEST permettant de modifier la variable loading. Puis une requete va etre
//envoyer au serveur pour sauvegarder des informations sur le serveur en utilisant les donn??es en entr??e de la premi??re fonction.
//Ensuite le sc??narii actions.CHECK_ROOM_BOOKING_SUCCESS permettant de modifier les variables loading et success va etre utiliser.
//La fonction createBooking est structur?? de la meme mani??re que  checkRoomBooking: une fonction appelant une fonction asynchrone,
//les diff??rences r??sidant dans les param??tres de la premi??re fonction puis de la cr??ation d'une fonction dans les param??tres d'entr??e
//de la fonction synchrone, le corps de la fonction ??tant sp??cifi?? ult??rieurement dans le corps de la fonction asynchrone(meme principe
//que la destructuration, les objets et param??tres constituant cette fonction seront plus tard utilis??s dans le corps de la fonction).
//Plusieurs sc??nariss sont utilis??e principalement ?? titre informatif pour l'utilisateur et une requete est envoy?? au serveur avec une
//requete post prenant pour entr??e l'objet en entr??e de la premi??re fonction (bookingData de type ICreateBooking poss??dant un formalisme
//?? respecter).
//La fonction getBookedDates  est structur?? de la meme mani??re les fonctions pr??c??dentes. Un premier sc??narii va etre appel??:
//"actions.GET_BOOKED_DATES_REQUEST " (?? titre informatif pour l'utilisateur), ensuite une requete GET est r??alis??e au serveur en prenant pour
//argument de requete le string en entr??e de la premi??re fonction. La r??ponse de cette requete (objet) est sauvegard?? dans la constante data.
//Puis cet objet va etre utiliser en argument d'un sc??narii redux: actions.GET_BOOKED_DATES_SUCCESS. Ce sc??narii permet de modifier le
//param??tre/variable "bookedDates".
//La fonction getMyBookings est structur?? de la meme mani??re la fonction getBookedDates. Les principales diff??rences r??sident dans 3 points:
// - actions.GET_MY_BOOKINGS_REQUEST (informatif pour l'utilisateur)
// - la requete GET au serveur va etre r??alis?? ?? la racine HTML /api/bookings/me (`/api/bookings/dates/${roomId}` pr??cedemment)
// -  actions.GET_MY_BOOKINGS_SUCCESS (modifie le param??tre/variable "myBookings" en utilisant la data de la requete GET)

//La fonction getAllBookings est structur?? de la meme mani??re la fonction getBookedDates. Les principales diff??rences r??sident dans 3 points:
//// - actions.FETCH_BOOKINGS_REQUEST (informatif pour l'utilisateur)
// - la requete GET au serveur va etre r??alis?? ?? la racine HTML `/api/bookings/?pageNumber=${currentPage}` (`/api/bookings/dates/${roomId}` pr??cedemment)
// -  actions.FETCH_BOOKINGS_SUCCESS, (modifie plusieurs param??tres/variables dont "bookings" en utilisant la data de la requete GET)

//La fonction deleteBooking est structur?? de la meme mani??re la fonction getBookedDates. Les principales diff??rences r??sident dans 3 points:
//// - actions.DELETE_BOOKING_REQUEST  (informatif pour l'utilisateur)
// - la m??thode utilis??e pour r??alis??e la requete est DELETE (GET pr??cedemment), la requete au serveur va etre r??alis?? ?? la racine HTML
// '/api/bookings/${bookingId}' (`/api/bookings/dates/${roomId}` pr??cedemment)
// -  actions.DELETE_BOOKING_SUCCESS,  (informatif pour l'utilisateur)