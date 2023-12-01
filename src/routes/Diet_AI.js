const { response } = require('express');
const {OpenAI} = require('openai');
require('dotenv').config({path:'../../.env'});

//configure API KEY
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//regex to verify format in the response    
const regex=/(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)--(Desayuno|Almuerzo|Cena)--[^;]+/g;

//create a request for the model    
function createRequest(Tipo_dieta,edad,altura,peso,genero,dedicacion,restricciones){
    request="Haz una dieta de "+Tipo_dieta+" para una persona "+genero+ "de "+edad+" años, que mide "+altura+" cm y pesa "+peso+" lb, el cual cuida "+dedicacion+" su alimentacion y "+restricciones+".";
    
    return request
}

//we do a diet request to the AI model  
async function DietRequest(request){
    try{

        const response = await openai.completions.create({
            model: "ft:babbage-002:primeai::8DJetbMs",
            prompt: request,
            temperature: 0.5,
            max_tokens: 800,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop:["\n"]
        
          });

          let incidencias = response.choices[0].text.match(regex);

          if(incidencias.length<21 || incidencias==null){
              return await DietRequest(request);
          }else{
              return incidencias;
          }
    }catch(err){
        console.log(err);
    }
}

//we divide the response into an array of arrays    
function Parser(dietas){
    const diet_array = [];
    for(i=0; i<dietas.length; i++){
        const aux = dietas[i].split("--");
        diet_array.push(aux);
    }
    return diet_array;
}

//simplify each element of the array into an object
function simplifier(array){
    const dieta = [];
    for(i=0; i<array.length; i++){
        const dia = array[i][0];
        const tiempo = array[i][1];
        const comida = array[i][2];
        
        dieta.push({dia:dia, tiempo:tiempo, comida:comida});
    }
    return dieta;
}

module.exports = {createRequest, DietRequest, Parser, simplifier};