google.load("visualization", "1.1", {packages:['table','corechart','line']});

var dists = [0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5];
var angles = [0,10,20,30,40,50,60,70,80];


var data_roll_dist_distErr_rotErr;

//var tableName = "167MneM1hnWPIv7N7OwrAz9gXMzxJHl8HA0TFXsI3";
var tableName = "16nSIjgiXTTXYX8d7dVI29ZIsCQlr4CN0ixQP6SGc";

function initialize() {
  var opts = {sendMethod: 'auto'};
  
  
  var query_roll_dist_distErr_rotErr = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=', opts);


  
// 0 Roll
// 1 Pitch
// 2 Dist
// 3 DistErr
// 4 DistErr
// 5 DistVariance
// 6 RotationErr
// 7 RotationVariance
// 8 FPS
//  queryAll.setQuery("SELECT Roll, Pitch, Dist, DistErr, DistErr, DistVariance, RotationErr, RotationVariance, FPS FROM 167MneM1hnWPIv7N7OwrAz9gXMzxJHl8HA0TFXsI3 WHERE Layout = 'Single' ");
  
  
  query_roll_dist_distErr_rotErr.setQuery("SELECT Roll, Dist, DistErr, RotationErr FROM "+tableName+" WHERE Layout = 'Single' AND Pitch = 0");
  

  query_roll_dist_distErr_rotErr.send(response_roll_dist_distErr_rotErr);
}


function response_roll_dist_distErr_rotErr(response){
  
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  
  
  data_roll_dist_distErr_rotErr = response.getDataTable();
  data_roll_dist_distErr_rotErr.sort(0);
  
  //Call each draw charts functions
  drawChart_dist_distErr();
  drawChart_roll_distErr();
  drawChart_dist_rotationErr();
  drawChart_roll_rotationErr();
}


//  Draw each charts========================================= 

// 0Roll, 1Dist, 2DistErr, 3RotationErr
function drawChart_dist_distErr(){

  var table = new google.visualization.DataView(data_roll_dist_distErr_rotErr);
  
  // Dist, Roll, DistErr
  table.setColumns([1,0,2]);
  var testTable = joinTable(table, angles,"°", 1);
  
  //var chart = new google.charts.Line(document.getElementById('test_angle_DistError'));
  var chart = new google.visualization.LineChart(document.getElementById('single_dist_distError'));
  var options = {
    title: 'Distance - Distance Error',
    width: '100%',
    height: '390',
    hAxis:{
      title: 'Distance from camera to tag (m)',
      gridlines: {
        count: 7
      }
    },
    vAxis: {
      title: 'Distance Error (m)',
      format: 'decimal',
      minValue: '0',
      viewWindow: {
        min: 0,
        max: 0.1
      }
    }

  };
  
  chart.draw(testTable, options);
}


// 0Roll, 1Dist, 2DistErr, 3RotationErr
function drawChart_roll_distErr(){

  var table = new google.visualization.DataView(data_roll_dist_distErr_rotErr);

// SELECT Roll, Dist, DistErr
  table.setColumns([0,1,2]);
  
  var testTable = joinTable(table, dists," m", 1);
  
  //var chart = new google.charts.Line(document.getElementById('test_angle_DistError'));
  var chart = new google.visualization.LineChart(document.getElementById('single_angle_distError'));
  
  var options = {
    title: 'Rotation - Distance Error',
    width: '100%',
    height: '390',
    hAxis:{
      title: 'Rotation Around X Axis (Roll) (deg)',
      gridlines: {
        count: 9
      }
    },
    vAxis: {
      title: 'Distance Error (m)',
      format: 'decimal',
      minValue: '0',
      viewWindow: {
        min: 0,
        max: 0.1
      }
    }

  };
  chart.draw(testTable, options);
  //chart.draw(testTable, google.charts.Line.convertOptions(options));
}

// 0Roll, 1Dist, 2DistErr, 3RotationErr
function drawChart_dist_rotationErr(){
  
  var table = new google.visualization.DataView(data_roll_dist_distErr_rotErr);

// SELECT Dist, Roll, RotationErr
  table.setColumns([1,0,3]);
  
  var testTable = joinTable(table, angles,"°", 1);
  
  //var chart = new google.charts.Line(document.getElementById('test_angle_DistError'));
  var chart = new google.visualization.LineChart(document.getElementById('single_dist_rotationError'));
  
  var options = {
    title: 'Distance - Rotation Error',
    width: '100%',
    height: '390',
    hAxis:{
      title: 'Distance from camera to tag (m)',
      gridlines: {
        count: 7
      }
    },
    vAxis: {
      title: 'Rotation Error (°)',
      format: 'decimal',
      minValue: '0',
      viewWindow: {
        min: 0,
        max: 5
      }
    }

  };
  
  chart.draw(testTable, options);
}

// 0Roll, 1Dist, 2DistErr, 3RotationErr
function drawChart_roll_rotationErr(){

   var table = new google.visualization.DataView(data_roll_dist_distErr_rotErr);

// SELECT Roll, Dist, RotationErr
  table.setColumns([0,1,3]);

  var testTable = joinTable(table, dists," m", 1);
  
  //var chart = new google.charts.Line(document.getElementById('test_angle_DistError'));
  var chart = new google.visualization.LineChart(document.getElementById('single_angle_rotationError'));
  
   var options = {
    title: 'Rotation - Rotation Error',
    width: '100%',
    height: '390',
    hAxis:{
      title: 'Rotation Around X Axis (Roll) (deg)',
      gridlines: {
        count: 7
      }
    },
    vAxis: {
      title: 'Rotation Error (°)',
      format: 'decimal',
      minValue: '0',
      viewWindow: {
        min: 0,
        max: 3.5
      }
    }
  };
  
  chart.draw(testTable, options);
  //chart.draw(testTable, google.charts.Line.convertOptions(options));
}

// Utils ====================================================
// @Params
// data: table, 3 columns. key, variable, value
// array: array of variables
// unit: unit of variables
// column: column of variable
// key: key column index, better be 0
function joinTable(table, array, unit, column){
  var newtable;
  var view;
  var collumnOffset = [];  
  for(var index = 0; index < array.length; index++){
    view = new google.visualization.DataView(table);
    
    //SELECT Roll, Dist, DistErr
    view.setRows(table.getFilteredRows(
      [
        {
          column: column, 
          minValue: array[index], 
          maxValue: array[index]
        }
      ]
    ));
    view.hideColumns([column]);
    
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
      newtable.setColumnLabel(1,array[0].toString()+unit);
    }
    newtable.setColumnLabel(index+1,array[index].toString()+unit);
  }
  
  return newtable;
}

google.setOnLoadCallback(initialize);



