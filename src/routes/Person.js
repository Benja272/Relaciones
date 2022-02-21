const { Router } = require('express');
const Situation = require("../models/situation")
const Asks = require("../models/asks")
const {helpers} = require("../services/auth")

const router = Router();

//situations controllers

const createNewSituation = (req,res) => {
    res.render('situations/newSituation')
}

const reciveNewSituation = async (req,res) => {
    const {situation} = req.body;
    const newSit = new Situation({situation: situation, user: req.user.id});
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
    const situations = await Situation.find({user: req.user.id}).lean()
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

const createNewAsk = (req,res) => {
    res.render('asks/newAsk')
}

const reciveNewAsk = async (req,res) => {
    const {answer} = req.body;
    const newAsk = new Asks({ask:"que te gusta?",answer: answer, user: req.user.id});
    await newAsk.save()
    req.flash("success_msg", "Respuesta Recibida")
    console.log(newAsk);
    res.redirect('/asks')
}

const editAsk = async (req,res) => {
    const {answer} = req.body
    await Asks.findByIdAndUpdate(req.params.id, {answer}) 
    req.flash("success_msg", "Respuesta Modificada Correctamente")
    res.redirect("/asks")
}

const renderAsks = async (req,res) => {
    const asks = await Asks.find({user: req.user.id}).lean()
    res.render('asks/allAsks',{asks})  
    console.log(asks);
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
router.delete('/sit/delete/:id', helpers.validUserSit, helpers.isAuth,deleteSit)

//Edit Situation
router.get('/sit/edit/:id', helpers.validUserSit, helpers.isAuth, renderEditSitForm)
router.put('/sit/updateSit/:id', helpers.validUserSit, helpers.isAuth, updateSit)

//asks
//New asks
router.get('/asks/add', helpers.isAuth, createNewAsk)//mostrar formulario para agregar pregunta)
router.post('/asks/addNewAsk', helpers.isAuth, reciveNewAsk)
//all sit
router.get("/asks", helpers.isAuth,renderAsks)

//edit
router.get('/asks/edit/:id', helpers.validUserAsk, helpers.isAuth,renderSituations)
router.put('/asks/updateAsk/:id', helpers.validUserAsk, helpers.isAuth,editAsk)

//delete
router.delete('/asks/delete/:id', helpers.validUserAsk, helpers.isAuth,deleteAsk)


module.exports = {router, renderAsks};