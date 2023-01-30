import React, { useState, useEffect } from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';

export const useAuthStatus = () => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const { userInfo } = useSelector((state: RootStateOrAny) => state.userLogin);

    useEffect(() => {
        if (userInfo) {
        setLoggedIn(true)
        } else {
        setLoggedIn(false)
        }
        setCheckingStatus(false)
    }, [userInfo])

    return { loggedIn, checkingStatus }

}

//Commentaires
//La fonction useAuthStatus définit deux paramètres useState et un objet userInfo qui prend
//l'information issue de state.userLogin étant précisé que state un reducer.
//La fonctionnalité useEffet incrémente les valeurs de loggedIn et checkingStatus à chaque fois
//que la variable userInfo est modifiée.
//La fonction useAuthStatus retourne la valeur des variables loggedIn et checkingStatus.