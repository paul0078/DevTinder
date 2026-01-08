const express = require("express");

const app = express();

app.use((req, res) => {
    res.send("Iam Express Node js Running Succesfully !!");
})

app.listen(5000 , () => {
    console.log("Iam  Successfully Running Port 5000");
});