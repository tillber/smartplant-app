/* Socket setup. */
var socket = io();
var chartData = null;

//Assuming Chart object is within scope or a closure here. ;)
Chart.defaults.rangeBar = Chart.defaults.bar;
console.log(typeof Chart.defaults.rangeBar);
Chart.controllers.rangeBar = 	Chart.controllers.bar.extend({
  calculateBarValuePixels: function(datasetIndex, index) {
    var me = this;
    var chart = me.chart;
    var meta = me.getMeta();
    var scale = me.getValueScale();
    var datasets = chart.data.datasets;
    //Use a range object { min: [Number], max: [Number] } instead of
    //a single value
    //var value = Number(datasets[datasetIndex].data[index]);
    var value = Number(datasets[datasetIndex].data[index].max) - Number(datasets[datasetIndex].data[index].min);
    var stacked = scale.options.stacked;
    var stack = meta.stack;
    //Use the min value of the range object
    //var start = 0;
    var start = Number(datasets[datasetIndex].data[index].min);
    var i, imeta, ivalue, base, head, size;

    if (stacked || (stacked === undefined && stack !== undefined)) {
      for (i = 0; i < datasetIndex; ++i) {
        imeta = chart.getDatasetMeta(i);
        if (imeta.bar &&
          imeta.stack === stack &&
          imeta.controller.getValueScaleId() === scale.id &&
          chart.isDatasetVisible(i)) {
          ivalue = Number(datasets[i].data[index].max);
          if ((value < 0 && ivalue < 0) || (value >= 0 && ivalue > 0)) {
            start += ivalue;
          }
        }
      }
    }
    base = scale.getPixelForValue(start);
    head = scale.getPixelForValue(start + value);
    size = (head - base) / 2;

    return {
      size: size,
      base: base,
      head: head,
      center: head + size / 2
    };
  },
  draw: function() {
    var me = this;
    var chart = me.chart;
    var elements = me.getMeta().data;
    var dataset = me.getDataset();
    var ilen = elements.length;
    var i = 0;
    var d;

    //Since this method was stolen from controller.bar.js, this
    //closure is out of scope.  Reference from the Chart closure
    //instead.
    //helpers.canvas.clipArea(chart.ctx, chart.chartArea);
    Chart.helpers.canvas.clipArea(chart.ctx, chart.chartArea);

    for (; i < ilen; ++i) {
      d = dataset.data[i];
      //Use a range object { min: [Number], max: [Number] }
      //instead of a single value
      //if (d !== null && d !== undefined && !isNaN(d)) {
      if (d !== null && d !== undefined && !isNaN(d.min) && !isNaN(d.max)) {
        elements[i].draw();
      }
    }

    //Since this method was stolen from controller.bar.js, this
    //closure is out of scope.  Reference from the Chart closure
    //instead.
    //helpers.canvas.unclipArea(chart.ctx);
    Chart.helpers.canvas.unclipArea(chart.ctx);
  }
});

var ctx = document.getElementById('myChart').getContext('2d');
var data = {
  labels: ['Moisture (%)', 'pH (pH)', 'Temp (°C)'],
	datasets: [{
			label: 'Actual',
			data: [{min: 0, max: 0}, {min: 0, max: 0}, {min: 0, max: 0}],
			backgroundColor: [
				'rgba(255, 99, 132, 0.8)',
				'rgba(255, 99, 132, 0.8)',
				'rgba(255, 99, 132, 0.8)'
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(255, 99, 132, 1)',
				'rgba(255, 99, 132, 1)'
			],
			borderWidth: 1
		},
		{
			label: 'Preset',
			data: [{min: 10, max: 20}, {min: 10, max: 20}, {min: 10, max: 20}],
			backgroundColor: [
				'rgba(54, 162, 235, 0.8)',
				'rgba(54, 162, 235, 0.8)',
				'rgba(54, 162, 235, 0.8)'
			],
			borderColor: [
				'rgba(54, 162, 235, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(54, 162, 235, 1)'
			],
			borderWidth: 1
		}

		]

};
var options = {
  scaleBeginAtZero: true,
  scales: {
    yAxes: [{
      ticks: {
        min: 0,
        max: 100,
        beginAtZero: false,
        stepSize: 10
      }
    }]
  }
}

var myChart = new Chart(ctx, {
	type: 'rangeBar',
  data: data,
  options: options
});

socket.on('connect', function(){
	console.log('connected');
});
socket.on('broadcast', function(freshData){
	//console.log(freshData);
	myChart.data.datasets[0].data = freshData;
	myChart.update();
});
socket.on('disconnect', function(){});
socket.on('error', (error) => {console.log(error)});
