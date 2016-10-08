angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$firebaseArray,$state, $interval,DeviceFactory) {

  $scope.devices= []; 
 $scope.contador=0;
 
  $scope.ManejoServicio=function(){
    
        $interval(function () {
           
           ble.startScan(
              [],
              function(device){
                    $scope.$apply(function() {
                      var indexCarrito=DeviceFactory.getIndex(device);
                     
                      if(indexCarrito ==-1 || $scope.devices.length == 0){
                        DeviceFactory.addDevice(device);
                        $scope.devices = DeviceFactory.getDevices();
                      }else{
                         $scope.devices[indexCarrito].rssi=device.rssi;
                         DeviceFactory.setDevices( $scope.devices);
                      }
                      });
                
              },
              function(err){
                $scope.$apply(function() {
                          alert("Failed");
                      });
              }
            );
           
           setTimeout(
                ble.stopScan,
                1000,
                function(){
                  $scope.$apply(function(){
                    //$scope.devices = DeviceFactory.getDevices();
                    
                   /* angular.forEach($scope.devices, function(value, key){
                      ble.connect(value.id, function(){
                        alert("Conectado");
                        }, function(){
                         // DeviceFactory.deleteDevice(value);
                        alert("Desconectado");
                          $scope.$apply(function() {
                               
                                //$scope.devices = DeviceFactory.getDevices();
                            });
                        });
                    });*/
                    
                  });
                },
                function(){
                  
                }
            );
      
        }, 1500);
      
  };


 $scope.conectar=function(){

       DeviceFactory.reset();
       
       $scope.devices=DeviceFactory.getDevices();
       
       $scope.ManejoServicio();
   /* ble.startScan(
        [],
        function(device){
            //DeviceFactory.addDevice({ 'id': device.id, 'name': device.name });
              DeviceFactory.addDevice(device);
              
               $scope.$apply(function() {
                    $scope.devices = DeviceFactory.getDevices();
                });
           
        },
        function(err){
           $scope.$apply(function() {
                    alert("Failed");
                });
        }
      );*/
     
     /* setTimeout(
          ble.stopScan,
          1500,
          function(){
            $scope.$apply(function(){
              //$scope.devices = DeviceFactory.getDevices();
              angular.forEach($scope.devices, function(value, key){
                ble.connect(value.id, function(){
                  //alert("Conectado");
                  }, function(){
                    DeviceFactory.deleteDevice(value);
                  
                     $scope.$apply(function() {
                          $scope.devices = DeviceFactory.getDevices();
                      });
                  });
              });
              
            });
          },
          function(){
            // Stopping scan failed
          }
      );*/
       //alert("Que paso?");
   
     // ble.startNotification(device_id, service_uuid, characteristic_uuid, success, failure);
   
 };
 
 $scope.parar=function(){
   ble.stopScan(function(){
     $scope.devices = DeviceFactory.getDevices();}, 
   function(){
     
   });
 }
 
 
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

.controller('NuevoCarroCtrl', function($scope,$firebaseArray,$state,DeviceFactory){
  
  $scope.Mostrar=false;
  
  $scope.nuevosCarros=[];
  $scope.deshabilitado=true;
  
  $scope.carro={};
  
  $scope.buscarNuevoCarro=function(){
       //$scope.nuevosCarros=CarritosDB.escanearCarros(2000);
        ble.startScan([],function(device){
          
           $scope.$apply(function() {
               $scope.nuevosCarros.push(device);
           });
          
            },function(err){
              
            });
            
            //parar en un tiempo determinado
            setTimeout(
                      ble.stopScan,
                      2000,
                      function(){
                        $scope.$apply(function() {
                            if($scope.nuevosCarros.length!=0){
                               $scope.Mostrar=false;
                            }
                        });
                      // alert("Terminado");
                      },
                      function(){
                        
                      }
                  );
  };
  
  
  $scope.addCarro=function(){
    CarritosDB.addCarrito();
  };
  
  
})


.controller('DispositivosCtrl', function($scope,$firebaseArray,$state) {
  //Apuntador principal
  var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
     
  $scope.DispositivosBLE = $firebaseArray(dispositivos);
  
  $scope.nuevoDispositivo=function(){
    $state.go("tab.AddCarro");
  }
});
