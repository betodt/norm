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
                loadCourses();
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
