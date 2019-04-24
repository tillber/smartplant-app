/* Socket setup. */
var socket = io();
var chartData = null;

var ctx = document.getElementById('myChart').getContext('2d');
myChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: ['Moisture (%)', 'pH (pH)', 'Temp (°C)'],
		datasets: [{
			label: 'Actual',
			data: [0, 0, 0],
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
			data: [12, 8, 3],
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
	},
	options: {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		}
	}
});

socket.on('connect', function(){
	console.log('connected');
});
socket.on('broadcast', function(freshData){
	myChart.data.datasets[0].data = freshData;
	myChart.update();
});
socket.on('disconnect', function(){});
socket.on('error', (error) => {console.log(error)});
