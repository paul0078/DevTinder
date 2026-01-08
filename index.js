const express = require("express");

const app = express();

app.use("/test",(req, res) => {
    res.send("Iam Test Branch !!");
})

app.use("/hello",(req, res) => {
    res.send("Iam Hello Branch !!");
})

// app.use((req, res) => {
//     res.send("Iam  Express !!");
// })

app.listen(5000 , () => {
    console.log("Iam  Successfully Running Port 5000");
});