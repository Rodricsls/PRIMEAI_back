/*Consulta para insertar una nueva rutina*/
const Rutina=`INSERT INTO rutina (tipo) VALUES ($1)`;
/*COnsulta para asignar una nueva rutina*/
const rutina_asignar=`INSERT INTO asignar_rutinas (correo, id_rutina, nombre) VALUES ($1,$2,$3)`;
/*Consulta para crear una nueva rutina personalizada*/
const rutina_personalizada=`INSERT INTO rutina_personalizada (id_rutina, id_ejercicio, repeticiones, tiempo_ejercicio, series, dia, completado) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
/*Consulta para ingresar un nuevo ejercicio*/
const Ejercicios=`INSERT INTO ejercicios (nombre_ejercicio, musculo, imagen_ejercicio) VALUES ($1, $2, '#')`;
/*COnsulta para ingresar un nuevo usuario*/
const User = `INSERT INTO usuario (correo, contraseña, nombre, apellido, peso, estatura, imagen_usuario, edad, genero) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
/* consulta para crear una nueva rutina */
const dieta = `INSERT INTO dieta (objetivo) VALUES ($1)`;
/* consulta para asignar una nueva dieta */
const dieta_asignar = `INSERT INTO asignar_dietas (correo, id_dieta) VALUES ($1, $2)`;
/* consulta para crear un nuevo plato */
const plato=`INSERT INTO platos (dia, descripcion, tiempo) VALUES ($1, $2, $3)`;
/* consulta para agregar un nuevo plato*/
const agregar_plato=`INSERT INTO platos_agregados (id_dieta, id_plato, dia) VALUES ($1, $2, $3)`;
/* inserar en rachas */
const rachas=`INSERT INTO rachas (correo, lunes, martes, miercoles, jueves, viernes, sabado, domingo, racha) VALUES ($1, 'aun', 'aun', 'aun', 'aun', 'aun', 'aun', 'aun', 0)`;


module.exports={
    Rutina,
    rutina_asignar,
    rutina_personalizada,
    Ejercicios,
    User,
    dieta,
    dieta_asignar,
    plato,
    agregar_plato, 
    rachas
}