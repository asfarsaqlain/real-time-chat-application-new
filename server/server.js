let express = require("express");
let app = express();
let Json=require("circular-json");

let http = require("http");
let server = http.Server(app);

let socketIO = require("socket.io");
let io = socketIO(server);

let MongoClient=require("mongodb").MongoClient;
let url="mongodb://localhost:27017/msgDB";
let dbo=null;
MongoClient.connect(url,{useNewUrlParser:true},function(err,db){
    if(err)
    {
        throw err;
    }
    dbo=db.db("msg_db");
    dbo.createCollection("messages",function (err,res) {
       if(err)
       {
           throw err;
       }
       console.log("Collection Created");
    });
});

const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
    console.log("User Connected");
    socket.on("new-message", (message) => {
        dbo.collection("messages").insertOne(message,function (err,res) {
           if(err)
           {
               throw err;
           }
           console.log("Message is INserted",socket);
            io.emit("incomming-message",message);
        });
        });

    });

server.listen(port, () => {
    console.log(`server is started at ${port}`);
});

app.post("/getMessages",function (err,res) {
    res.writeHeader(200,{"Access-Control-Allow-Origin":"*"});
    dbo.collection("messages").find().sort({_id:-1}).limit(20).toArray(function(err,result){
        res.end(Json.stringify(result.reverse()));
    });
});