const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { dirname } = require("path");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
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

    const url = "https://us9.api.mailchimp.com/3.0/lists/4b753ce8c1";

    const options = {
        method: "POST",
        auth: "krish1:79ffa63d1cd2ffc724eeacd3b3dab5e6-us9"
    };

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            response.on("data", function(data){
                console.log(JSON.parse(data));
            });
            res.sendFile(__dirname + "/success.html");
        } else {
            console.error(`Failed with status code: ${response.statusCode}`);
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.on("error", function(error){
        console.error(error);
    });

    request.write(jsonData);
    request.end();
});

// app.post("/failure", function (req, res){
//     res.redirect("/localhost:3000");
//   });
  


app.listen(3000, function() {
    console.log("Your server is running on port 3000");
});
