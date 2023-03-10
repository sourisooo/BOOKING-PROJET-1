import axios from 'axios';
import { Dispatch } from 'redux';
import * as actions from '../constants/RoomConstants';
import { IRoom, ICreateReview, TCreateRoom } from '../../interfaces/IRoom';

export const fetchRooms = (keyword: string, numOfBeds: number | string, roomType: string, currentPage: number) => 
async (dispatch: Dispatch) => {
    try {
        dispatch({ type: actions.FETCH_ROOMS_REQUEST });

        const { data } = 
        await axios.get(`/api/rooms/?keyword=${keyword}&numOfBeds=${numOfBeds}&roomType=${roomType}&pageNumber=${currentPage}`);

        dispatch({ type: actions.FETCH_ROOMS_SUCCESS, payload: data });
        
    } catch (error: any) {
        dispatch({ 
            type: actions.FETCH_ROOMS_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }
}

export const getRoomDetails = (id: IRoom['_id']) => async (dispatch: Dispatch) => {

    try {
        dispatch({ type: actions.ROOM_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/rooms/${id}`);
        dispatch({ type: actions.ROOM_DETAILS_SUCCESS, payload: data });

    } catch (error: any) {
        dispatch({ 
            type: actions.ROOM_DETAILS_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const createRoomReview = (id: IRoom['_id'], review: ICreateReview) => async (dispatch: Dispatch, getState: any) => {

    try {
        dispatch({ type: actions.ROOM_CREATE_REVIEW_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                "Content-Type": "application/JSON",
                "Authorization": `Bearer ${userInfo.token}`
            }
        }

        await axios.post(`/api/rooms/${id}/reviews`, review, config);
        dispatch({ type: actions.ROOM_CREATE_REVIEW_SUCCESS });

    } catch (error: any) {
        dispatch({ 
            type: actions.ROOM_CREATE_REVIEW_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const createRoom = (roomData: TCreateRoom) => async (dispatch: Dispatch, getState: any) => {

    try {
        dispatch({ type: actions.CREATE_ROOM_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                "Content-Type": "application/JSON",
                "Authorization": `Bearer ${userInfo.token}`
            }
        }

        await axios.post(`/api/rooms`, roomData, config);
        dispatch({ type: actions.CREATE_ROOM_SUCCESS });

    } catch (error: any) {
        dispatch({ 
            type: actions.CREATE_ROOM_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const updateRoom = (roomId: IRoom['_id'], roomData: TCreateRoom) => async (dispatch: Dispatch, getState: any) => {

    try {
        
        dispatch({ type: actions.UPDATE_ROOM_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': `Bearer ${userInfo.token}`
            }
        };

        await axios.put(`/api/rooms/${roomId}`, roomData, config);
        dispatch({ type: actions.UPDATE_ROOM_SUCCESS });

    } catch (error: any) {
        dispatch({ 
            type: actions.UPDATE_ROOM_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

export const deleteRoom = (roomId: IRoom['_id']) => async (dispatch: Dispatch, getState: any) => {

    try {
        dispatch({ type: actions.DELETE_ROOM_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                "Authorization": `Bearer ${userInfo.token}`
            }
        }

        await axios.delete(`/api/rooms/${roomId}`, config);
        dispatch({ type: actions.DELETE_ROOM_SUCCESS });

    } catch (error: any) {
        dispatch({ 
            type: actions.DELETE_ROOM_FAIL, 
            payload: error.response && error.response.data.message ? 
            error.response.data.message : error.message });
    }

}

//Commentaires
//La feuille de code g??re toutes les requetes r??alis??es au serveur. 
//La variable fetchRooms stocke une fonction prenant pour entr??e plusieurs variables string et number, fonction appelant une autre
//fonction asynchrone prenant pour entr??e un dispatch/scenarii redux. Le scenarii actions.FETCH_ROOMS_REQUEST est appel?? (?? titre informatif
//pour l'utilisateur). Puis une requete est demand?? au serveur (GET) selon les param??tres d??finis en entr??e de la premi??re fonction.
//Puis le scenarii actions.FETCH_ROOMS_SUCCESS est utilis?? en utilisant le resultat de la requete pr??c??dente. Ce scenarii va modifier la valeur
//des param??tres count et rooms.
//La variable getRoomDetails est structur??e de la meme mani??re que la variable fetchRooms, exceptions faites de:
//  - param??tre d'entr??e de la premi??re fonction de type IRoom['_id']
//  - actions.ROOM_DETAILS_REQUEST pour l'information ?? l'utilisateur
//  - utilisation d'une requete GET au server ?? la racine HTML `/api/rooms/${id}` (adresse serveur)
//  - usage du scenarii redux ROOM_DETAILS_SUCCESS (absence du param??tre counter par rapport ?? la pr??c??dente fonction)
// 
//La variable createRoomReview est structur??e de la meme mani??re que la variable fetchRooms, exceptions faites de:
//  - param??tre d'entr??e de la premi??re fonction de type IRoom['_id'] et d'un objet de type ICreateReview
//  - param??tre supplem??ntaire en entr??e de la deuxi??me fonction pour acc??der ?? { userLogin: { userInfo } } par destructuration
//  - actions.ROOM_CREATE_REVIEW_REQUEST pour l'information ?? l'utilisateur
//  - utilisation d'une requete POST au server ?? la racine HTML /api/rooms/${id}/reviews (adresse serveur)
//  - usage du scenarii redux actions.ROOM_CREATE_REVIEW_SUCCESS pour l'information ?? l'utilisateur
//
//La variable createRooM est structur??e de la meme mani??re que la variable createRoomReview, exceptions faites de:
//  - param??tre d'entr??e de la premi??re fonction de type TCreateRoom
//  - actions.ROOM_CREATE_REVIEW_REQUEST pour l'information ?? l'utilisateur
//  - utilisation d'une requete POST au server ?? la racine HTML `/api/rooms` (adresse serveur)
//  - usage du scenarii redux actions.CREATE_ROOM_SUCCESS  pour l'information ?? l'utilisateur
//
//La variable updateRoom est structur??e de la meme mani??re que la variable createRoomReview, exceptions faites de:
//  - param??tre d'entr??e de la premi??re fonction de type TCreateRoom et une deuxi??me entr??e de type IRoom['_id']
//  - actions.UPDATE_ROOM_REQUEST  pour l'information ?? l'utilisateur
//  - utilisation d'une requete POST au server ?? la racine HTML `/api/rooms/${roomId}` (adresse serveur)
//  - usage du scenarii redux actions.UPDATE_ROOM_SUCCESS pour l'information ?? l'utilisateur
//
//La variable deleteRoom est structur??e de la meme mani??re que la variable createRoomReview, exceptions faites de:
//  - actions.DELETE_ROOM_REQUEST  pour l'information ?? l'utilisateur
//  - utilisation d'une requete POST au server ?? la racine HTML `/api/rooms/${roomId}` (adresse serveur)
//  - usage du scenarii redux actions.DELETE_ROOM_SUCCESS  pour l'information ?? l'utilisateur