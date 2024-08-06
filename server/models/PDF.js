import mongoose from 'mongoose'
const { Schema, model } = mongoose

const PDFSchema = new Schema({
    title:String,
    file: mongoose.Schema.Types.ObjectId, // Reference to the file in GridFS
}, {
    timestamps: true
})


const PDFModel = model('PDF', PDFSchema);


export default PDFModel;