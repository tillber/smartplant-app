/* Socket setup. */
var socket = io();
var chartData = null;

function DisplayMsg(msg) {
        $('#console').append('<span class="cmd_line">' + msg + '</span>');
      }

socket.on('connect', function(){DisplayMsg("Connected");});
socket.on('broadcast', function(data){
	//chartData = [JSON.parse(data).humidity, JSON.parse(data).ph, JSON.parse(data).temp, null]
	console.log('Hello World ' + data);
});
socket.on('disconnect', function(){});
socket.on('error', (error) => {console.log(error)});

var ctx = document.getElementById('myChart').getContext('2d');
								var myChart = new Chart(ctx, {
									type: 'bar',
									data: {
										labels: ['Moisture (%)', 'pH (pH)', 'Temp (°C)', 'Light (h)'],
										datasets: [{
											label: 'Actual',
											data: chartData,
											backgroundColor: [
												'rgba(255, 99, 132, 0.8)',
												'rgba(255, 99, 132, 0.8)',
												'rgba(255, 99, 132, 0.8)',
												'rgba(255, 99, 132, 0.8)'
											],
											borderColor: [
												'rgba(255, 99, 132, 1)',
												'rgba(255, 99, 132, 1)',
												'rgba(255, 99, 132, 1)',
												'rgba(255, 99, 132, 1)'
											],
											borderWidth: 1
										},
										{
											label: 'Preset',
											data: [12, 8, 3, 4],
											backgroundColor: [
												'rgba(54, 162, 235, 0.8)',
												'rgba(54, 162, 235, 0.8)',
												'rgba(54, 162, 235, 0.8)',
												'rgba(54, 162, 235, 0.8))'
											],
											borderColor: [
												'rgba(54, 162, 235, 1)',
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
