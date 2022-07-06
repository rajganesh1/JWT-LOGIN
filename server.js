const express = require("express");
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

const users = [];

app.get("/users", (req,res)=>{
    res.json(users);
})

app.post("/users", async(req,res)=>{
    try{
        //const salt = await bcrypt.genSalt();
        const hashedpwd = await bcrypt.hash(req.body.password, 10);
        //console.log(hashedpwd);
        const user = {username: req.body.username, password: hashedpwd};
        users.push(user);
        res.sendStatus(200);
    }catch(e){
        res.sendStatus(500);
    }
})

app.post("/users/login",async(req,res)=>{
    const user = await users.find(user => user.username === req.body.username);
    if(user == null){
        return res.status(400).send('Cannot find user');
    }
    else{
        try{
            if(await bcrypt.compare(req.body.password, user.password)){
                res.send('Success');
            }
            else{
                res.send('Wrong password');
            }
        }catch(e){
            res.sendStatus(500);
        }
    }
})

app.listen(4000, (req,res)=>{
    console.log("Started at port 4000...");
})
