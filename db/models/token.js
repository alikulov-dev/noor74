
const mongoose= require('mongoose');

const tokenSchema = new mongoose.Schema({
    _clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 30 } }
});
tokenSchema.index({ email: 1 }, { expireAfterSeconds: 30 }); 

module.exports=mongoose.model("Token",tokenSchema)
