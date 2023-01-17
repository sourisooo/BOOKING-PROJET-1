import mongoose from 'mongoose';
const { Schema, model } = require('mongoose');

interface IReviews {   
    user: string,
    name: string,
    rating: number,
    comment: string
}

interface IImage {
    image: string
}

export interface IRoom extends mongoose.Document {
    name: string
    description: string,
    images: IImage[],
    pricePerNight: Number,
    address: string,
    guestCapacity: Number,
    numOfBeds: Number,
    internet: Boolean,
    airConditioned: Boolean,
    petsAllowed: Boolean,
    roomCleaning: Boolean,
    ratings?: Number,
    numOfReviews?: Number,
    category: 'King' | 'Single' | 'Twins',
    reviews?: IReviews[],
    user: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

const RoomSchema = new mongoose.Schema({

    name: {
        type: String,
  
    },

    description: {
        type: String,
     
    },

    images: [
        {
            image: String
        }
    ],

    pricePerNight: {
        type: Number,
    
    },

    address: {
        type: String,
      
    },

    guestCapacity: {
        type: Number,
   
    },

    numOfBeds: {
        type: Number,
  
    },

    internet: {
        type: Boolean,
        default: false,
    },

    breakfast: {
        type: Boolean,
        default: false,
    },

    airConditioned: {
        type: Boolean,
        default: false,
    },

    petsAllowed: {
        type: Boolean,
        default: false
    },

    roomCleaning: {
        type: Boolean,
        default: false
    },

    ratings: {
        type: Number,
        default: 0
    },

    numOfReviews: {
        type: Number,
        default: 0
    },

    category: {
        type: String,
    
        enum: ['King', 'Single', 'Twins']
    },

    reviews: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
              
            },
            name: {
                type: String,
             
            },
            rating: {
                type: Number,
           
            },
            comment: {
                type: String,
           
            }
        }
    ],

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    
    },

}, {
    timestamps: true
});

const Room = mongoose.model("convrooms", RoomSchema);

export default Room;