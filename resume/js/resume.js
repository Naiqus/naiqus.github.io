if ("ontouchstart" in document.documentElement) {
    document.querySelector(".hint").innerHTML = "<p>Tap on the left or right to navigate</p>";
}
var welcomeMsg = "Naiqus:<span>Welcome!</span>       <br></br>I am <b>Suqian Zhang</b>. Thanks for checking out my Résumé. <b>:)</b><br></br>\
    Please <b>scroll down gently</b> or use <i>arrow keys/space key</i> to navigate.";

// typing bot welcome msg
var theater = new TheaterJS({ erase: false, autoplay: true});
theater.describe("Naiqus",{speed: 2, accuracy: .8, invincibility: 4},".welcome-msg");
//add class
theater.on("say:start, erase:start", function (eventName) {
                        var self    = this,
                            current = self.current.voice;
                        self.utils.addClass(current, "saying");
                    });
theater.write(welcomeMsg,1500);
    //make it look
    

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