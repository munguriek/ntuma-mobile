const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
    market_image: String,
    market_name: String,
    market_location: String

})

marketSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

marketSchema.set('toJSON', {virtuals:true});


exports.Market = mongoose.model('Market', marketSchema);
