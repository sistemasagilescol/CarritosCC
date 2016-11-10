angular.module('starter.controllers', [])


.controller('loginCtrl',function($scope,$firebaseArray,$firebaseObject,$state,SESION,usuarioServicio){
  
  $scope.loginData={};
  
  $scope.login=function(){
    //alert($scope.loginData.username);
    var usuario=usuarioServicio.obtenerUsuario($scope.loginData.username,$scope.loginData.password)
    
    if( usuario != null){
      
      SESION.data=usuario;
      
      $state.go('tab.dash');
    }else{
      alert("Usuario o contraseña incorrecta");
    }
  }
  
})


.controller('UsuariosCtrl',function($scope,$firebaseArray,$state,usuarioServicio,SESION){
  
  $scope.esconder=true;
  $scope.mensajePermiso="";
  
  if(SESION.data.rol == "Admin"){
    $scope.esconder=false;
  }else{
    $scope.esconder=true;
    $scope.mensajePermiso="NO TIENES PERMISOS DE VER ESTA VISTA";
  }
  
  $scope.listaUsuarios=usuarioServicio.obtenerUsuarios();
  
  $scope.nuevoUsuario={};
  
  $scope.guardarUsuario=function(){
   
    $scope.nuevoUsuario.path="https://carritoscc.firebaseio.com/Ubicacion/" + $scope.nuevoUsuario.centroComercial;
    
    usuarioServicio.GuardarUsuario($scope.nuevoUsuario);
     $state.go('tab.Usuarios');
  } 
  
 $scope.Cancelar=function(){
    $state.go('tab.Usuarios');
  } 
 
 $scope.addUsuario=function(){
   $state.go('tab.NuevoUsuario');
 }
 
})

.controller('DashCtrl', function($scope,$firebaseArray,$state,SESION,Tarifas,$interval,DeviceFactory,DBCarr,Lista) {

 DBCarr.data(SESION.data.centroComercial);
 
 function calculoMinutos(horaInicial,minutosInicial,horaFinal,minutosFinal){
   
   var hora=((horaFinal*60)+minutosFinal)-((horaInicial*60)+minutosInicial);
   
   return hora;
 }
 
 $scope.denegarMantenimiento=false;
 
 // var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
 DeviceFactory.setDevices (DBCarr.ObtenerCarros());
 
 $scope.configuracionCC={};
 
 $scope.devices= DeviceFactory.getDevices();
 
      if(SESION.data.rol != "Admin"){
          
          $scope.denegarMantenimiento=true;
          
        }
 
 
  $scope.ManejoServicio=function(){
    
        $interval(function () {
          
          Lista.reset();
           ble.startScan(
              [],
              function(device){
                    $scope.$apply(function() {
                    
                     if(device.name == "ITAG"){
                       //var indexCarrito=DeviceFactory.getIndex(device);
                       var carrito=DeviceFactory.getDevice(device.id);
                       var t=new Date();
                       carrito.Intimer=true;
                       carrito.timerServicio++;
                       
                            if(carrito!= null && carrito.Mantenimiento && device.rssi > ($scope.configuracionCC.Radio*-0.729) && carrito.timerServicio > ($scope.configuracionCC.TiempoServicio)){
                              carrito.rssi=device.rssi;
                             // Lista.addDevice(carrito);
                              if(carrito.Estado == "Servicio"){
                                 
                                 carrito.HoraFin= t.getHours() + " : " + t.getMinutes();
                                 var inicio=carrito.HoraInicio+" : " + carrito.MinutosInicio;
                                 var dat=t.getDate() +"/"+ (t.getMonth()+1)+"/"+ t.getFullYear();
                                 
                                 var minutosServicio=calculoMinutos(carrito.HoraInicio
                                  ,carrito.MinutosInicio
                                 ,t.getHours(),t.getMinutes()
                                 );
                                 
                                 var pago=0;
                                 
                                 switch(SESION.data.centroComercial){
                                   case "Guajira":
                                      pago=Tarifas.guaj(minutosServicio,carrito.tipo);
                                      break;
                                   case "Mayorca":
                                      pago=Tarifas.mayor(minutosServicio,carrito.tipo);
                                    break;
                                    case "Premium Plaza":
                                      pago=Tarifas.prem(minutosServicio,carrito.tipo);
                                    break;
                                    case "Yopal":
                                      pago=Tarifas.yop(minutosServicio,carrito.tipo);
                                    break;
                                 }
                                 
                                 var objeto={usuario:SESION.data.nombre,cobro:pago,
                                 fecha:dat,duracion:minutosServicio,horaInicial:inicio,
                                 horaFinal:carrito.HoraFin};
                                 
                                  DBCarr.addService(carrito.$id,objeto,SESION.data.centroComercial);
                                
                                 carrito.timer=0;
                              }else if(carrito.Estado == "Estacionado"){
                                carrito.timer=0;
                              }
                              
                              carrito.timer=0;
                              carrito.Analizado=true;
                              carrito.Estado="Estacionado";
                              carrito.timerServicio=0;
                              carrito.HoraInicio=t.getHours() ;//+ " : " + t.getMinutes();
                              carrito.MinutosInicio=t.getMinutes();
                              
                              if(carrito.tiempEsta==0){
                                 DBCarr.ActualizarCarro(carrito);
                                 carrito.tiempEsta++;
                              }
                             
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
                2000,
                function(){
                  
                  angular.forEach($scope.devices,function(value,key){
                   // var carrito=Lista.getDevice(value.id);
                    //var carrito=DeviceFactory.getDevice(value.id);
                   
                    if(value.Analizado == false && value.Mantenimiento && value.Estado != "DB"){
                      // var t=new Date();
                      if(value.Intimer != true){
                        value.timerServicio=0;
                      }
                      
                      value.timer++;
                      if(value.timer > ($scope.configuracionCC.TiempoSalida) && value.Intimer != true){
                        value.Estado="Servicio";
                        //value.Intimer=false;
                        
                        DBCarr.ActualizarCarro(value);
                        
                        value.tiempEsta=0;
                        value.timer=0;
                       // value.timerServicio=0;
                      }
                      
                    }else if(value.Mantenimiento == false){
                       value.Estado="Mantenimiento";
                       value.timer=0;
                    }
                    value.Analizado = false;
                    value.Intimer=false;
                  });
                  
                },
                function(){
                }
            );
        }, 2500);
  };
  
 $scope.conectar=function(){
        
      // DeviceFactory.reset();
       //$window.location.reload();
       DBCarr.ActualizarEstado("DB");
       var configuracion=DBCarr.ObtenerConfiguracion(SESION.data.centroComercial);
       
       configuracion.$loaded().then(function (){
        $scope.configuracionCC=configuracion;
      });
       
        $scope.ManejoServicio();
 };
 
 $scope.parar=function(){
   if (confirm("Seguro quieres cerrar la app ")) {
      //DBCarr.ActualizarEstado("DB");
      ionic.Platform.exitApp(); 
      window.close();
    }
 };
 
})

.controller('ChatsCtrl', function($scope, DBCarr,$state,$firebaseArray) {
    
    
   $scope.Carros=DBCarr.ObtenerCarros();
      
   $scope.EnviarCorreo = function() {
  };
  
})

.controller('DetalleDispCtrl',function($scope,$stateParams,$firebaseArray,DBCarr,FiltroServicios){

   $scope.Carro=DBCarr.getCar($stateParams.dispId);
   $scope.dispositivo=$scope.Carro.Nombre;
   
   var fecha=new Date();
   
   $scope.fechaActual=fecha.getDate() +"/"+ (fecha.getMonth()+1)+"/"+ fecha.getFullYear();;
   
   var provicional=[];
   
   angular.forEach( $scope.Carro.Servicios,function(value,key){
     
     if(value.fecha==$scope.fechaActual){
      provicional.push(value);
     }
   }
   )
   FiltroServicios.setservicios(provicional);
   $scope.Servicios = FiltroServicios.getServices();
   
   
   
   
    
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('NuevoCarroCtrl', function($scope,$firebaseArray,$state,$timeout,DeviceFactory,DBCarr){
  
  //var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Ubicacion/Premium Plaza/Dispositivos");
  //var carritosDB=$firebaseArray(dispositivos);
  
  //var carritosDB=DBCarr.ObtenerCarros();
  
  $scope.Mostrar=true;
  
  //$scope.nuevosCarros=[];
  //$scope.deshabilitado=true;
  
  $scope.carro={};
  
  $scope.buscarNuevoCarro=function(){
       //$scope.nuevosCarros=CarritosDB.escanearCarros(2000);
        ble.startScan([],function(device){
            
           if(DBCarr.getCar(device.id) == null && $scope.Mostrar){
                $scope.$apply(function(){
                  $scope.carro.id=device.id;
                  $scope.Mostrar=false;
              });
           }
           
            },function(err){
              
            });
               setTimeout(
                    ble.stopScan,
                    1500,
                    function(){
                     /* $scope.$apply(function(){
                        
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
                      });*/
                    },
                    function(){
                    }
      );    
  };
  
  
  $scope.addCarro=function(){
    $scope.carro.Analizado=false;
    $scope.carro.Estado="DB";
    $scope.carro.Mantenimiento=true;
     $scope.carro.timer=0;
     
   DBCarr.addCarro($scope.carro);
   $state.go("tab.Dispositivos");
  };
  
})

//ConfigCtrl
.controller('ConfigCtrl', function($scope,$firebaseObject,$state,SESION) {
  
  var referenciaDb=new Firebase("https://carritoscc.firebaseio.com/Ubicacion/"+SESION.data.centroComercial+"/Configuracion");
  $scope.configuracion=$firebaseObject(referenciaDb);
  
  $scope.mensajePermiso="";
  $scope.esconder=false;
  
  $scope.Verificar=function(){
    $scope.configuracion.$save();
    alert("Cambios guardados");
  }
  
  
})

.controller('DispositivosCtrl', function($scope,$firebaseArray,SESION,$state,DBCarr) {

   $scope.DispositivosBLE=DBCarr.ObtenerCarros();
   $scope.CentroComercial=SESION.data.centroComercial;
  $scope.nuevoDispositivo=function(){
    $state.go("tab.AddCarro");
    
  }
});
