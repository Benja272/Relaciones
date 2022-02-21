const {Schema,model} = require('mongoose')

const SituationSchema = new Schema({
    situation: {type: String,required: true},
    user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports =  model('Situation', SituationSchema)