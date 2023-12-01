const pool = require("../db");
const util = require('util');
const queryAsync = util.promisify(pool.query).bind(pool);
const { authenticateToken } = require("../middleware/authMiddleware.js");

module.exports = (app) => {
    //Endpoint /user obtiene la informacion del usuario
    app.post('/user', authenticateToken,async (req, res) => {
        try{
            const query1=`SELECT nombre, apellido, peso, estatura, edad, imagen_usuario, genero FROM usuario U WHERE U.correo=$1`;
            const values=[req.body.correo];
            const result=await queryAsync(query1, values);
            if (result.rows.length===0){
                res.json({ status: 0, mensaje: "El usuario " + req.body.correo + " no existe" , resultado:false});
            }else{
                
                res.json({ status: 0, mensaje: "Datos encontrados", resultado:true, nombre:result.rows[0].nombre , apellido:result.rows[0].apellido, 
                            peso:result.rows[0].peso, estatura:result.rows[0].estatura, edad:result.rows[0].edad, imagen_usuario: result.rows[0].imagen_usuario, genero:result.rows[0].genero});
                
            }
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
        
    });

    //Endpoint /ActualizarUser actualiza la informacion del usuario
    app.post('/ActualizarUser', async (req, res) => {
        try{
            const query1=`UPDATE usuario SET correo=$1, peso =$2, estatura = $3, imagen_usuario = $4  WHERE correo = $5`;
            const values=[req.body.newCorreo , req.body.newPeso, req.body.newEstatura, req.body.newImagen ,req.body.oldCorreo];
            const result=await queryAsync(query1, values);            

                res.json({ status: 0, mensaje: "Datos Actualizados Exitosamente!", resultado:true});
                
            
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
        
    });



}