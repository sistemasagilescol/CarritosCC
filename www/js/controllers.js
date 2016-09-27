angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope) {
  
  $scope.devices=[{name:"Julio"}];
  $scope.data={};
  $scope.name = "";
  
  $scope.buscar=function(){
    
    $scope.data.name=$scope.name;
    $scope.devices.push($scope.data);

  
     /*ble.startScan(
        [],
        function(device){
          devices.push(device);
          alert(device);
        },
        function(err){
          alert('Scanning failed. Please try again.');
        }
      );*/
    alert($scope.devices.length);
    
    //alert('DEVICES: ' + devices.length);
  }
  
 /* $scope.scan = function(){
      ble.startScan(
        [],
        function(device){
          if(device.name){
            DeviceFactory.addDevice({ 'id': device.id, 'name': device.name });
          }
        },
        function(err){
          alert('Scanning failed. Please try again.');
        }
      );

      setTimeout(
          ble.stopScan,
          1500,
          function(){
            $scope.$apply(function(){
              $scope.devices = DeviceFactory.getDevices();
            });
          },
          function(){
            // Stopping scan failed
          } );}*/
  
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
