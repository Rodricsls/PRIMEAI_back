// Import required modules
const pool = require("../db");
const util = require('util');
const queryAsync = util.promisify(pool.query).bind(pool);
const select = require("./sql/SQuerys.js");
const insert = require("./sql/IQuerys.js");
const verify = require("./sql/VQuerys.js");
const Diet_AI = require("./Diet_AI.js");
const deleteObject=require("./sql/DQuerys.js");
const dietObject = {Lunes:{Desayuno:{}, Almuerzo:{}, Cena:{}},Martes:{Desayuno:{}, Almuerzo:{}, Cena:{}},Miercoles:{Desayuno:{}, Almuerzo:{}, Cena:{}},Jueves:{Desayuno:{}, Almuerzo:{}, Cena:{}},Viernes:{Desayuno:{}, Almuerzo:{}, Cena:{}},Sabado:{Desayuno:{}, Almuerzo:{}, Cena:{}},Domingo:{Desayuno:{}, Almuerzo:{}, Cena:{}}};
const dias=["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];
const { authenticateToken } = require("../middleware/authMiddleware.js");
module.exports=(app) =>{
    app.post('/dietObject', authenticateToken ,async (req, res) => {
        const correo=req.body.correo;
        try{
            const diet = await queryAsync(select.dietaId, [correo]);
            const ids=diet.rows[0].id_dieta;
            for (i=0; i<dias.length; i++){
                const platos= await queryAsync(select.platosAgregados, [ids, dias[i]]);
                for (a=0; a<platos.rows.length; a++){
                    let plato=platos.rows[a];
                    switch(plato.tiempo){
                        case "Desayuno":
                            dietObject[dias[i]].Desayuno=plato;
                            break;
                        case "Almuerzo":
                            dietObject[dias[i]].Almuerzo=plato;
                            break;
                        case "Cena":
                            dietObject[dias[i]].Cena=plato;
                            break;
                    }
                }
            }
            res.json({ status: 1, mensaje: "Dieta obtenida", dieta:dietObject});
                  
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
    })

    /* Delete a diet */
    app.post('/deleteDiet', authenticateToken, async (req, res) => {
        try{
            const correo=req.body.correo;
            await queryAsync(deleteObject.deleteDiet, [correo]);
            res.json({ status: 1, mensaje: "Dieta eliminada"});
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
    })

    /* Crear una rutina */
    app.post('/createDiet', authenticateToken, async (req, res) => {
        try{
            const diet=Diet_AI.createRequest(req.body.objetivo, req.body.edad, req.body.estatura, req.body.peso, req.body.genero, req.body.alimentacion, req.body.restricciones);
            const diet_response=await Diet_AI.DietRequest(diet);
            let diet_array=Diet_AI.Parser(diet_response);
            let diet_simplified=Diet_AI.simplifier(diet_array);
            const objetivo_dieta=req.body.objetivo+"-"+req.body.correo;
            await queryAsync(insert.dieta, [objetivo_dieta]);
            const dieta_id=(await queryAsync(select.dietId, [objetivo_dieta])).rows[0].id_dieta;
            await queryAsync(insert.dieta_asignar, [req.body.correo, dieta_id]);
            console.log(dieta_id);

            for(i=0; i<diet_simplified.length; i++){
                const dia=diet_simplified[i].dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const tiempo=diet_simplified[i].tiempo;
                    const comida=diet_simplified[i].comida;
                    const plato_existente=await queryAsync(verify.dish_exist, [dia, comida, tiempo]);
                    if(plato_existente.rows[0].count==0){
                        await queryAsync(insert.plato, [dia, comida, tiempo]);
                    }
                    const plato_id=(await queryAsync(select.dishId, [dia, comida, tiempo])).rows[0].id_plato;
                    await queryAsync(insert.agregar_plato, [dieta_id, plato_id,dia]);
            }

            res.json({ status: 1, mensaje: "Dieta creada!!!" });
            
            //create a object with random data to test signup   

        }catch(error){
            // Return error message if there was an error registering the user
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message });
        }
        
    })
};