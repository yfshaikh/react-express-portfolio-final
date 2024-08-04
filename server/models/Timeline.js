const TimelineSchema = new Schema({
    title:String,
    subtitle:String,
    description:String,
    startDate:Date,
    endDate:Date

})

const TimelineModel = model('Timeline', TimelineSchema);

export default TimelineModel