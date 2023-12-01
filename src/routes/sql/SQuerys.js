/*Consulta para obtener id de la rutina, desde el signup*/
const rutinaIdS=`SELECT id_rutina FROM rutina WHERE tipo = $1 ORDER BY id_rutina DESC LIMIT 1`;
/*COnsulta para obtener el id de un ejercicio, desde el signup*/
const EjercicioidS=`SELECT id_ejercicio FROM ejercicios WHERE nombre_ejercicio=$1`;
/*COnsulta para verificar si un ejercicio ya existe*/
const ejercicio_exist=`SELECT COUNT(*) as count FROM ejercicios WHERE nombre_ejercicio = $1`;
/* Obtain password from the users table */  
const password = `SELECT contraseña FROM usuario WHERE correo = $1`;
/* Select diet id associated with the description */    
const dietId = `SELECT id_dieta FROM dieta WHERE objetivo = $1`;
/* Select dish id associated with a time, description and day */    
const dishId = `SELECT id_plato FROM platos WHERE dia = $1 AND descripcion = $2 AND tiempo = $3`;
/* Select de all id_routine relationated with a mail */ 
const rutinaId = `SELECT id_rutina FROM asignar_rutinas WHERE correo = $1`;
/* select all the exercises including the name relationated with a routine_id */    
const rutinaPersonalizada = `SELECT rutina_personalizada.completado, rutina_personalizada.id_ejercicio, ejercicios.nombre_ejercicio, ejercicios.musculo, ejercicios.imagen_ejercicio, rutina_personalizada.repeticiones, rutina_personalizada.tiempo_ejercicio, rutina_personalizada.series FROM rutina_personalizada INNER JOIN ejercicios ON rutina_personalizada.id_ejercicio = ejercicios.id_ejercicio WHERE rutina_personalizada.id_rutina = $1 AND  rutina_personalizada.dia = $2`;    
/* select all the exercises relationated with a routine_id, depending of an specific day */ 
const rutinaPersonalizadaDia = `SELECT * FROM rutina_personalizada WHERE id_rutina = $1 AND dia = $2`;
/* Select the id_diet relationated with a mail */   
const dietaId = `SELECT id_dieta FROM asignar_dietas WHERE correo = $1`;
/* Select the name of routine */
const rutinaNombre = `SELECT nombre FROM asignar_rutinas WHERE correo = $1`;
/* Select all the dishes including description, dish_id relationated with an especific diet_id, day and time */ 
const platosAgregados = `SELECT platos_agregados.id_plato, platos.dia, platos.descripcion, platos.tiempo FROM platos_agregados INNER JOIN platos ON platos_agregados.id_plato = platos.id_plato WHERE platos_agregados.id_dieta = $1 AND platos_agregados.dia = $2`;
/* Selec all the days that a routine is relationated with a day */  
const diasRutina = `SELECT DISTINCT(dia) FROM rutina_personalizada WHERE id_rutina = $1`;
/* All the exercise in a day */
const totalDay='SELECT COUNT(*) FROM usuario U, rutina_personalizada R, asignar_rutinas A WHERE U.correo=A.correo AND A.id_rutina=R.id_rutina AND U.correo=$1 AND R.dia=$2';
/* All exercise completed in a day */
const completedDay="SELECT COUNT(*) FROM usuario U, rutina_personalizada R, asignar_rutinas A WHERE U.correo=A.correo AND A.id_rutina=R.id_rutina AND U.correo=$1 AND R.dia=$2 AND R.completado='si'";
/* All exercises in a week */
const totalWeek="SELECT COUNT(*) FROM usuario U, rutina_personalizada R, asignar_rutinas A WHERE U.correo=A.correo AND A.id_rutina=R.id_rutina AND U.correo=$1";
/* All exercises completed in a week */ 
const completedWeek="SELECT COUNT(*) FROM usuario U, rutina_personalizada R, asignar_rutinas A WHERE U.correo=A.correo AND A.id_rutina=R.id_rutina AND U.correo=$1 AND R.completado='si'";
/*Select all de days and the streak of the user*/
const streak="SELECT * FROM rachas WHERE correo=$1";
/* Select the top three streaks with the first name, last name and the streak */
const topThreeStreaks="SELECT nombre, apellido, racha FROM rachas R, usuario U WHERE R.correo=U.correo  ORDER BY racha DESC LIMIT 3";
/* Obtener todos los usuarios en rachas */
const usuarios = "SELECT correo FROM rachas";

module.exports={    
    rutinaIdS,
    EjercicioidS,
    ejercicio_exist,
    password,
    dietId,
    dishId, 
    rutinaId,
    rutinaPersonalizada,
    rutinaPersonalizadaDia,
    dietaId,
    platosAgregados,
    diasRutina,
    totalDay,
    completedDay,
    totalWeek,
    completedWeek,
    streak,
    topThreeStreaks,
    usuarios,
    rutinaNombre
}