const { response } = require('express');
const {OpenAI} = require('openai');
require('dotenv').config({path:'../../.env'});


//Configuramos el API KEY
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


/*Convertimos los días a un string*/
function Dias(dias){
    diasHabiles="";
    //se obtienen solo los días seleccionados
    const dias_marcados = Object.keys(dias).filter((key) => dias[key]);
    //convertimos los dias a un string
    if(dias_marcados.length==1){
        diasHabiles+=" "+dias_marcados[0]+",";
    }else{
        for(i=0; i<dias_marcados.length; i++){
            
            if(i!=dias_marcados.length-2){
                diasHabiles+=" "+dias_marcados[i]+",";
            }else{
                diasHabiles+=" "+dias_marcados[i]+" y";
            }

        }
    }
    return diasHabiles;
}


/*Creamos la petición para el modelo*/
function createRequest(Tipo_ejercicio,edad,peso,altura,dedicacion,dias,tiempo, equipo,genero){
    request="Crea una rutina de "+Tipo_ejercicio+" para una persona "+genero+" de "+edad+" años que pesa "+peso+" libras, mide "+altura+" cm y se dedica "+dedicacion+" a la actividad física. Esta persona puede entrenar los días"+dias+" con un tiempo máximo de "+tiempo+" por sesión, y "+equipo+" de equipo de entrenamiento."
    
    return request
}


/*hacemos la petición de la rutina al modelo AI*/
async function RoutineRequest(request){
    //expresion regular que verifica incidencias del formato en el response
    const regex=/(Lunes|Martes|Miércoles|Jueves|Viernes|Sabado|Domingo)--([^--]+)--([^--]+)--(Repeticiones|Tiempo)--(\d+ series)--(\d+ (?:repeticiones|segundos))/g;
    try{

        const response = await openai.completions.create({
            model: "ft:babbage-002:primeai::87DHv5u1",
            prompt: request,
            temperature: 0.5,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop:["\n"]
        
          });
          //Si hay menos 7 incidencias o el match es null se vuelve a generar un rutina, sino se regresa arreglo con las incidencias
          let aux=response.choices[0].text.match(regex);
          let zero_duplicates=[];
          if(aux!=null){
            zero_duplicates=aux.filter((item, index) => aux.indexOf(item) === index);
          }
          if(response.choices[0].text.match(regex)!=null && zero_duplicates.length > 7 ){
            return zero_duplicates;
          }else{
            console.log("Se volvio a generar una rutina");
            return await(RoutineRequest(request));
          }

    }catch (error){
        console.error("Hubo un error...",error);
        throw error;
    }

}

/*Nos encargamos de dividir cada uno de los ejercicios generados por dia*/
function Parser(routine){
    //expresion regular que verifica cada posicion en el array
    const regex=/(Lunes|Martes|Miércoles|Jueves|Viernes|Sabado|Domingo)--([^--]+)--([^--]+)--(Repeticiones|Tiempo)--(\d+ series)--(\d+ (?:repeticiones|segundos))/;
    let incidencias=0;
    let routines=[];
    
    for(i=0; i<routine.length; i++){
        let pos=routine[i];
        if(regex.test(pos)){
            incidencias+=1;
            routines[i]=pos.split('--');
        }   
    }


    return routines;
}


/*Funcion que convierte a objeto cada posicion del arreglo de las rutinas*/
function simplifier(array){
    let posicionEspacio="";
    const dia=array[0];
    const ejercicio=array[1];
    const musculo=array[2];
    const tipo=array[3];

    posicionEspacio = array[4].indexOf(" ");
    const series=parseInt((array[4]).substring(0,posicionEspacio));
    posicionEspacio = array[5].indexOf(" ");
    const repeticiones=parseInt((array[5]).substring(0,posicionEspacio));

    const observaciones=(array[5]).substring(posicionEspacio+1);

    return{dia:dia, ejercicio:ejercicio, musculo:musculo, tipo:tipo, series:series, repeticiones:repeticiones, observaciones:observaciones};
};


module.exports = {
    Dias,
    createRequest,
    RoutineRequest,
    Parser,
    simplifier

}





