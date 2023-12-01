/*COnsulta para verificar la existencia de un usuario*/
const check_usuario = `SELECT COUNT(*) as count FROM usuario WHERE correo = $1`;
/*COnsulta para verificar si un ejercicio ya existe*/
const ejercicio_exist=`SELECT COUNT(*) as count FROM ejercicios WHERE nombre_ejercicio = $1`;
/* verificate if a dish already exisits in the table, comparing the time,day and description */ 
const dish_exist = `SELECT COUNT(*) as count FROM platos WHERE dia = $1 AND descripcion = $2 AND tiempo = $3`;


module.exports={
    check_usuario,
    ejercicio_exist,
    dish_exist
}