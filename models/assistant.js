const mongoose = require('mongoose');

const assistantSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    gender:{
        type:String
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    
    isAssistant: {
        type: Boolean,
        default: true,
    },
    address: {
        type: String,
        default: ''
    },
    market: {
        type: String,
        default: ''
    },
    profilePic:{
        type: String,
        default:''
    },
    refNumber:{
        type:String,
    }

});

assistantSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

assistantSchema.set('toJSON', {
    virtuals: true,
});

exports.Assistant = mongoose.model('Assistant', assistantSchema);
exports.assistantSchema = assistantSchema;