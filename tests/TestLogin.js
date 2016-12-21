var casper = require('casper').create({
    pageSettings: {
        loadImages: false,//The script is much faster when this field is set to false
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    }
});

//First step is to open Login
casper.start().thenOpen("http://localhost:3000/login", function() {
    console.log("Login Page");
});

//Now we have to populate username and password, and submit the form
casper.then(function(){
    console.log("Login using username and password");
    this.evaluate(function(){
        document.getElementById("inputEmail").value="paraball@uncc.edu";
        document.getElementById("inputPassword").value="33333333";
        document.getElementById("login").click();
    });
});

//Wait to be redirected to the Home page, and then make a screenshot
casper.then(function(){
    console.log("Make a screenshot and save it as AfterLogin.png");
    this.capture('AfterLogin.png');
});

casper.run();
