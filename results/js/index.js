google.load("visualization", "1.1", {packages:['table','corechart','line']});

var data_single;
var data_panel2x2;
var data_panel3x3;
var data_chess2x2;
var data_chess3x3;

var datas = [];


var layouts = ["Single","Chess2x2","Panel2x2","Chess3x3","Panel3x3"];

var tableName = "167MneM1hnWPIv7N7OwrAz9gXMzxJHl8HA0TFXsI3";
//var tableName_old = "16nSIjgiXTTXYX8d7dVI29ZIsCQlr4CN0ixQP6SGc";

function initialize() {
  var opts = {sendMethod: 'auto'};
  
  
  var query_single = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=', opts);
  var query_panel2x2 = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=', opts);
  var query_panel3x3 = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=', opts);
  var query_chess2x2 = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=', opts);
  var query_chess3x3 = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=', opts);

  
// 0        1             2                 3           4    5
//DistErr, RotationErr, RotationVariance, DistVariance, FPS, DR
  
    query_single.setQuery("SELECT Dist, AVERAGE(DistErr), AVERAGE(RotationErr), AVERAGE(RotationVariance), AVERAGE(DistVariance), AVERAGE(FPS),AVERAGE(DR)  FROM "+tableName+" WHERE Layout = 'Single' GROUP BY Dist");
  
    query_panel2x2.setQuery("SELECT Dist, AVERAGE(DistErr), AVERAGE(RotationErr), AVERAGE(RotationVariance), AVERAGE(DistVariance), AVERAGE(FPS),AVERAGE(DR)  FROM "+tableName+" WHERE Layout = 'Panel2x2' GROUP BY Dist");
    query_panel3x3.setQuery("SELECT Dist, AVERAGE(DistErr), AVERAGE(RotationErr), AVERAGE(RotationVariance), AVERAGE(DistVariance), AVERAGE(FPS),AVERAGE(DR)  FROM "+tableName+" WHERE Layout = 'Panel3x3' GROUP BY Dist");
    query_chess2x2.setQuery("SELECT Dist, AVERAGE(DistErr), AVERAGE(RotationErr), AVERAGE(RotationVariance), AVERAGE(DistVariance), AVERAGE(FPS),AVERAGE(DR)  FROM "+tableName+" WHERE Layout = 'Chess2x2' GROUP BY Dist");
    query_chess2x2.setQuery("SELECT Dist, AVERAGE(DistErr), AVERAGE(RotationErr), AVERAGE(RotationVariance), AVERAGE(DistVariance), AVERAGE(FPS),AVERAGE(DR)  FROM "+tableName+" WHERE Layout = 'Chess2x2' GROUP BY Dist");
    query_chess3x3.setQuery("SELECT Dist, AVERAGE(DistErr), AVERAGE(RotationErr), AVERAGE(RotationVariance), AVERAGE(DistVariance), AVERAGE(FPS),AVERAGE(DR)  FROM "+tableName+" WHERE Layout = 'Chess3x3' GROUP BY Dist");
  

  query_single.send(response_single);
  query_panel2x2.send(response_panel2x2);
  query_panel3x3.send(response_panel3x3);
  query_chess2x2.send(response_chess2x2);
  query_chess3x3.send(response_chess3x3);
}


function response_single(response){
  
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  
  
  data_single = response.getDataTable();
  data_single.sort(0);

}

function response_panel2x2(response){
  
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  
  
  data_panel2x2 = response.getDataTable();
  data_panel2x2.sort(0);

}

function response_panel3x3(response){
  
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  
  
  data_panel3x3 = response.getDataTable();
  data_panel3x3.sort(0);

}

function response_chess2x2(response){
  
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  
  data_chess2x2 = response.getDataTable();
  data_chess2x2.sort(0);

}

function response_chess3x3(response){
  
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  
  
  data_chess3x3 = response.getDataTable();
  data_chess3x3.sort(0);
  
  datas =  [data_single,data_chess2x2,data_panel2x2,data_chess3x3,data_panel3x3];
  
  drawCharts();

}

//  Draw each charts========================================= 

// 0     1        2           3                  4             5   6
//Dists DistErr, RotationErr, RotationVariance, DistVariance, FPS, DR

function drawCharts(){

  //  dist disterror =================================
  var testTable = joinTable(datas, layouts, 1);
  
  var chart = new google.visualization.LineChart(document.getElementById('dists-distError'));
  var options = {
    title: 'Distance - Distance Error',
    width: '100%',
    height: '520',
    hAxis:{
      title: 'Distance from camera to tag (m)',
      gridlines: {
        count: 6
      }
    },
    vAxis: {
      title: 'Average Distance Error (m)',
      format: 'decimal',
      minValue: '0',
      viewWindow: {
        min: 0,
        max: 0.1
      }
    }

  };
  
  chart.draw(testTable, options);
  
  //
  
  // dist rotationerror =====================================
  testTable = joinTable(datas, layouts, 2);
  
  //var chart = new google.charts.Line(document.getElementById('test_angle_DistError'));
  chart = new google.visualization.LineChart(document.getElementById('dists-rotationError'));
  options = {
    title: 'Distance - Avg. Rotation Error',
    width: '100%',
    height: '520',
    hAxis:{
      title: 'Distance from camera to tag (m)',
      gridlines: {
        count: 6
      }
    },
    vAxis: {
      title: 'Ang. Rotation Error',
      format: 'decimal',
      minValue: '0',
      viewWindow: {
        min: 0,
        max: 10
      }
    }

  };
  
  chart.draw(testTable, options);
  
   // dist detection Rate =====================================
  
  testTable = joinTable(datas, layouts, 6);
  
  chart = new google.visualization.LineChart(document.getElementById('dists-detectionRate'));
  options = {
    title: 'Distance - Avg. Detection Rate',
    width: '100%',
    height: '520',
    hAxis:{
      title: 'Distance from camera to tag (m)',
      gridlines: {
        count: 6
      }
    },
    vAxis: {
      title: 'Avg. Detection Rate',
      format: 'decimal',
      minValue: '0',
      viewWindow: {
        min: 0,
        max: 1
      }
    }

  };
  
  chart.draw(testTable, options);
  
     // dist dist variance =====================================
  testTable = joinTable(datas, layouts, 3);
  
  //var chart = new google.charts.Line(document.getElementById('test_angle_DistError'));
  chart = new google.visualization.LineChart(document.getElementById('dists-rotationVariance'));
  options = {
    title: 'Distance - Avg. Rotation Deviation',
    width: '100%',
    height: '520',
    hAxis:{
      title: 'Distance from camera to tag (m)',
      gridlines: {
        count: 6
      }
    },
    vAxis: {
      title: 'Avg. Rotation Deviation (m)',
      format: 'decimal',
      minValue: '0',
      viewWindow: {
        min: 0,
        max: 0.003
      }
    }

  };
  
  chart.draw(testTable, options);
}





// Utils ====================================================
// @Params
// data: table, 3 columns. key, variable, value
// array: array of variables
// unit: unit of variables
// column: column of variable
// key: key column index, better be 0
function joinTable(tables, array, column){
  var newtable;
  var view;
  var collumnOffset = [];  
  for(var index = 0; index < tables.length; index++){
    
    view = new google.visualization.DataView(tables[index]);
    
    
    view.setColumns([0,column]);
    
    if(index == 0)
    {
      newtable = view;
      continue;
    }
    
    //first index here is 1
    collumnOffset.push(index);
    newtable = google.visualization.data.join(newtable, view, 'left', [[0,0]], collumnOffset, [1]);
    if(index == 1){
      // index = 1 newtable is a view, can not assign column label
      newtable.setColumnLabel(1,array[0]);
    }
    newtable.setColumnLabel(index+1,array[index]);
  }
  
  return newtable;
}

google.setOnLoadCallback(initialize);



