var piePositive = 33.00;
var pieNegative = 33.00;
var pieMixed = 33.00;
var pollChart;	
var posPercentage;
var negPercentage;
var mixedPercentage;
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

            $scope.loadedData = false;
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
                  url: $location.path(),
                  method: "POST",
                  data: data,
                  dataType: 'jsonp'
                }).success(function(response) {
                  console.log(response);
                });


              }
             
              $scope.checkPages = function()
              {

                MyYelpAPI.retrieveYelp("", "", $scope.url, function(data) {
                  //  $scope.businesses = data.businesses;
                  $scope.name = data.name;
                  //var url = 'http://www.yelp.com/biz/' + $scope.place + '-' + $scope.city;
                  //$scope.url = url.replace(/\s+/g, '-').toLowerCase();
                  $scope.city = data.location.city;
                    $scope.place = data.name;
                  var data = {
                    "url": $scope.url,
                    "num": $scope.num
                  }

                  $http({
                    url: $location.path(),
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
                    for(var i=0; i < response['keywords']['results'].length; i++) {
                      if(response['keywords']['results'][i]['sentiment']['mixed']) {
                        totals['mixed']++;
                      } else {
                        totals[response['keywords']['results'][i]['sentiment']['type']]++;
                      }
                      terms[response['keywords']['results'][i]['text']] = {'wordCount': 0, 'relevance': response['keywords']['results'][i]['relevance']};
                    }

                    var total = totals['mixed'] + totals['positive'] + totals['negative'];
                    piePositive = totals['positive']; //(totals['positive']/total * 100).toFixed(0);
                    pieNegative = totals['negative'];//(totals['negative']/total * 100).toFixed(0);
                    pieMixed = totals['negative']; //(totals['mixed']/total * 100).toFixed(0);

                    pollChart.series[0].setData([piePositive, pieNegative, pieMixed]);

                    // console.log('Stuff:' + piePositive + 'Neg: ' + pieNegative + ' Mixed: ' + pieMixed );
                    // console.log(total);
                    // console.log(totals);
                    // console.log(terms);
                  });

                })
                pollChart.redraw();
                console.log('redraw');
              
                
                

              }

              $scope.checkCity = function()
              {
                MyYelpAPI.retrieveYelp($scope.city, $scope.place, "", function(data) {
                  //  $scope.businesses = data.businesses;
                  $scope.name = data.name;
                  var url = 'https://www.yelp.com/biz/' + $scope.place + '-' + $scope.city;
                  $scope.url = url.replace(/\s+/g, '-').toLowerCase();
                  $scope.city = data.location.city;
                  $scope.data = data;
                  $scope.loadedData = true;
                  $scope.terms = {};

                  var data = {
                    "url": $scope.url,
                    "num": $scope.num
                  }

                  $http({
                    url: $location.path(),
                    method: "POST",
                    data: data,
                    dataType: 'jsonp'
                  }).success(function(response) {
                    console.log(response);
                    var totals = [];
                    var terms = {};
                    terms['positive']=[];
                    terms['negative']=[];
                    terms['mixed']=[];
                    terms['neutral']=[];
                    for(var i=0; i < response['keywords']['results'].length; i++) {
                      if(response['keywords']['results'][i]['sentiment']['mixed']) {
                        terms['mixed'].push({'word':response['keywords']['results'][i]['text'],'wordCount': 0, 'relevance': response['keywords']['results'][i]['relevance'], 'review': response['reviews'][response['keywords']['results'][i]['text']]});
                      } else {
                        terms[response['keywords']['results'][i]['sentiment']['type']].push({'word':response['keywords']['results'][i]['text'],'wordCount': 0, 'relevance': response['keywords']['results'][i]['relevance'], 'review': response['reviews'][response['keywords']['results'][i]['text']]});
                      }
                      // terms[response['keywords']['results'][i]['text']] = {'wordCount': 0, 'relevance': response['keywords']['results'][i]['relevance']};
                    }

                    $scope.terms = terms;
                    // alert(terms['positive'].length);
                    // alert($scope.terms.positive.length)
                    var total = terms['mixed'].length + terms['positive'].length + terms['negative'].length;
                    piePositive = terms['positive'].length; //(totals['positive']/total * 100).toFixed(0);
                    pieNegative = terms['negative'].length;//(totals['negative']/total * 100).toFixed(0);
                    pieMixed = terms['mixed'].length; //(totals['mixed']/total * 100).toFixed(0);
                    
                    //get percentage
                    posPercentage = parseInt((piePositive/total)*100);
                    negPercentage = parseInt((pieNegative/total)*100);
                    mixedPercentage = parseInt((pieMixed/total)*100);

                  $scope.posPercentage = posPercentage;
                  $scope.negPercentage = negPercentage;
                  $scope.mixedPercentage = 100 - (negPercentage+posPercentage);

                    console.log("this is pos % "+posPercentage);

                    pollChart.series[0].setData([piePositive, pieNegative, pieMixed]);

                    // console.log('Stuff:' + piePositive + 'Neg: ' + pieNegative + ' Mixed: ' + pieMixed );
                    // console.log(total);
                    // console.log(totals);
                    console.log($scope.terms);
                  });

                })

              }

            }]).factory("MyYelpAPI", function($http) {
              return {
                "retrieveYelp": function(city, place, givenUrl, callback) {
                  var method = 'GET';
                  var url = "";
                  if(!givenUrl)
                  {
                  url = 'https://api.yelp.com/v2/business/' + place + '-' + city;
                  url = url.replace(/\s+/g, '-').toLowerCase();
                }
                else
                {
                  var end = givenUrl.split("biz/")[1];
                  url = 'https://api.yelp.com/v2/business/' + end;
                  url = url.replace(/\s+/g, '-').toLowerCase();

                }
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
                      $http.jsonp(url, {params: params}).success(callback).error(

                          function (data,status,headers, config)
                          {
                            alert("Could not find Business. Try again");
                            location.reload();
                          }
                        );
                    }
                  }
                });


    $(document).ready(function() {
    	$('select').material_select();
      $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
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
                text: 'Distribution of Keyword Connotations'
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
                    showInLegend: false,
                    colorByPoint: true,
                    data: [
                        ['Positive', piePositive],
                        ['Negative', pieNegative],
                        ['Mixed', pieMixed]
                    ]
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



    


