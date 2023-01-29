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
//La feuilles de code gère toutes les requetes réalisées au serveur à l'adresse /api/bookings/. Chaque fonction spécifie un type
//de requete spécifique put/get/udpate au serveur puis réalise une affectation de valeur/paramètre via le dispatch d'un scénarii redux,
//de la meme manière que le projet reactbooking.
//La variable checkRoomBooking stocke le résultat d'une fonction prenant pour entrée un string et deux date, elle meme appelant une 
//fonction asynchrone prenant pour entrée un scénari (utilisable par l'appel de dispatch). La fonction asynchrone va ensuite
//appelé le scénarii actions.CHECK_ROOM_BOOKING_REQUEST permettant de modifier la variable loading. Puis une requete va etre
//envoyer au serveur pour sauvegarder des informations sur le serveur en utilisant les données en entrée de la première fonction.
//Ensuite le scénarii actions.CHECK_ROOM_BOOKING_SUCCESS permettant de modifier les variables loading et success va etre utiliser.
//La fonction createBooking est structuré de la meme manière que  checkRoomBooking: une fonction appelant une fonction asynchrone,
//les différences résidant dans les paramètres de la première fonction puis de la création d'une fonction dans les paramètres d'entrée
//de la fonction synchrone, le corps de la fonction étant spécifié ultérieurement dans le corps de la fonction asynchrone(meme principe
//que la destructuration, les objets et paramètres constituant cette fonction seront plus tard utilisés dans le corps de la fonction).
//Plusieurs scénariss sont utilisée principalement à titre informatif pour l'utilisateur et une requete est envoyé au serveur avec une
//requete post prenant pour entrée l'objet en entrée de la première fonction (bookingData de type ICreateBooking possédant un formalisme
//à respecter).
//La fonction getBookedDates  est structuré de la meme manière les fonctions précédentes. Un premier scénarii va etre appelé:
//"actions.GET_BOOKED_DATES_REQUEST " (à titre informatif pour l'utilisateur), ensuite une requete GET est réalisée au serveur en prenant pour
//argument de requete le string en entrée de la première fonction. La réponse de cette requete (objet) est sauvegardé dans la constante data.
//Puis cet objet va etre utiliser en argument d'un scénarii redux: actions.GET_BOOKED_DATES_SUCCESS. Ce scénarii permet de modifier le
//paramètre/variable "bookedDates".
//La fonction getMyBookings est structuré de la meme manière la fonction getBookedDates. Les principales différences résident dans 3 points:
// - actions.GET_MY_BOOKINGS_REQUEST (informatif pour l'utilisateur)
// - la requete GET au serveur va etre réalisé à la racine HTML /api/bookings/me (`/api/bookings/dates/${roomId}` précedemment)
// -  actions.GET_MY_BOOKINGS_SUCCESS (modifie le paramètre/variable "myBookings" en utilisant la data de la requete GET)

//La fonction getAllBookings est structuré de la meme manière la fonction getBookedDates. Les principales différences résident dans 3 points:
//// - actions.FETCH_BOOKINGS_REQUEST (informatif pour l'utilisateur)
// - la requete GET au serveur va etre réalisé à la racine HTML `/api/bookings/?pageNumber=${currentPage}` (`/api/bookings/dates/${roomId}` précedemment)
// -  actions.FETCH_BOOKINGS_SUCCESS, (modifie plusieurs paramètres/variables dont "bookings" en utilisant la data de la requete GET)

//La fonction deleteBooking est structuré de la meme manière la fonction getBookedDates. Les principales différences résident dans 3 points:
//// - actions.DELETE_BOOKING_REQUEST  (informatif pour l'utilisateur)
// - la méthode utilisée pour réalisée la requete est DELETE (GET précedemment), la requete au serveur va etre réalisé à la racine HTML
// '/api/bookings/${bookingId}' (`/api/bookings/dates/${roomId}` précedemment)
// -  actions.DELETE_BOOKING_SUCCESS,  (informatif pour l'utilisateur)