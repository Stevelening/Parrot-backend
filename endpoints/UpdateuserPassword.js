
const express = require('express')
const router = express.Router()
const variable = require('../variables/Variables')

const UserModel = require('../modele/user.model')
const e = require('express')
const md5 = require('md5')
const User = UserModel.User
const sequelize = UserModel.sequelize

let username
let id
let phonenumber
let emailaddress
let password

let newusername
let newemailaddress
let newphonenumber
let newpassword

async function checkUser(id) {



}

router.post('/', async (req, res, next)=>{
    // on recupere le corps de la requete post
    id = req.body.id
    newusername = req.body.userName
    newemailaddress = req.body.emailAddress
    newphonenumber = req.body.phoneNumber
    newpassword = req.body.newPassword

    console.log('\n', req.body)
    console.log('req.session:', req.session)
 
    const resp = await sequelize.sync().then(()=>{
        User.findOne({
            where: {
                id: id
            }
        }).then((result)=>{
            console.log(result)
            if(result != null){
                emailaddress = result.dataValues.emailaddress
                password = result.dataValues.password
                // on met a jour ses donnees dans la table user
                
                password = newpassword

                console.log('new password :', password)
                
                // mise a jour de la BD
                User.update(
                    {
                        password: md5(password),
                        
                    },
                    {
                        where: { id: id }
                    }
                ).then((result1)=>{
                    console.log('UPDATE:', result1)

                    console.log('req.session:', req.session)
                    if(password == undefined ){
                        //on retourne une erreur
                        res.send({})// on renvoi une erreur
                        console.log('utilisateur inexistant')
                    }
                    else{
                        // on met a jour la session
                        req.session.user = {
                            id: id,
                            emailaddress: emailaddress,
                            username: username
                        }
                        console.log(`La session a ete mise a jour, bienvenue ${req.session.user.username} !`)
                        console.log(req.session)

                        //on renvoi le resultat (on ne lui envoi pas le password)

                        res.send({'id': id, 'username': username, 'phonenumber': phonenumber,'emailaddress': emailaddress})
                    }
                })
                
            }
            else {
                res.send({})
            }
        }).catch((error)=>{
            console.error("Echec de recherche des utilisateurs", error)
        })
    
    }).catch((error)=>{
        console.error('Impossible de creer cette table')
    })

})

module.exports = router