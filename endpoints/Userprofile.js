
const express = require('express')
const router = express.Router()
const variable = require('../variables/Variables')

const UserModel = require('../modele/user.model')
const User = UserModel.User
const sequelize = UserModel.sequelize


let username
let id
let phonenumber
let emailaddress


router.post('/', async (req, res, next)=>{
    // on recupere le corps de la requete post
    phonenumber = req.body.phoneNumber
    console.log('\n', req.body)
 

    username = undefined
    //phonenumber = undefined
    
    const resp = await sequelize.sync().then(()=>{
        User.findOne({
            where: {
                phonenumber: phonenumber
            }
        }).then((result)=>{
            console.log('resultat');
            console.log(result)
            if(result != null){
                username = result.dataValues.username
                id = result.dataValues.id
                emailaddress = result.dataValues.emailaddress
            }

            if(username == undefined){
                //on retourne une erreur
                res.send({})// on renvoi une erreur
                console.log('utilisateur inexistant')
            }
            else{
                if(!req.session.user){
                    req.session.user = {
                        id: id,
                        emailaddress: emailaddress,
                        username: username
                    }
                    console.log(`Vous etes connectes, bienvenue ${req.session.user.username} !`)
                    console.log(req.session)
                }
                else{
                    console.log('vous etiez deja connectes')
                    console.log(req.session) 
                }
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