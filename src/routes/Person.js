const { Router } = require('express');
const Situation = require("../models/situation")
const Asks = require("../models/asks")
const User = require("../models/person")
const {helpers} = require("../services/auth")

const router = Router();

//situations controllers

const createNewSituation = (req,res) => {
    res.render('situations/newSituation')
}

const reciveNewSituation = async (req,res) => {
    const {title, situation} = req.body;
    const newSit = new Situation({title: title, situation: situation});
    const _id = newSit._id 
    const user = await User.findByIdAndUpdate(req.user.id, {
        $addToSet:{
            "situations": {_id}
        }
    })
    newSit.user.id = user._id
    try {
        await newSit.save()
    }catch(err){
        console.log(err)
    }
    req.flash("success_msg", "Situacion Recibida")
    console.log(newSit);
    res.redirect('/sit')
}

const renderSituations = async (req,res) => {
    const situations = await Situation.find({'user.id': req.user.id}).lean()
    console.log(situations)
    res.render('situations/allSituations', {situations})
}

const deleteSit = async (req,res) => {
    await Situation.findByIdAndDelete(req.params.id )
    req.flash("success_msg", "Situacion Eliminada")
    res.redirect('/sit')
} 

const renderEditSitForm = async (req, res) => {
    const sit = await Situation.findById(req.params.id).lean();
    res.render("situations/editSituation", { sit });
};

const updateSit = async (req, res) => {
    const { situation } = req.body;
    await Situation.findByIdAndUpdate(req.params.id, { situation });
    req.flash("success_msg", "Note Updated Successfully");
    res.redirect("/sit");
};
//Ask Controllers

const editAsk = async (req,res) => {
    const {answer} = req.body
    await Asks.findOneAndUpdate(req.params.id, {answer: answer}) 
    req.flash("success_msg", "Respuesta Modificada Correctamente")
    res.redirect('back');
}

const renderAsks = async (req,res) => {
    const asks = await Asks.find({'situation.id': req.params.id}).lean()
    param = { asks }
    if(req.user.email == process.env.EMAIL_SU){
        sitId = req.params.id
        param = { asks, sitId}
    }
    res.render('asks/allAsks', param)  
}

const deleteAsk = async (req,res) => {
    await Asks.findByIdAndDelete(req.params.id )
    req.flash("success_msg", "Situacion Eliminada")
    res.redirect('/asks')
} 


//situations router
//New Situations
router.get('/sit/add', helpers.isAuth, createNewSituation)
router.post('/sit/addNewSit', helpers.isAuth, reciveNewSituation)
//all sit
router.get('/sit', helpers.isAuth,renderSituations)

//Delete Situation
router.delete('/sit/delete/:id', helpers.isAuth ,helpers.validUserSit,deleteSit)

//Edit Situation
router.get('/sit/edit/:id', helpers.isAuth ,helpers.validUserSit, renderEditSitForm)
router.put('/sit/updateSit/:id', helpers.isAuth ,helpers.validUserSit, updateSit)

//asks
//New asks

//Situation asks
router.get("/sit/:id", helpers.isAuth, helpers.validUserAsk,renderAsks)

//edit
router.get('/asks/edit/:id', helpers.isAuth, helpers.validUserAsk,renderSituations)
router.put('/asks/updateAsk/:id', helpers.isAuth, helpers.validEditAsk,editAsk)

//delete
router.delete('/asks/delete/:id', helpers.isAuth, helpers.validUserAsk,deleteAsk)


module.exports = {router, renderAsks};