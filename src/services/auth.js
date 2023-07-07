const mongoose = require("mongoose")
const Situation = require("../models/situation")
const Ask = require("../models/asks")

const helpers = {}
helpers.isAuth = (req, res, next) => {
    if (req.isAuthenticated()){
        return next()
    }
    req.flash("error_msg", "Not Authorized.");
    res.redirect('/signIn')
}

helpers.isAuthSU = (req, res, next) => {
    if (req.isAuthenticated()){
        if(req.user.email == process.env.EMAIL_SU){
            return next()
        }
    }
    req.flash("error_msg", "Not Authorized.");
    res.redirect('/signIn')
}

helpers.validUserSit = async (req, res, next) => {
    const sit = await Situation.findById(req.params.id).lean();
    if (sit.user != req.user.id && req.user.email != process.env.EMAIL_SU ) {
        req.flash("error_msg", "Is not your Situation");
        return res.redirect("/sit");
    }
    return next()
}

helpers.validUserAsk = async (req, res, next) => {
    const asks = await Ask.find({situationId: req.params.id}).lean();
    if(req.user.email == process.env.EMAIL_SU){
        return next()
    }
    if(!asks.length){
        console.log(req.user.email, req.params.id)
        console.log(asks)
        req.flash("success_msg", "Todavia no te han preguntado nada al respecto.");
        return res.redirect("/sit");
    }else if (asks[0].user != req.user.id) {
        console.log(asks, "ask_user: ",asks.user, "aUser: ", req.user.id)
        req.flash("error_msg", "Is not your Asks");
        return res.redirect("/sit");
    }
    return next()
}

helpers.validEditAsk = async (req, res, next) => {
    const valid = await findUserAsk(req.user.id,req.params.id)
    console.log(valid)
    if(!valid){
        req.flash("error_msg", "Is not your Asks");
        return res.redirect("/sit");
    }
    return next()
}

const findUserAsk = async (userId, askId) => {
    var res = false
    const query = await Situation.find({"user.id": mongoose.Types.ObjectId(userId), "asks": {
        $elemMatch: {_id:{$eq:mongoose.Types.ObjectId(askId)}}
    }})
    console.log(query)
    if(query != []){
        res = true
    }
    return res
}


module.exports = {helpers}