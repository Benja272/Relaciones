const { Router } = require('express');
const Situation = require("../models/situation")
const Asks = require("../models/asks")
const User = require("../models/person")
const {helpers} = require("../services/auth")

const router = Router();

//controllers
const createNewAsk = async (req,res) => {
    sit = await Situation.findById(req.params.id).lean()
    console.log(sit)
    res.render('asks/newAsk', {sit})
}

const reciveNewAsk = async (req,res) => {
    const {ask} = req.body;
    const newAsk = new Asks({ask:ask});
    const _id = newAsk._id
    console.log(newAsk)
    const sit = await Situation.findByIdAndUpdate(req.params.id, {
        $addToSet: {
            "asks": {_id}
        }
    })
    newAsk.situation.id = sit._id
    try {
        await newAsk.save()
    }catch(err){
        console.log(err)
    }
    req.flash("success_msg", "Pregunta enviada")
    console.log(newAsk);
    res.redirect('/sit')
}

const renderSits = async (req, res) => {
    const sits = await User.aggregate([
        { $lookup:
            {
            from: 'situations',
            localField: '_id',
            foreignField: 'user',
            as: 'userSits'
            }
        }
      ]);
    console.log(sits)
    res.render("situations/SUsituations", {sits})
}

router.post('/asks/addNewAsk/:id', helpers.isAuth, reciveNewAsk)

router.get('/asks/add/:id', helpers.isAuthSU, createNewAsk)

router.get('/SITS', helpers.isAuthSU, renderSits)
module.exports =  router;