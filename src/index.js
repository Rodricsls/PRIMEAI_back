// import express
const { updateWeek, updateStreak, updateToday, updateNo } = require("./jobs/TaskFunctions");
const app= require("./server");
require("./routes/signup")(app);
require("./routes/login")(app);
require("./routes/user")(app);
require("./routes/routines")(app);
require("./routes/diets")(app);
require("./routes/stadistics")(app);
require("./jobs/TaskFunctions");





app.get('/', (req, res)=>{
    res.status(200).send('<h1>Hola Mundo con Nodemon!</h1>')
})
app.listen(app.get("port"), 
() => console.log(`Escuchando en servidor puerto : ${app.get("port")}`));