
const mongoose= require('mongoose');


const tokenSchema = mongoose.Schema({
    _clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Client' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
});


module.exports=mongoose.model("Token",tokenSchema)