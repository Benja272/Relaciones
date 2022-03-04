const {Schema,model} = require('mongoose')

const SituationSchema = new Schema({
    title: {type: String,required: true},
    situation: {type: String,required: true},
    user: { id: { type: Schema.ObjectId, ref: 'Person'}},
    asks: [{
        _id: { type: Schema.ObjectId, ref: 'ask'}
    }]
}, {
    timestamps: true
});


module.exports =  model('Situation', SituationSchema)