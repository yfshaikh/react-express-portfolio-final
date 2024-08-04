import mongoose from 'mongoose'
const { Schema, model } = mongoose

const TimelineSchema = new Schema({
    title:String,
    subtitle:String,
    description:String,
    startDate:Date,
    endDate:Date

})

const TimelineModel = model('Timeline', TimelineSchema);

export default TimelineModel