// Import required modules
const pool = require("../db");
const util = require('util');
const queryAsync = util.promisify(pool.query).bind(pool);
const select = require("./sql/SQuerys.js");
const { authenticateToken } = require("../middleware/authMiddleware.js");

module.exports = (app) => {

    app.post('/dayProgress',authenticateToken ,async (req, res) => {
        try{
            const correo=req.body.correo;
            const dia=req.body.dia;
            let day;
            
            switch(dia){
                case 0:{day="Domingo";break;}
                case 1:{day="Lunes";break;}
                case 2:{day="Martes";break;}
                case 3:{day="Miércoles";break;}
                case 4:{day="Jueves";break;}
                case 5:{day="Viernes";break;}
                case 6:{day="Sábado";break;}
            }
            console.log(day);
            const total= (await queryAsync(select.totalDay, [correo, day])).rows[0].count;
            if(total==0){
                res.json({ status: 1, mensaje: "Progreso obtenido", progreso:0});
                return;
            }
            const completed= (await queryAsync(select.completedDay, [correo, day])).rows[0].count;
            console.log(completed);
            const progress=(completed/total)*100;
            res.json({ status: 1, mensaje: "Progreso obtenido", progreso:progress});
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
    });

    app.post('/weekProgress', authenticateToken,async (req, res) => {
        try{
            const correo=req.body.correo;
            const total= (await queryAsync(select.totalWeek, [correo])).rows[0].count;
            if(total==0){
                res.json({ status: 1, mensaje: "Progreso obtenido", progreso:0});
                return;
            }
            const completed= (await queryAsync(select.completedWeek, [correo])).rows[0].count;
            res.json({ status: 1, mensaje: "Progreso obtenido", total:total, completed:completed});
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
    });

    app.post('/streak', authenticateToken,async (req, res) => {
        try{
            const correo=req.body.correo;
            const result= (await queryAsync(select.streak, [correo])).rows[0];
            res.json({ status: 1, mensaje: "Racha obtenida", streak:result});
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
    });

    app.post('/topThreeStreaks', authenticateToken,async (req, res) => {
        try{
            const result= (await queryAsync(select.topThreeStreaks)).rows;
            res.json({ status: 1, mensaje: "Top 3 rachas obtenido", topThreeStreaks:result});
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
    });

}