	$(document).ready(function() {
    	$('select').material_select();
  	});
         
	function showPositive(){
		console.log('im in positive');
		// document.getElementById('graph').style.display="none";
		document.getElementById('results').style.display="block";
		document.getElementById('mixedView').style.display="none";
		document.getElementById('negativeView').style.display="none";
		document.getElementById('positiveView').style.display="block";
		document.getElementById('analytics').style.borderTop="solid 7px #00c853";
		console.log("im trying to show Positive");
	};

	function showMixed(){
		document.getElementById('results').style.display="block";
		document.getElementById('positiveView').style.display="none";
		document.getElementById('negativeView').style.display="none";
		document.getElementById('mixedView').style.display="block";
		document.getElementById('analytics').style.borderTop="solid 7px #546e7a";
		console.log("im trying to show showmixed");
	};

	function showNeg(){
		document.getElementById('results').style.display="block";
		document.getElementById('mixedView').style.display="none";
		document.getElementById('positiveView').style.display="none";
		document.getElementById('negativeView').style.display="block";
		document.getElementById('analytics').style.borderTop="solid 7px #ff5252";
		console.log("im trying to show negative");
	};


	$(function () { 
	console.log("hai");
     // Build the chart
 
        $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'User Reviews Toward {Restaurant Name}'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
            	series: {
            	    cursor: 'pointer',
            	    point: {
            	    	events: {
            	            click: function () {
            	               if( this.name == 'Positive'){
            	               		showPositive();
            	               	}
            	               	if( this.name == 'Negative'){
            	               		showNeg();
            	               	}
            	               	if( this.name == 'Mixed'){
            	               		showMixed();

            	               };

            	                 }
            	              }
            	          }
            	  },
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        style:{
                        	fontSize:"20px"
                        }
                    },
                    showInLegend: false
                }
            },
            series: [{
                name: 'Connotation',
                colorByPoint: true,
                data: [{
                    name: 'Positive',
                    y: 56.33,
                    color:'#00c853',
             	}, 
                   {
                    name: 'Negative',
                    y: 14.03,
                    color:'#ff5252'
                	}, 
                {
                    name: 'Mixed',
                    y: 20.38,
                    color:'#546e7a'
                }]
            }]
        });
    });
    


