import mongoose from 'mongoose'
const { Schema, model } = mongoose

const PostSchema = new Schema({
    title:String,
    content:String,
    file: mongoose.Schema.Types.ObjectId // Reference to the file in GridFS
}, {
    timestamps: true
})

const PostModel = model('Post', PostSchema);

export default PostModel;
