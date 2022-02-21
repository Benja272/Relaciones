const {Schema,model} = require('mongoose')

const askSchema = new Schema({
    ask: {type: String,required: true},
    answer: String, 
    user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports =  model('ask', askSchema)