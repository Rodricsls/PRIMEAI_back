import fs from 'fs';
import OpenAI, { toFile } from 'openai';
import dotenv from 'dotenv';
dotenv.config();
const openai = new OpenAI();

/*// If you have access to Node fs we recommend using fs.createReadStream():
await openai.files.create({ file: fs.createReadStream('data_diet.jsonl'), purpose: 'fine-tune' });

//List files
const listfiles =await openai.files.list();
console.log(listfiles);*/
/* id:file-12cNUYebAlIWufgfzAIFxJ1c */

//Fine tune
const finetune = await openai.fineTunes.create({ training_file:"file-12cNUYebAlIWufgfzAIFxJ1c", model:"babbage-002",} ).catch((err) => console.log(err));


