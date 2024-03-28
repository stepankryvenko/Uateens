import express from "express"

import {appendFileSync} from "fs"

const app = express();

app.use(express.static('./'))

app.use(express.json())

app.post("/stats", function(req,res){
    appendFileSync("game.txt" , JSON.stringify(req.body) + "\n")
})

app.listen(3002)


