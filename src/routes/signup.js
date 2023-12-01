// Import required modules
const pool = require("../db");
const util = require('util');
const queryAsync = util.promisify(pool.query).bind(pool);
const bcrypt = require("bcrypt");
const Routine_AI = require("./Routine_AI.js");
const insert = require("./sql/IQuerys.js");
const verify = require("./sql/VQuerys.js");
const Diet_AI = require("./Diet_AI.js");
const select = require("./sql/SQuerys.js");
const saltRounds = 10;

// Export function that sets up endpoints for user registration
module.exports = (app) => {
    // Endpoint to register a new user in the database
    app.post('/signup', async (req, res) => {
        try{
            // Hash user password using bcrypt
            const hashedContraseña = await bcrypt.hash(req.body.contraseña, saltRounds);
            // Get user data from request body
            const values = [
                req.body.correo,
                hashedContraseña,
                req.body.nombre,
                req.body.apellido,
                req.body.peso,
                req.body.estatura,
                req.body.imagen_usuario,
                req.body.edad,
                req.body.genero
            ];
            // Insert user data into database
            await queryAsync(insert.User, values);

            // Generate workout routine using AI model
            const days=Routine_AI.Dias(req.body.dias);
            const peticion= Routine_AI.createRequest(req.body.tipo_ejercicio,req.body.edad,req.body.peso,req.body.estatura,req.body.dedicacion,days,req.body.tiempo, req.body.equipo, req.body.genero);
            const routine= await Routine_AI.RoutineRequest(peticion);
            let routine_array=Routine_AI.Parser(routine);
            const date=new Date().getDay();
            let day_c;
            switch(date){
                case 0:{day_c="Domingo";break;}
                case 1:{day_c="Lunes";break;}
                case 2:{day_c="Martes";break;}
                case 3:{day_c="Miércoles";break;}
                case 4:{day_c="Jueves";break;}
                case 5:{day_c="Viernes";break;}
                case 6:{day_c="Sábado";break;}
            }


            // Insert workout routine data into database
            const tipo = req.body.tipo_ejercicio+" "+req.body.correo;
            await queryAsync(insert.Rutina, [tipo]);
            const rutina_id=(await queryAsync(select.rutinaIdS, [tipo])).rows[0].id_rutina;
            await queryAsync (insert.rutina_asignar, [req.body.correo, rutina_id, req.body.nombre_rutina]);
            for (i=0; i<routine_array.length; i++){
                let Obj_routine=Routine_AI.simplifier(routine_array[i]);
                const vef_ejercicio=await queryAsync(verify.ejercicio_exist, [Obj_routine.ejercicio]);
                if(vef_ejercicio.rows[0].count==0){
                    await queryAsync(insert.Ejercicios, [Obj_routine.ejercicio, Obj_routine.musculo]);
                }
                const ejercicio_id= (await queryAsync(select.EjercicioidS, [Obj_routine.ejercicio])).rows[0].id_ejercicio;
                let complete=(Obj_routine.dia==day_c?"hoy":"aun");

                if(Obj_routine.tipo=='Repeticiones'){
                    await queryAsync(insert.rutina_personalizada,[rutina_id, ejercicio_id, Obj_routine.repeticiones, 0,Obj_routine.series, Obj_routine.dia, complete]);
                }else{
                    await queryAsync(insert.rutina_personalizada,[rutina_id, ejercicio_id, 0, Obj_routine.repeticiones ,Obj_routine.series, Obj_routine.dia, complete]);
                }
            }

            //Insert into rachas
           await queryAsync(insert.rachas, [req.body.correo]);
            // Generate diet using AI model 
            const diet=Diet_AI.createRequest(req.body.objetivo, req.body.edad, req.body.estatura, req.body.peso, req.body.genero ,req.body.alimentacion, req.body.restricciones);
            const diet_response= await Diet_AI.DietRequest(diet);
            let diet_array=Diet_AI.Parser(diet_response);
            let diet_simplified=Diet_AI.simplifier(diet_array);
            const objetivo_dieta=req.body.objetivo+"-"+req.body.correo;
            await queryAsync(insert.dieta, [objetivo_dieta]);

            const dieta_id=(await queryAsync(select.dietId, [objetivo_dieta])).rows[0].id_dieta;
            await queryAsync(insert.dieta_asignar, [req.body.correo, dieta_id]);
            for (i=0; i<diet_simplified.length; i++){
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

            // Return success message if user was registered successfully
            res.json({ status: 1, mensaje: "USUARIO REGISTRADO!!!" });
            
//create a object with random data to test signup   

        }catch(error){
            // Return error message if there was an error registering the user
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message });
        }
    });

    // Endpoint to check if a user already exists in the database
    app.post('/check-usuario', async (req, res) => {
        try{
            // Get user email from request body
            const values = [
                req.body.correo
            ];
            // Query the database to check if the user already exists
            const result = await queryAsync(verify.check_usuario, values);
            // Return true if the user already exists, false otherwise
            if(result.rows[0].count!=0){
                res.json({existe:true});
            }else{
                res.json({existe:false});
            }
        }catch(error){
            // Return error message if there was an error checking if the user exists
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message });
        }
    });
}