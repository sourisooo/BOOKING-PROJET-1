import * as actions from '../constants/BookingConstants';
import { AnyAction } from 'redux'

export const roomBookingCheckReducer = (state = {}, action: AnyAction) => {

    switch (action.type) {
        case actions.CHECK_ROOM_BOOKING_REQUEST:
            return {
                loading: true,
            };
        case actions.CHECK_ROOM_BOOKING_SUCCESS:
            return {
                loading: false,
                success: true
            };
        case actions.CHECK_ROOM_BOOKING_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case actions.CHECK_ROOM_BOOKING_RESET:
            return {}
        default:
            return state;
    }

}

export const bookingCreateReducer = (state = {}, action: AnyAction) => {

    switch (action.type) {
        case actions.CREATE_BOOKING_REQUEST:
            return {
                loading: true,
            };
        case actions.CREATE_BOOKING_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case actions.CREATE_BOOKING_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case actions.CREATE_BOOKING_RESET:
            return {}
        default:
            return state;
    }

}

export const bookedDatesReducer = (state = {}, action: AnyAction) => {

    switch (action.type) {
        case actions.GET_BOOKED_DATES_REQUEST:
            return {
                loading: true,
            };
        case actions.GET_BOOKED_DATES_SUCCESS:
            return {
                loading: false,
                bookedDates: action.payload
            };
        case actions.GET_BOOKED_DATES_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }

}

export const BookingsMyReducer = (state = {}, action: AnyAction) => {

    switch (action.type) {
        case actions.GET_MY_BOOKINGS_REQUEST:
            return {
                loading: true,
            };
        case actions.GET_MY_BOOKINGS_SUCCESS:
            return {
                loading: false,
                myBookings: action.payload
            };
        case actions.GET_MY_BOOKINGS_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }

}

export const bookingsFetchReducer = (state = {}, action: AnyAction) => {

    switch (action.type) {
        case actions.FETCH_BOOKINGS_REQUEST:
            return {
                loading: true,
            };
        case actions.FETCH_BOOKINGS_SUCCESS:
            return {
                loading: false,
                bookings: action.payload.bookings,
                page: action.payload.page,
                pages: action.payload.pages,
                count: action.payload.count
            };
        case actions.FETCH_BOOKINGS_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }

}

export const bookingDeleteReducer = (state = {}, action: AnyAction) => {

    switch (action.type) {
        case actions.DELETE_BOOKING_REQUEST:
            return {
                loading: true,
            };
        case actions.DELETE_BOOKING_SUCCESS:
            return {
                loading: false,
                success: true
            };
        case actions.DELETE_BOOKING_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }

}

//Commentaires
//La feuille de code d??finit plusieurs scenaris pour son reducer booking. Chaque sc??nariis prend en entr??e
//une variable//un objet et une action ou payload. Chaque sc??narii pr??voit une configuration sp??cifique
//des param??tres de l'objet pris en entr??e de fonction. Cette feuille de code utilise la version
//classique de redux contraitement au projet reactbooking utilisant reduxkittool dans lequel une sp??cification
//de l'objet et de ses param??tres est r??alis??e lors de la cr??ation de la slice. De cette diff??rence, l'objet et ses
//param??tres devront etre d??finis lors de l'appels de fonction.