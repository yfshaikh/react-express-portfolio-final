import mongoose from 'mongoose'
const { Schema, model } = mongoose

const ImageSchema = new Schema({
    file: mongoose.Schema.Types.ObjectId, // Reference to the file in GridFS

})


const ImageModel = model('Image', ImageSchema);


export default ImageModel;