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




app.listen(app.get("port"), 
() => console.log(`Escuchando en servidor puerto : ${app.get("port")}`));