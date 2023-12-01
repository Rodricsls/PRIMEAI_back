// Import required modules
const pool = require("../db");
const util = require('util');
const queryAsync = util.promisify(pool.query).bind(pool);
const select = require("./sql/SQuerys.js");
const Routine_AI = require("./Routine_AI.js");
const insert = require("./sql/IQuerys.js");
const verify = require("./sql/VQuerys.js");
const { authenticateToken } = require("../middleware/authMiddleware.js");

module.exports = (app) => {
    //endpoint construct routineObject
    app.post('/routineObject',async (req, res) => {
        const routineObject = {Domingo:[],Lunes:[],Martes:[],Miercoles:[],Jueves:[],Viernes:[],Sabado:[]};
        const correo=req.body.correo;
        console.log(correo);
        try{
            const routines = await queryAsync(select.rutinaId, [correo]);
            const name=(await queryAsync(select.rutinaNombre, [correo]));


            const ids=routines.rows;
            const nombres=name.rows;
            console.log(ids);
            if(ids.length==0){
                res.json({ status: 0, mensaje: "No hay rutinas asignadas"});
                return;
            }
            for (i=0; i<ids.length; i++){
                const dias= await queryAsync(select.diasRutina, [ids[i].id_rutina]);
                console.log(2);
                for (a=0; a<dias.rows.length; a++){
                    const exerciseday= (await queryAsync(select.rutinaPersonalizada,[ids[i].id_rutina, dias.rows[a].dia])).rows;
                    let routineData={idr:ids[i].id_rutina, nr:nombres[i].nombre ,ejercicios:exerciseday};
                    switch(dias.rows[a].dia){
                        case "Domingo":
                            routineObject.Domingo.push(routineData);
                            break;
                        case "Lunes":
                            routineObject.Lunes.push(routineData);
                            break;
                        case "Martes":
                            routineObject.Martes.push(routineData);
                            break;
                        case "Miércoles":
                            routineObject.Miercoles.push(routineData);
                            break;
                        case "Jueves":
                            routineObject.Jueves.push(routineData);
                            break;
                        case "Viernes":
                            routineObject.Viernes.push(routineData);
                            break;
                        case "Sábado":
                            routineObject.Sabado.push(routineData);
                            break;
                    }
                }

            }
            res.json({ status: 1, mensaje: "Rutina obtenida", rutina:routineObject});

        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
    });

    app.post('/DeleteRutina', authenticateToken,async (req, res) => {
        try{
            const query1=`DELETE FROM asignar_rutinas WHERE id_rutina = $2 and correo =$1`;
            const values=[req.body.correo, req.body.id_rutina];
            const result=await queryAsync(query1, values);            

                res.json({ status: 1, mensaje: "Rutina Eliminada exitosamente!"});
                
            
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
        
    });

    app.post('/FinishEjercicio',authenticateToken ,async (req, res) => {
        try{
            const query1=`SELECT gestor_ejercicios($1, $2, $3, $4)`;
            const values=[req.body.id_rutina, req.body.id_ejercicio, req.body.dia, req.body.correo];
            const result=await queryAsync(query1, values);            

                res.json({ status: 1, mensaje: "Ejercicio Terminado exitosamente!"});
                
            
        }catch(error){
            res.json({ status: 0, mensaje: "Error en el servidor" + error.message});
        }
        
    });

    app.post('/createRoutine',authenticateToken ,async(req, res)=>{
        try{
            // Generate workout routine using AI model
            const days=req.body.dias;
            const peticion= Routine_AI.createRequest(req.body.tipo_ejercicio,req.body.edad,req.body.peso,req.body.genero,req.body.estatura,req.body.dedicacion,days,req.body.tiempo, req.body.equipo);
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
            console.log("aca1")
            await queryAsync(insert.Rutina, [tipo]);
            console.log("aca2")
            const rutina_id=(await queryAsync(select.rutinaIdS, [tipo])).rows[0].id_rutina;
            console.log("aca3")
            await queryAsync (insert.rutina_asignar, [req.body.correo, rutina_id, req.body.nombre_rutina]);
            console.log("aca4")
            for (i=0; i<routine_array.length; i++){
                let Obj_routine=Routine_AI.simplifier(routine_array[i]);
                const vef_ejercicio=await queryAsync(verify.ejercicio_exist, [Obj_routine.ejercicio]);
                console.log("aca5")
                if(vef_ejercicio.rows[0].count==0){
                    await queryAsync(insert.Ejercicios, [Obj_routine.ejercicio, Obj_routine.musculo]);
                    console.log("aca6")
                }
                const ejercicio_id= (await queryAsync(select.EjercicioidS, [Obj_routine.ejercicio])).rows[0].id_ejercicio;
                let complete=(Obj_routine.dia==day_c?"hoy":"aun");

                if(Obj_routine.tipo=='Repeticiones'){
                    await queryAsync(insert.rutina_personalizada,[rutina_id, ejercicio_id, Obj_routine.repeticiones, 0,Obj_routine.series, Obj_routine.dia, complete]);
                }else{
                    await queryAsync(insert.rutina_personalizada,[rutina_id, ejercicio_id, 0, Obj_routine.repeticiones ,Obj_routine.series, Obj_routine.dia, complete]);
                }
            }
            // Return success message if user was registered successfully
            res.json({ status: 1, mensaje: "Rutina creada" });

        }catch(error){
            console.error(error);
        }
    })
}