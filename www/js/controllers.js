angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope,$firebaseArray) {
  
  $scope.devices=[];
  

  
  
  $scope.buscar=function(){
    
     //$scope.devices.push('Julio: '+Math.floor(Math.random() * 1000) + 4);
     while(true){
      ble.startScan(
          [],
          function(device){
            $scope.devices.push(device);
            alert(device.name);
          },
          function(err){
            alert('Scanning failed. Please try again.');
          }
        );
     }
   // alert($scope.devices.length);
    
    //alert('DEVICES: ' + devices.length);
  };
  
  $scope.addCarrito=function(){
     var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
     
     $scope.DispositivosBLE = $firebaseArray(dispositivos);
     
     $scope.DispositivosBLE.$add({
				Id: "BLE",
				Nombre: "Carrito X"
			});
     
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

.controller('DispositivosCtrl', function($scope,$firebaseArray) {
  //Apuntador principal
  var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
     
  $scope.DispositivosBLE = $firebaseArray(dispositivos);
  
});
