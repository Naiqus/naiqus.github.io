
// Radar Data
var radarData = {
	labels : ["Java","C/C++","JavaScript","Linux"],
	datasets : [
		{
			fillColor : "rgba(220,220,220,1)",
			strokeColor : "rgba(220,220,220,1)",
			data : [80,90,70,80]
		}
	]
};


//Get the context of the Radar Chart canvas element we want to select
var ctx = document.getElementById("skill-chart").getContext("2d");
var mySkillChart = new Chart(ctx).Radar(radarData,{animation:false});