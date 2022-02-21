const Situation = require("../models/situation")
const Ask = require("../models/situation")

const helpers = {}
helpers.isAuth = (req, res, next) => {
    if (req.isAuthenticated()){
        return next()
    }
    req.flash("error_msg", "Not Authorized.");
    res.redirect('/signIn')
}

helpers.validUserSit = async (req, res, next) => {
    const sit = await Situation.findById(req.params.id).lean();
    if (sit.user != req.user.id) {
        req.flash("error_msg", "Is not your Situation");
        return res.redirect("/sit");
    }
    return next()
}

helpers.validUserAsk = async (req, res, next) => {
    const sit = await Situation.findById(req.params.id).lean();
    if (sit.user != req.user.id) {
        req.flash("error_msg", "Is not your Ask");
        return res.redirect("/sit");
    }
    return next()
}


module.exports = {helpers}