import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const response = await openai.completions.create({
    model: "ft:babbage-002:primeai::87DHv5u1",
    prompt: "Crea una rutina de ejercicios de Fuerza para una persona hombre de 23 años que pesa 180 libras, mide 185 cm y se dedica mucho a la actividad física. Esta persona puede entrenar los días lunes, miércoles y sábado, con un tiempo máximo de una hora o más por sesión, y dispone de equipo de entrenamiento.",
    temperature: 0.6,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["\n"],
  });

console.log(response);