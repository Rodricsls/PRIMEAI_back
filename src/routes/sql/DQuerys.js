/* Eliminar dieta de asignar_dietas */
const deleteDiet = `DELETE FROM asignar_dietas WHERE correo=$1`;

module.exports = {
    deleteDiet
    };