
const express = require('express')
const router = express.Router()
const variable = require('../variables/Variables')

const ContactModel = require('../modele/contact.model')
const SMSModel = require('../modele/SMS.model')
const Contact = ContactModel.Contact
const SMS = SMSModel.SMS
const sequelize = ContactModel.sequelize


let nbcontact
let nbsms
let iduser


router.post('/', async (req, res, next)=>{
    // on recupere le corps de la requete post
    iduser = req.body.iduser
    console.log('req.body :', req.body)
 
    nbcontact = 0
    nbsms = 0
    const resp = await sequelize.sync().then(()=>{
        Contact.findAll({
            where: {
                iduser: iduser
            }
        }).then((result)=>{
            console.log('Voici tous les contacts :', res)
            if(result != null){
                nbcontact = result.length
            }

            SMS.findAll({
                where: {
                    iduser: iduser
                }
            }).then((result1)=>{
                console.log('Voici tous les messages :', res)
                if(result1 != null){
                    nbsms = result1.length
                }

                console.log('Nombre de contacts :', nbcontact, ', Nombre de messages :', nbsms)
                //on renvoi le resultat
                res.send({'iduser': iduser, 'nbcontact': nbcontact, 'nbsms': nbsms})
            }).catch((error)=>{
                console.error("Echec de recherche des Messages", error)
            })

        }).catch((error)=>{
            console.error("Echec de recherche des Messages", error)
        })
    
    }).catch((error)=>{
        console.error('Impossible d\'acceder a la table Contact')
    })

})

module.exports = router