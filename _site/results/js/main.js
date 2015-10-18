google.load("visualization", "1.1", {packages:['table','corechart','line']});

var dists = [0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5];
var angles = [0,10,20,30,40,50,60,70,80];
var data;

function initialize() {
  var opts = {sendMethod: 'auto'};
  
  
  var queryAll = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=', opts);

  // Optional request to return only column C and the sum of column B, grouped by C members.
  queryAll.setQuery("SELECT Roll, Dist, DistErr FROM 167MneM1hnWPIv7N7OwrAz9gXMzxJHl8HA0TFXsI3 WHERE Pitch = 0 AND Layout = 'Single' ");

//http://www.google.com/fusiontables/gvizdata?tq=SELECT Roll, DistErr FROM 167MneM1hnWPIv7N7OwrAz9gXMzxJHl8HA0TFXsI3 WHERE Pitch = 0 AND Layout = 'Single' AND Dist = 0.3
  queryAll.send(drawSingleAngle_DistError);
  
}


//TEST

function drawSingleAngle_DistError(response){
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  data = response.getDataTable();
  data.sort(0);
  
  // Dist 0.3
  var view = new google.visualization.DataView(data);

  //SELECT Roll, Dist, DistErr
  view.setRows(data.getFilteredRows([
    {column: 1, minValue: 0.3 , maxValue: 0.3}
  ]));
  view.hideColumns([1]);
  
  // Dist 0.5
   var view1 = new google.visualization.DataView(data);

  //SELECT Roll, Dist, DistErr
  view1.setRows(data.getFilteredRows([
    {column: 1, minValue: 0.5 , maxValue: 0.5}
  ]));

  view1.hideColumns([1]);
  
  // Dist 0.7
  var view2 = new google.visualization.DataView(data);

  //SELECT Roll, Dist, DistErr
  view2.setRows(data.getFilteredRows([
    {column: 1, minValue: 0.7 , maxValue: 0.7}
  ]));

  view2.hideColumns([1]);
  
  var newtable = google.visualization.data.join(view, view1, 'inner', [[0,0]], [1], [1]);
  var newtable1 = google.visualization.data.join(view2, newtable, 'inner', [[0,0]], [1],[1,2]);
  
  var chart = new google.charts.Line(document.getElementById('test_angle_DistError'));
  
  var options = {
    title: 'Company Performance',
    width: '100%',
    height: '390',
    hAxis:{
      title: 'Rotation Around X Axis (Roll) (deg)'
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
  
  var testTable = joinTable(dist,"m", 1, 0);
  
  chart.draw(testTable, google.charts.Line.convertOptions(options));
}

function joinTable(array, unit, column, key){
  var newtable;
  var view;
  var collumnOffset = [];  
  for(var index = 0; index < array.length; index++){
    view = new google.visualization.DataView(data);
    
    //SELECT Roll, Dist, DistErr
    view.setRows(data.getFilteredRows([
      {column: column, minValue: array[index], maxValue: array[index]}
    ]));
    view.hideColumns([column]);
    
    if(index == 0)
    {
      newtable = view;
      continue;
    }
    
    //first index here is 1
    collumnOffset.push(index);
    newtable = google.visualization.data.join(newtable, view, 'left', [[key,key]], collumnOffset, [1]);
    if(index == 1){
      // index = 1 newtable is a view, can not assign column label
      newtable.setColumnLabel(1,array[0].toString()+unit);
    }
    newtable.setColumnLabel(index+1,array[index].toString()+unit);
  }
  
  return newtable;
}

google.setOnLoadCallback(initialize);



