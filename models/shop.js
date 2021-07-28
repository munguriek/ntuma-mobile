const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },    
    price: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

shopSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

shopSchema.set('toJSON', { virtuals: true });

exports.Shop = mongoose.model('Shop', shopSchema);
