const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");
const app = express()
require('dotenv').config()
const port = 3000

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res)=>{
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/c11ffe20a7";

  const options = {
     method: "POST",
     auth: `harshith:${process.env.API_KEY}`
  }

  const request = https.request(url,options,function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${port}`)
})


// mailchimp API key
// 82315bfe3de2b9ed09e501e03bc2ab49-us21

//audience id 
// c11ffe20a7
