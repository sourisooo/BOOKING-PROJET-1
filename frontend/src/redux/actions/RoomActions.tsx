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
//La feuille de code gère toutes les requetes réalisées au serveur. 
//La variable fetchRooms stocke une fonction prenant pour entrée plusieurs variables string et number, fonction appelant une autre
//fonction asynchrone prenant pour entrée un dispatch/scenarii redux. Le scenarii actions.FETCH_ROOMS_REQUEST est appelé (à titre informatif
//pour l'utilisateur). Puis une requete est demandé au serveur (GET) selon les paramètres définis en entrée de la première fonction.
//Puis le scenarii actions.FETCH_ROOMS_SUCCESS est utilisé en utilisant le resultat de la requete précédente. Ce scenarii va modifier la valeur
//des paramètres count et rooms.
//La variable getRoomDetails est structurée de la meme manière que la variable fetchRooms, exceptions faites de:
//  - paramètre d'entrée de la première fonction de type IRoom['_id']
//  - actions.ROOM_DETAILS_REQUEST pour l'information à l'utilisateur
//  - utilisation d'une requete GET au server à la racine HTML `/api/rooms/${id}` (adresse serveur)
//  - usage du scenarii redux ROOM_DETAILS_SUCCESS (absence du paramètre counter par rapport à la précédente fonction)
// 
//La variable createRoomReview est structurée de la meme manière que la variable fetchRooms, exceptions faites de:
//  - paramètre d'entrée de la première fonction de type IRoom['_id'] et d'un objet de type ICreateReview
//  - paramètre suppleméntaire en entrée de la deuxième fonction pour accéder à { userLogin: { userInfo } } par destructuration
//  - actions.ROOM_CREATE_REVIEW_REQUEST pour l'information à l'utilisateur
//  - utilisation d'une requete POST au server à la racine HTML /api/rooms/${id}/reviews (adresse serveur)
//  - usage du scenarii redux actions.ROOM_CREATE_REVIEW_SUCCESS pour l'information à l'utilisateur
//
//La variable createRooM est structurée de la meme manière que la variable createRoomReview, exceptions faites de:
//  - paramètre d'entrée de la première fonction de type TCreateRoom
//  - actions.ROOM_CREATE_REVIEW_REQUEST pour l'information à l'utilisateur
//  - utilisation d'une requete POST au server à la racine HTML `/api/rooms` (adresse serveur)
//  - usage du scenarii redux actions.CREATE_ROOM_SUCCESS  pour l'information à l'utilisateur
//
//La variable updateRoom est structurée de la meme manière que la variable createRoomReview, exceptions faites de:
//  - paramètre d'entrée de la première fonction de type TCreateRoom et une deuxième entrée de type IRoom['_id']
//  - actions.UPDATE_ROOM_REQUEST  pour l'information à l'utilisateur
//  - utilisation d'une requete POST au server à la racine HTML `/api/rooms/${roomId}` (adresse serveur)
//  - usage du scenarii redux actions.UPDATE_ROOM_SUCCESS pour l'information à l'utilisateur
//
//La variable deleteRoom est structurée de la meme manière que la variable createRoomReview, exceptions faites de:
//  - actions.DELETE_ROOM_REQUEST  pour l'information à l'utilisateur
//  - utilisation d'une requete POST au server à la racine HTML `/api/rooms/${roomId}` (adresse serveur)
//  - usage du scenarii redux actions.DELETE_ROOM_SUCCESS  pour l'information à l'utilisateur