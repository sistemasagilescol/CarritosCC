angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$firebaseArray,$state, $interval,DeviceFactory) {

 $scope.devices= []; 
 /*
 $scope.servicio={
    IdServicio:'',
    carroId:'',
    FechaServicio:'',
    HoraInicio: '',
    HoraFin: '',
    Tarifa:0
  }*/
 
  var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
  var carritosDB=$firebaseArray(dispositivos);
  //$scope.contador=0;
  //var timer;
  
/*$scope.IniciarContador=function(segundos){
    
      timer = $interval(function() {
            $scope.contador++;
          }, 1000);
          
    };
 
 $scope.pararContador=function(){
   $interval.cancel(timer);
 };*/
 
 /*$scope.reset=function(){
   $scope.contador=0;
 };*/
 
 
 $scope.obtenerHoraInicio=function(horaFinal,minutosFinal,tiempoDuracion){
   
     var demora=(tiempoDuracion/60)/60;
     
     var horaActual = horaFinal+(minutosFinal/60);
     
     var diferencia=horaActual-demora;
     
     var horas=Math.floor(diferencia);
     
     var minutos=diferencia-Math.floor(diferencia);
     
     var minutosFinales=Math.floor(minutos*60);
     
   return horas+":"+minutosFinales;
 }
 
 
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
                $scope.$apply(function(){
                          alert("Failed");
                      }); 
              }
            );
           
           setTimeout(
                ble.stopScan,
                1000,
                function(){
                  
                  $scope.$apply(function(){
                    
                    //var temporal=DeviceFactory.getDevices();
                    
                    //var temporalDB=carritosDB;
                    
                    angular.forEach(carritosDB,function(value,key){
                      var dbValue=value;
                      //var noEnt=true;
                      
                      var idFound=DeviceFactory.getIndex(dbValue);
                      
                      if(idFound != -1){
                        
                        dbValue.Estado="Parqueado";
                        var precio= (dbValue.Timer/60)*1000;
                        
                          if(precio!=0 && dbValue.Timer>1){
                            
                            var nref2 = new Firebase("https://carritoscc.firebaseio.com/Dispositivos/" +dbValue.$id+"/Servicios/");
                            //var carritosDB=$firebaseArray(dispositivos);
                              var postsRef=$firebaseArray(nref2);
                              
                             var dat=new Date();
                            /* var CurrentDate=dat.getDay()+"-"+ meses[dat.getMonth()]+"-"+dat.getFullYear();
                             var hora=dat.getHours();
                             var minutos=dat.getMinutes();
                             var Horainicial= $scope.obtenerHoraInicio();
                              */
                              
                             postsRef.$add({
                                      Fecha: dat.getDay()+"-"+dat.getMonth()+"-"+dat.getFullYear(),
                                      horainicio: dat.getHours(),
                                      horafinal: dat.getHours()+":"+dat.getMinutes(),//hora +":"+minutos,
                                      duracion: Math.round((dbValue.Timer/60) * 100) / 100 ,
                                      Cobro: precio
                                    }); 
                            
                          }
                          dbValue.Timer=0;
                      }else{
                        dbValue.Estado="Servicio";
                        dbValue.Timer++;
                      } 
                    });
                    //cod here to update in apply methos
                     $scope.devices=carritosDB;
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

.controller('ChatsCtrl', function($scope, DBCarr,$state,$firebaseArray) {
  
      //var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
     // $scope.Carros= $firebaseArray(dispositivos);
      
      $scope.Carros=DBCarr.ObtenerCarros();
  //$scope.chats = Chats.all();
   $scope.EnviarCorreo = function() {
     
     var mensaje="";
     var i;
     var i2;
     
     var fecha=new Date();
   
   
     
    /* for(i=0;i<$scope.Carros.length;i++){
       var servicios=$scope.Carros[i].Servicios;
        mensaje=mensaje+"\n Servicio, Dispositivo "+$scope.Carros[i].Nombre +" : \n";
       // alert(mensaje);
        alert(servicios.length);
       for (i2=0;i2<servicios.length;i2++){
         alert((fecha.getDay()+"-"+fecha.getMonth()+"-"+fecha.getFullYear()));
         if((fecha.getDay()+"-"+fecha.getMonth()+"-"+fecha.getFullYear())==servicios[i2].Fecha){
           mensaje=mensaje+" Fecha: "+servicios[i2].Fecha+"\n";
           mensaje=mensaje+" Hora Servicio: "+ servicios[i2].horafinal+"\n";
           mensaje=mensaje+" Duración Servicio: "+ servicios[i2].duracion+"\n";
           alert(mensaje);
         }
       }
     }*/
     
     
       /* if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Consolidado dia", // Subject
            mensaje,                      // Body
            ["sistemasagilescol@gmail.com"],    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }*/
  };
  
})

.controller('DetalleDispCtrl',function($scope,$stateParams,$firebaseArray,DBCarr){

  // $scope.dispositivo=$stateParams.dispId;
   
   $scope.Carro=DBCarr.getCar($stateParams.dispId);
   $scope.dispositivo=$scope.Carro.Nombre;
   
   $scope.servicios=  $scope.Carro.Servicios;
   
   
   /*var demora=(1680/60)/60;
     
     var horaActual = dat.getHours()+(dat.getMinutes()/60);
     
     var diferencia=horaActual-demora;
     
     var horas=Math.floor(diferencia);
     
     var minutos=diferencia-Math.floor(diferencia);
     
     var minutosFinales=Math.floor(minutos*60);
     
     alert(dat.getDay()+"-"+ meses[dat.getMonth()]+"-"+dat.getFullYear());
     
   }*/
    
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
