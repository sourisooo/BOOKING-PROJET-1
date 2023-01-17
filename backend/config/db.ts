import mongoose from 'mongoose';
import { ConnectionOptions } from 'tls';
// const initDatabase = require('initDatabase');

const connectDB = async () => {
    try {

        // mongoose.connection.once('open', () => {
        //     initDatabase();
        //   });


        const connect = await mongoose.connect('mongodb+srv://netninja:test1234@cluster0.dr9enon.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectionOptions);
        console.log("Database is connected");
    } catch (error: any) {
        console.log(error.message);
    }
}

export default connectDB;