import * as actions from '../constants/RoomConstants';
import { AnyAction } from 'redux'
import { IRoom } from '../../interfaces/IRoom';

const initialState: { rooms: IRoom[] } = {
    rooms: [],
};

export const roomsFetchReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case actions.FETCH_ROOMS_REQUEST:
            return {
                loading: true
            };
        case actions.FETCH_ROOMS_SUCCESS:
            return {
                loading: false,
                rooms: action.payload.rooms,
                count: action.payload.count
            };
        case actions.FETCH_ROOMS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export const roomDetailsReducer = (state = { room: {} }, action: AnyAction) => {
    switch (action.type) {
        case actions.ROOM_DETAILS_REQUEST:
            return {
                loading: true
            };
        case actions.ROOM_DETAILS_SUCCESS:
            return {
                loading: false,
                room: action.payload
            };
        case actions.ROOM_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export const roomCreateReviewReducer = (state = {}, action: AnyAction) => {
    switch (action.type) {
        case actions.ROOM_CREATE_REVIEW_REQUEST:
            return {
                loading: true
            };
        case actions.ROOM_CREATE_REVIEW_SUCCESS:
            return {
                loading: false,
                success: true
            };
        case actions.ROOM_CREATE_REVIEW_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export const roomCreateReducer = (state = {}, action: AnyAction) => {
    switch (action.type) {
        case actions.CREATE_ROOM_REQUEST:
            return {
                loading: true
            };
        case actions.CREATE_ROOM_SUCCESS:
            return {
                loading: false,
                success: true
            };
        case actions.CREATE_ROOM_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case actions.CREATE_ROOM_RESET:
            return {}
        default:
            return state;
    }
}

export const roomUpdateReducer = (state = {}, action: AnyAction) => {
    switch (action.type) {
        case actions.UPDATE_ROOM_REQUEST:
            return {
                loading: true
            };
        case actions.UPDATE_ROOM_SUCCESS:
            return {
                loading: false,
                success: true
            };
        case actions.UPDATE_ROOM_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case actions.UPDATE_ROOM_RESET:
            return {}
        default:
            return state;
    }
}

export const roomDeleteReducer = (state = {}, action: AnyAction) => {
    switch (action.type) {
        case actions.DELETE_ROOM_REQUEST:
            return {
                loading: true
            };
        case actions.DELETE_ROOM_SUCCESS:
            return {
                loading: false,
                success: true
            };
        case actions.DELETE_ROOM_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case actions.DELETE_ROOM_RESET:
            return {}
        default:
            return state;
    }
}

//Commentaires
//La feuilles de code param??tre et d??finit plusieurs sc??nariis pour son reducer. Les fonctions prennent pour entr??e
//une objet vide, un array d'objet room de type IRoom vide, un objet room vide. Suivant le type d'action (2??me param??tre),
//un sc??narii est activ??, pr??cisant les valeurs que doivent prendre les variables et param??tre. Le payload est d??fini
//lors de l'appel du reducer et de son scenarii.