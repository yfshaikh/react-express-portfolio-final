import mongoose from 'mongoose'
const { Schema, model } = mongoose

const TimelineSchema = new Schema({
    title:String,
    subtitle:String,
    description:String,
    startDate:String,
    endDate:String

})

const TimelineModel = model('Timeline', TimelineSchema);

export default TimelineModel