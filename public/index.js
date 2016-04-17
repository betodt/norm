var piePositive = 70.00;
var pieNegative = 21.00;
var pieMixed = 9.00;
var pollChart;	
          function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
              return result;
          }

          var app = angular.module('plunker', []);

          app.controller('MainCtrl', ['$scope', '$http', 'MyYelpAPI', function($scope, $http, MyYelpAPI) {
            $scope.city = "";
            $scope.url = "";
            $scope.numResult = "";
            $scope.businesses = [];
              /*
              MyYelpAPI.retrieveYelp($scope.city, function(data) {
                  //$scope.businesses = data.businesses;
                  $scope.thing = data.url;

              });
              */
              function loadCourses()
              {

                var data = {
                  "url": $scope.url,
                  "num": $scope.num
                }

                $http({
                  url: "http://localhost:3000",
                  method: "POST",
                  data: data,
                  dataType: 'jsonp'
                }).success(function(response) {
                  console.log(response);
                });


              }
              $scope.checkPages = function()
              {
                pollChart.redraw();
                console.log('redraw');
              }

              $scope.checkCity = function()
              {
                MyYelpAPI.retrieveYelp($scope.city, $scope.place, function(data) {
                  //  $scope.businesses = data.businesses;
                  $scope.name = data.name;
                  var url = 'http://www.yelp.com/biz/' + $scope.place + '-' + $scope.city;
                  $scope.url = url.replace(/\s+/g, '-').toLowerCase();
                  $scope.city = data.location.city;

                  var data = {
                    "url": $scope.url,
                    "num": $scope.num
                  }

                  $http({
                    url: "http://localhost:3000",
                    method: "POST",
                    data: data,
                    dataType: 'jsonp'
                  }).success(function(response) {
                    console.log(response);
                    var totals = [];
                    totals['mixed'] = 0;
                    totals['positive'] = 0;
                    totals['negative'] = 0;
                    totals['neutral'] = 0;
                    var terms = {};
                    for(var i=0; i < response.length; i++) {
                      if(response[i]['sentiment']['mixed']) {
                        totals['mixed']++;
                      } else {
                        totals[response[i]['sentiment']['type']]++;
                      }
                      terms[response[i]['text']] = {'wordCount': 0, 'relevance': response[i]['relevance']};
                    }

                    var total = totals['mixed'] + totals['positive'] + totals['negative'];
                    piePositive = (totals['positive']/total * 100.00).toFixed(2);
                    pieNegative = (totals['negative']/total * 100.00).toFixed(2);
                    pieMixed = (totals['mixed']/total * 100.00).toFixed(2);

                    pollChart.series[0].setData([{
                    name: 'Positive',
                    y: piePositive,
                    color:'#00c853',
                }, 
                   {
                    name: 'Negative',
                    y: 10.00,
                    color:'#ff5252'
                    }, 
                {
                    name: 'Mixed',
                    y: pieMixed,
                    color:'#546e7a'
                }], false);

                    console.log('Stuff:' + piePositive + 'Neg: ' + pieNegative + ' Mixed: ' + pieMixed );
                    console.log(total);
                    console.log(totals);
                    console.log(terms);
                  });

                })
                

              }

            }]).factory("MyYelpAPI", function($http) {
              return {
                "retrieveYelp": function(city, place, callback) {
                  var method = 'GET';
                  var url = 'http://api.yelp.com/v2/business/' + place + '-' + city;
                  url = url.replace(/\s+/g, '-').toLowerCase();
                  var params = {
                    callback: 'angular.callbacks._0',
                              //location: name,
                              oauth_consumer_key: 'qMj5sRZLW9kQUi38bKOwUw', //Consumer Key
                              oauth_token: 'RhLXlRw4QJ4HQmjf_cex5DhYT72AwUOf', //Token
                              oauth_signature_method: "HMAC-SHA1",
                              oauth_timestamp: new Date().getTime(),
                              oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                              //term: 'food'
                            };
                      var consumerSecret = 'uTaJUJ2biBlQ1KeIWWgOcgQ4wq0'; //Consumer Secret
                      var tokenSecret = 'kRWZv_OO8-pwG4mdIjr0SxkO5c0'; //Token Secret
                      var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
                      params['oauth_signature'] = signature;
                      $http.jsonp(url, {params: params}).success(callback);
                    }
                  }
                });


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

        pollChart = new Highcharts.Chart({
            chart: {
                renderTo: container,
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
                    y: piePositive,
                    color:'#00c853',
             	}, 
                   {
                    name: 'Negative',
                    y: pieNegative,
                    color:'#ff5252'
                	}, 
                {
                    name: 'Mixed',
                    y: pieMixed,
                    color:'#546e7a'
                }]
            }]
        });
    });



    


