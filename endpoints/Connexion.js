
const express = require('express')
const router = express.Router()
const variable = require('../variables/Variables')
const md5 = require("md5")

const UserModel = require('../modele/user.model')
const User = UserModel.User
const sequelize = UserModel.sequelize

// // on teste la connexion a la base de donnees
sequelize.authenticate()
    .then(()=>{
        console.log('Connection a la BD reussie')
    })
    .catch((error)=>{
        console.error('Impossible d\'etablir la connexion')
    })

let username
let password
let id
let phonenumber
let emailaddress


router.post('/', async (req, res, next)=>{
    // on recupere le corps de la requete post
    username = req.body.username
    password = req.body.password
    console.log('\n', req.body)
 
    // on verifie si cet utilisateur existe dans la BD (on hache le mot de passe)
    //checkUser(username, md5(password),req, res)

    id = undefined
    phonenumber = undefined

    const resp = await sequelize.sync().then(()=>{
        console.log('Table user cree avec succes')
        // Selectionner un utilisateur en particulier avec son username et password
        User.findOne({
            where: {
                username: username,
                password: md5(password)
            }
        }).then((result)=>{
            console.log(result)
            if(result != null){
                id = result.dataValues.id
                phonenumber = result.dataValues.phonenumber
                emailaddress = result.dataValues.emailaddress
            }

            if(id == undefined || phonenumber == undefined){
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
                    // req.session.sessionid = id.toString(10)+phonenumber.toString(10);
                    // req.session.userid = id
                    // req.session.username = username
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