
const express = require('express')
const router = express.Router()
const variable = require('../variables/Variables')
const md5 = require("md5")

const UserModel = require('../modele/user.model')
const User = UserModel.User
const sequelize = UserModel.sequelize

const codeController = require('../controllers/code.controller')
const createCode = codeController.CreateCode

let code = undefined

const sendEmail = require('./sendemail')


let username
let password
let id
let phonenumber
let emailaddress


let Random = (min, max) =>{
    // retouren un nombre aleatoire entre min et max
    let code = ''
    for(let i=0;i<4;i++){
        code += (Math.floor(Math.random() * (max - min)) + min).toString()
    }
    return code 
}

router.post('/', async (req, res, next)=>{
    // on recupere le corps de la requete post
    phonenumber = req.body.phoneNumber
    console.log('\n', req.body)

    console.log('phonenumber :', phonenumber)

    
    id = undefined
    username = undefined

    const resp = await sequelize.sync().then(()=>{
        console.log('Table user cree avec succes')
        // Selectionner un utilisateur en particulier avec son username et password
        User.findOne({
            where: {
                phonenumber: phonenumber
            }
        }).then((result)=>{
            console.log(result)
            if(result != null){
                id = result.dataValues.id
                username = result.dataValues.username
                password = result.dataValues.password
                emailaddress = result.dataValues.emailaddress
                console.log('elements crees')
            }

            if(id == undefined || username == undefined){
                //on retourne une erreur
                res.send({})// on renvoi une erreur
                console.log('utilisateur inexistant')
            }
            else{
                code = Random(1, 10)//on genere le code a 04 chiffres
                console.log('code genere :', code)
                // on ajoute le code a la session
                req.session.user = {
                    id: id,
                    emailaddress: emailaddress,
                    username: username,
                    code: code
                }
                console.log(req.session)
                console.log('l\'id de la session est :', req.sessionID)
                // on lui envoi le code par email
                sendEmail(emailaddress, code)
                // on patiente un peu
                setTimeout(()=>{console.log('envoi de mail en cours ...')}, 4000)
                // on enregistre le code dans la BD
                createCode(code)
                // on patiente un peu
                setTimeout(()=>{console.log('enregistrement du code en cours ...')}, 100)
                //on renvoi le resultat (on ne lui envoi pas le password)
                res.send({'id': id, 'username': username, 'phonenumber': phonenumber,'emailaddress': emailaddress})
            }
        }).catch((error)=>{
            console.error("Echec de recherche des utilisateurs", error)
        })
    
    }).catch((error)=>{
        console.error('Impossible de creer cette table')
    })

})

module.exports = router