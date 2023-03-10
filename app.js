const express=require("express");
const https=require("https");
const request=require("request");
const bodyParser=require("body-parser");

const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Home Route
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.eml;

    //Creating a JSON object to store data of members 
    const memData={
        //Data Given According To Mailchimp API References
        members:[   //Body Parameter of POST/list/{list_id}
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]

    }
    //Coverting JSON data into String Format
    const jsonData=JSON.stringify(memData);

    //API Connecting Through Mailchimp Url
    const url="https://us21.api.mailchimp.com/3.0/lists/3ac765e6e8";
    const options={

        method: "POST",

        //User authentication
        auth: "Abhradeep:d59c178c48c150e934cee7e3e7fff652-us21"
    }

    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

//Handle post requests From Failure Route
app.post("/failure",function(req,res){
    res.redirect("/");  //  Redirects again to the Home("/")Route
})

app.listen(3000,function(){
    console.log("Server started on port 3000.");
})

