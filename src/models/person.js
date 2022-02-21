const {Schema,model} = require('mongoose')
const bcript = require('bcryptjs')

const PersonSchema = new Schema({
    Name:{
        type: String,
        required: true
    },
    email:{type: String, required:true},
    password:{type: String, required:true},
    asks: {
        id: { type: Schema.ObjectId, ref: 'ask' }
    },
}, {
    timestamps: true //fecha de actualizacion y creacion automatica
})

PersonSchema.methods.encrypPass = async function(password) {
    const salt = await bcript.genSalt(10);
    return await bcript.hash(password,salt);
}

PersonSchema.methods.matchPass = async function (password) {  
    return await bcript.compare(password, this.password);
}

module.exports =  model('Person', PersonSchema)