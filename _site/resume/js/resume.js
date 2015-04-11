if ("ontouchstart" in document.documentElement) {
    document.querySelector(".hint").innerHTML = "<p>Tap on the left or right to navigate</p>";
}
var welcomeMsg = "Naiqus: Thanks for checking out my Résumé. <b>:)</b><br></br>\
    Please <b>scroll down gently</b> or use <i>arrow keys/space key</i> to navigate.";

// typing bot welcome msg
var theater = new TheaterJS({ erase: false, autoplay: true});
theater.describe("Naiqus",{speed: 1.0, accuracy: .7, invincibility: 2},".welcome-msg");
//add class
theater.on("say:start, erase:start", function (eventName) {
                        var self    = this,
                            current = self.current.voice;
                        self.utils.addClass(current, "saying");
                    });
theater.write(welcomeMsg,1500);

    

//arrange resume slide vertical position according to the element above.
var resumeSnippets = document.getElementsByClassName("resume");
var i,
    thisElement,
    lastElement,
    newY,
    lastY,
    thisHeight,
    lastHeight,
    lastScale;

for (i = 1; i < resumeSnippets.length; i = i + 1) {
    thisElement = resumeSnippets[i];
    lastElement = resumeSnippets[i - 1];
    lastY = parseInt(lastElement.getAttribute("data-y"), 10);
    thisHeight = parseInt(thisElement.clientHeight / 2, 10);
    if (lastElement.hasAttribute("data-scale")) {
        lastHeight = parseInt(lastElement.clientHeight, 10) * parseInt(lastElement.getAttribute("data-scale"), 10);
    } else {
        lastHeight = parseInt(lastElement.clientHeight, 10);
    }
    if (thisElement.hasAttribute("data-scale")) {
        thisHeight = parseInt(thisElement.clientHeight, 10) * parseInt(thisElement.getAttribute("data-scale"), 10);
    } else {
        thisHeight = parseInt(thisElement.clientHeight, 10);
    }
    newY = lastY + lastHeight / 2 + thisHeight / 2 - 4;
//    debugger;
    thisElement.setAttribute("data-y", newY);
}

//Config Chart.js
var radarOptions = {
    scaleShowLine : true,
    angleShowLineOut : false,
	scaleFontSize : 12,
    pointLabelFontFamily : "monospace",
	pointLabelFontStyle : "bold",	
	pointLabelFontSize : 15,
	pointLabelFontColor : "#444444",
	animation : true
};
//skill chart

// Radar Data
var skillData = {
	labels : ["Java","Linux","JavaScript","English","German","Chinese","C/C++"],
	datasets : [
		{
			fillColor : "rgba(100,177,242,.3)",
			strokeColor : "rgba(220,220,220,1)",
			data : [80,90,70,90,75,100,90]
		}
	]
};
var interestData = {
	labels : ["Computer Vision","Web","Guitar","Violin","Tennis","Embedded System","AR/VR","Internet of Things"],
	datasets : [
		{
			fillColor : "rgba(255,183,77,.3)",
			strokeColor : "rgba(220,220,220,1)",
			data : [90,70,70,60,80,80,90,70]
		}
	]
};



//Get the context of the Radar Chart canvas element we want to select
var ctx = document.getElementById("skill-chart").getContext("2d");
var mySkillChart = new Chart(ctx).Radar(skillData,radarOptions);
ctx = document.getElementById("interest-chart").getContext("2d");
mySkillChart = new Chart(ctx).Radar(interestData,radarOptions);