angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope,$firebaseArray,$state,Servicio,message) {
  
  $scope.devices=message;
  $scope.conectados=[];
  
// 
  $scope.conectar=function(){
    
    var dispositivo=$scope.devices[0];
    ble.connect(dispositivo.id, function(){
        $scope.conectados.push(dispositivo);
      }, function(){
        $scope.conectados.splice(0, 1);
        });
    
    
    
  }
       //Implementar una función que vaya y regrese a otra sección 
  $scope.buscar=function(){
    //$scope.devices=Servicio.datos();
    //$state.go('tab.chats');
  };
  
  
  
})

.controller('ChatsCtrl', function($scope, Chats,$state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.gob=function(){
    
  };

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('NuevoCarroCtrl', function($scope,$firebaseArray,$state) {


})


.controller('DispositivosCtrl', function($scope,$firebaseArray,$state) {
  //Apuntador principal
  var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
     
  $scope.DispositivosBLE = $firebaseArray(dispositivos);
  
  $scope.nuevoDispositivo=function(){
    $state.go("tab.AddCarro");
  }
});
