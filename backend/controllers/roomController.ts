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

        // const alreadyReviewd = room.reviews?.find((review: { user: { toString: () => any; }; }) => review.user.toString() === req.user._id.toString());

        // if(alreadyReviewd) {
        //     res.status(401);
        //     throw new Error("Already reviewed");
        // }

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

//   router.post('/', auth, async (req, res) => {
//     try {
//       const newReview = await Review.create({
//         ...req.body,
//         userId: req.user._id,
//       });
//       res.status(201).send(newReview);
//     } catch (error) {
//       res.status(500).json({
//         message: 'На сервере произошла ошибка. Попробуйте позже',
//       });
//     }
//   });





// router.get('/', async (req, res) => {
//     try {
//       const { orderBy, equalTo } = req.query;
//       const reviews = await Review.find({ [orderBy]: equalTo });
//       res.status(200).send(reviews);
//     } catch (error) {
//       res.status(500).json({
//         message: 'На сервере произошла ошибка. Попробуйте позже',
//       });
//     }
//   });
  

  
//   router.patch('/:reviewId', auth, async (req, res) => {
//     try {
//       const { reviewId } = req.params;
//       const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });
//       res.send(updatedReview);
//     } catch (error) {
//       res.status(500).json({
//         message: 'На сервере произошла ошибка. Попробуйте позже',
//       });
//     }
//   });
  
//   router.delete('/:reviewId', auth, async (req, res) => {
//     try {
//       const { reviewId } = req.params;
//       const removedReview = await Review.findById(reviewId);
//       if (removedReview.userId.toString() === req.user._id || req.userRole === 'admin') {
//         await removedReview.remove();
//         return res.send(null);
//       } else {
//         res.status(401).json({
//           message: 'Unauthorized',
//         });
//       }
//     } catch (error) {
//       res.status(500).json({
//         message: 'На сервере произошла ошибка. Попробуйте позже',
//       });
//     }
//   });
  
//   module.exports = router;