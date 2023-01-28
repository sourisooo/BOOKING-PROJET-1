import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Room from '../models/Room';
import { IUserRequest } from '../models/User';

// @Desc Get All Rooms
// @Route /api/rooms
// @Method GET
export const getAll = asyncHandler(async(req: Request, res: Response) => {

    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        $or: [
            {name: { $regex: req.query.keyword, $options: "i" }},
            {description: { $regex: req.query.keyword, $options: "i" }},
        ]
    }
    : {};


    const numOfBeds = req.query.numOfBeds ? {numOfBeds: req.query.numOfBeds} : {};

    const category = req.query.roomType ? {category: req.query.roomType} : {};



    const count = await Room.countDocuments({ ...keyword, ...numOfBeds, ...category })

    const rooms = await Room.find({ ...keyword, ...numOfBeds, ...category }).limit(pageSize)
    .skip(pageSize * (page - 1));
    res.status(201).json({
        rooms,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
})


// router.get('/', async (req, res) => {
//     const query = req.query;
//     try {
//       const rooms = await Room.find();
//       if (Object.keys(query).length > 0) {
//         const filteredRooms = await filterRooms(rooms, query);
//         return res.status(200).send(filteredRooms);
//       }
  
//       res.status(200).send(rooms);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         message: 'На сервере произошла ошибка. Попробуйте позже',
//       });
//     }
//   });






// @Desc Search rooms
// @Route /api/rooms/search/
// @Method GET
export const searchRooms = asyncHandler(async(req: Request, res: Response) => {
    const filterd = await Room.find({ $and: [ 
        { $or: [{name: req.query.keyword },{description: req.query.keyword}] }, 
        {numOfBeds: req.query.numOfBeds}, 
        {category: req.query.roomType} 
    ] });
    res.status(201).json(filterd);
})

// @Desc Get Single Room
// @Route /api/rooms/:id
// @Method GET
export const getSingle = asyncHandler(async (req: Request, res: Response) => {

    const room = await Room.findById(req.params.id);

    if(!room) {
        res.status(401);
        throw new Error("Room not found");
    }

    res.status(201).json(room);

})

// @Desc Create new room
// @Route /api/rooms
// @Method POST
export const addRoom = asyncHandler(async (req: IUserRequest, res: Response) => {

    req.body.user = req.user._id;

    const room = await Room.create(req.body);

    res.status(201).json(room);

})

// @Desc Update room
// @Route /api/rooms/:id
// @Method PUT
export const updateRoom = asyncHandler(async (req: IUserRequest, res: Response) => {

    let room = await Room.findById(req.params.id);

    if(!room) {
        res.status(401);
        throw new Error("Room not found");
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(201).json(room);

})

// @Desc Delete room
// @Route /api/rooms/:id
// @Method DELETE
export const deleteRoom = asyncHandler(async (req: IUserRequest, res: Response) => {

    let room = await Room.findById(req.params.id);

    if(!room) {
        res.status(401);
        throw new Error("Room not found");
    }

    room = await Room.findByIdAndDelete(req.params.id);

    res.status(201).json({});

})

// @Desc Create Room Review
// @Route /api/rooms/:id/reviews
// @Method POST
export const createRoomReview = asyncHandler(async (req: IUserRequest, res: Response) => {

    const room = await Room.findById(req.params.id);

    if(room) {

        const alreadyReviewd = room.reviews?.find((review: { user: { toString: () => any; }; }) => review.user.toString() === req.user._id.toString());

        if(alreadyReviewd) {
            res.status(401);
            throw new Error("Already reviewed");
        }

        const { rating, comment } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        }

        room.reviews?.push(review);

        room.numOfReviews = room.reviews?.length;

        room.ratings = room.reviews?.reduce((acc: any, item: any) => item?.rating + acc, 0) / Number(room.reviews?.length);

        await room.save();

        res.status(201).json({ message: "Review added" });

    } else {
        res.status(401);
        throw new Error("Room not found");
    }

})

//Commentaires
//La feuille de code gère toutes les requetes réaliséees au serveur sur l'adresse /api/rooms et portant sur
//l'array d'objet room. asyncHandler permet de gèrer les erreurs avec express. 
//La constante getall stocke le resultat d'une fonction asychrone. Cete fonction asyncrhone prend en entrée deux objets requetes
//et réponse. La méthode query permet de préciser la requete vers une variable/paramètre spécifique de l'objet en entrée de fonction
//asynchrone ou spécifier une nouvelle variable de l'objet de type Request implémentée Express (à vérifier).
//What is a regex in JavaScript?
//Regular expressions are patterns used to match character combinations in strings. In JavaScript, regular expressions are also objects. 
//These patterns are used with the exec() and test() methods of RegExp , and with the match() , matchAll() , replace() , replaceAll() , search() , 
//and split() methods of String . La variable keyword vérifie si le paramètre keyword est existant, si oui, une vérification est faite
//dans les paramètres name et description pour vérifier la présente de keyword dans ses 2 paramètres.
//Deux nouveux paramètres/variables sont définis: numOfBeds et category. Dans le cas, ou la requete spécifie une valeur pour cette variable, la valeur
//est récupérée, sinon la variable est affectée par une valeur vide//nulle.
//Une recherche est réalisée dans l'array d'objet room en fonction de certains paramètres de la requete puis une réponse est
//envoyée au client en envoyant l'array d'objet ainsi que ces paramètres.
//La constante searchRooms stocke le resultat d'une fonction asychrone. Cete fonction asyncrhone prend en entrée deux objets requetes
//et réponse. Une recherche est réalisé dans l'arrauy d'objet room en tenant comptes de plusieurs paramètres puis les objets trouvés sont
//envoyées en format json au client.
//Meme chose pour getSingle mais en utilisant params(accéder à un paramètre//variable existant).
//Meme chose pour addroom, deleteroom, updateroom mais en utilisant la méthode create pour créer un nouvel objet room dans l'array de type schema 
//implémentée Mongoose, findByIdAndUpdate et findByIdAndDelete précisant que les deux dernière une recherche est réalisée pour vérifier l'existence
//de l'objet.
//La constante createRoomReview stocke le resultat d'une fonction asychrone. Cete fonction asyncrhone prend en entrée deux objets requetes
//et réponse. Une recherche est réalisé dans l'array d'objet room en tenant comptes de plusieurs paramètres. Une recherche est faite sur l'objet
//room trouvé pour rechercher les reviews en tenant compte de le user_id de l'objet requete. Les paramètres/variables de la requetes sont 
// insérée à l'intérieur de la variable review. Puis l'objet review est inséré dans la collection d'objet review puis un message de validation
//est envoyée au client.