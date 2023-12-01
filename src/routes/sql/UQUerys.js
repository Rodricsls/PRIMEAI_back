/* Update exercises and streak to aun every week */
/* Actualiza a aun todos los ejercicios cada domingo a las 11:58 */
const ExercisesWeek="UPDATE rutina_personalizada SET completado = 'aun'";
/* Actualiza los días de la tabla rachas a aun ntodos los domingos a las 11:58 */
const StreakWeek="UPDATE rachas SET lunes='aun', martes='aun', miercoles='aun', jueves='aun', viernes='aun', sabado='aun', domingo='aun'";
/* Actualiza a hoy a todos los ejercicios del dia correspondiente  todos los dias a las 12:02*/
const TodayExercises="UPDATE rutina_personalizada SET completado = 'hoy' WHERE dia=$1";
/* Actualiza a no todos lo ejercicios que no han sido completados ese dia las 11:58 */
const noExercises="UPDATE rutina_personalizada SET completado = 'no' WHERE dia=$1 AND completado='hoy' ";
/* ACtualizar a no el dia en racha y si lo actualiza a no resetear racha a 0 */

const date = new Date().getDay();
let day;
switch(date){
    case 0:{day="domingo";break;}
    case 1:{day="lunes";break;}
    case 2:{day="martes";break;}
    case 3:{day="miercoles";break;}
    case 4:{day="jueves";break;}
    case 5:{day="viernes";break;}
    case 6:{day="sabado";break;}
}
const noStreak=`UPDATE rachas SET ${day}='no' WHERE ${day}='aun';`;
const resetStreak=`UPDATE rachas SET racha=0 WHERE ${day}='no';`;

module.exports={
    ExercisesWeek,
    StreakWeek,
    TodayExercises,
    noExercises, 
    noStreak,
    resetStreak

}