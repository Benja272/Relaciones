const {Schema,model} = require('mongoose')

const askSchema = new Schema({
    ask: {type: String,required: true},
    answer: String, 
    situation: {
        id: { type: Schema.ObjectId, ref: 'Situation' }
    }
}, {
    timestamps: true
});


module.exports =  model('ask', askSchema)