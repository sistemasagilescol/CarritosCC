angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$firebaseArray,$state, $interval,DeviceFactory) {

 $scope.devices= []; 
 
 $scope.servicio={
    IdServicio:'',
    carroId:'',
    FechaServicio:'',
    HoraInicio: '',
    HoraFin: '',
    Tarifa:0
  }
 
  var Servicios; 
  var ServiciosDB;
 var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
  var carritosDB=$firebaseArray(dispositivos);
 
  $scope.contador=0;
  var timer;
  
$scope.IniciarContador=function(segundos){
    
      timer = $interval(function() {
            $scope.contador++;
          }, 1000);
          
    };
 
 $scope.pararContador=function(){
   $interval.cancel(timer);
 };
 
 $scope.reset=function(){
   $scope.contador=0;
 };
 
  $scope.ManejoServicio=function(){
    
        $interval(function () {
          
           ble.startScan(
              [],
              function(device){
                    $scope.$apply(function() {
                    
                     if(device.name == "ITAG"){
                       var indexCarrito=DeviceFactory.getIndex(device);
                            if(indexCarrito ==-1 || $scope.devices.length == 0){
                              DeviceFactory.addDevice(device);
                              //$scope.devices = DeviceFactory.getDevices();
                            }else{
                              $scope.devices[indexCarrito].rssi=device.rssi;
                             // DeviceFactory.setDevices( $scope.devices);
                            }
                            
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
                    
                    var temporal=DeviceFactory.getDevices();
                    
                    var temporalDB=carritosDB;
                    
                    angular.forEach(temporalDB,function(value,key){
                      var dbValue=value;
                      var noEnt=true;
                      
                        angular.forEach(temporal,function(value,key){
                          var localValue=value;
                          
                          if(noEnt){
                              
                              if(dbValue.id==localValue.id){
                                //dbValue.Estado="Parqueado";
                               // localValue.Estado="Parqueado";
                                noEnt=false;
                              }else{
                                
                                //dbValue.Estado="Servicio";
                                //localValue.Estado="Servicio";
                              }
                          }
                          
                        });
                        
                        if(noEnt == false){
                           dbValue.Estado="Parqueado";
                           dbValue.Timer=0;
                           //$scope.reset();
                        }else{
                          dbValue.Estado="Servicio";
                          dbValue.Timer++;
                          $scope.IniciarContador();
                          //ServiciosDB.$add($scope.carro);
                        }
                        
                    });
                    //cod here to update in apply methos
                     $scope.devices=temporalDB;
                     DeviceFactory.reset();
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
       
       Servicios=new Firebase("https://carritoscc.firebaseio.com/servicios");
       ServiciosDB= $firebaseArray(Servicios);
       
       $scope.ManejoServicio();
 };
 
 $scope.parar=function(){
   ble.stopScan(function(){
     $scope.devices = DeviceFactory.getDevices();}, 
   function(){
     
   });
 };
 
 //Nuevo interface
 
 
})

.controller('ChatsCtrl', function($scope, Chats,$state,$firebaseArray) {
  
  var Servicios = new Firebase("https://carritoscc.firebaseio.com/servicios");
  var ServiciosDB= $firebaseArray(Servicios);
  
  
  
  
  
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

.controller('NuevoCarroCtrl', function($scope,$firebaseArray,$state,$timeout,DeviceFactory){
  
  var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
  var carritosDB=$firebaseArray(dispositivos);
  
  $scope.Mostrar=true;
  
  $scope.nuevosCarros=[];
  $scope.deshabilitado=true;
  

  
  $scope.carro={};
  
  $scope.buscarNuevoCarro=function(){
       //$scope.nuevosCarros=CarritosDB.escanearCarros(2000);
        ble.startScan([],function(device){
          
           $scope.nuevosCarros.push(device);
          
            },function(err){
              
            });
               setTimeout(
                    ble.stopScan,
                    1500,
                    function(){
                      $scope.$apply(function(){
                        
                          var auxiliar=[];
                          var i;
                          
                          angular.forEach(carritosDB, function(value, key){
                            var valueFire=value;
                            angular.forEach($scope.nuevosCarros, function(value, key){
                              var valueLocal=value;
                              
                              if(valueFire.id != valueLocal.id){
                                auxiliar.push(valueLocal);
                                
                              }
                              
                            });
                            
                          });
                          $scope.nuevosCarros=auxiliar;
                          if($scope.nuevosCarros.length!=0){
                               $scope.Mostrar=false;
                               $scope.carro.id=$scope.nuevosCarros[0].id;
                               $scope.carro.nombre=$scope.nuevosCarros[0].name;
                               $scope.carro.string="Agregar";
                        $state.go($state.current,{},{reload:true});
                          }else
                            alert("No hay dispositivos disponibles para agregar");
                        
                      });
                    },
                    function(){
                      // Stopping scan failed
                    }
      );    
  };
  
  
  $scope.addCarro=function(){
    
    
     carritosDB.$add($scope.carro);
   // CarritosDB.addCarrito($scope.carro);
    $state.go("tab.Dispositivos");
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
