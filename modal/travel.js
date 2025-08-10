import mongoose from 'mongoose';

const travelSchema = new mongoose.Schema({
    userToken: {
        type: String,
        default: null,
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    driverReview: {
        type: Number,
    },


})

const travelSchemaSave = mongoose.model.travelSchema || mongoose.model('travelSchemasave', travelSchema)

export default travelSchemaSave;