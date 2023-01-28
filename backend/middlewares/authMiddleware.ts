import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User, { IUserRequest } from '../models/User';

export const protect = asyncHandler (async(req: IUserRequest, res: Response, next: NextFunction) =>  {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        try {            
            token = req.headers.authorization.split(" ")[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(401);
            throw new Error("no token, no auth");
        }

    }

    if(!token) {
        res.status(401);
        throw new Error("no token, no auth");
    }

})

export const admin = (req: IUserRequest, res: Response, next: NextFunction) => {

    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("no token, no auth");
    }

}

//Commentaires
//Cette fonction est principalement utilisées lors de l'affectation des routes avec les racines HTML.
//La constante proteck stocke une fonction asynchrone prenant pour entrée une requete et une réponse.
//Une partie de la requete est récupéré pour etre vérifiée auprès de jwt (gérant les jetons) à travers
//la méthode verify. Une recherche est réalisée sur l'array d'objet user puis affecter à la valeur de la variable
//user de l'objet requete (Normalement pas plutot le réponse qui devrait recevoir l'affectation de valeur?).