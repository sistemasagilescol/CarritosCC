angular.module('starter.services', [])

.service('Servicio',function(){
   var Dispositivos= [];
  
  this.datos=function(){
    ble.scan(
          [],2,
          function(device){
            Dispositivos.push(device);
          },
          function(err){
            //alert('Scanning failed. Please try again.');
          }
        );
    
    return Dispositivos;
  };
})

.factory('CarritosDB',function($firebaseArray){
  var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Dispositivos");
  
    var carritosDB=$firebaseArray(dispositivos);
  var carritoScan=[];
  
  return {
    addCarrito: function(carrito){
      carritosDB.$add(carrito);
    },
    getCarritosDB:function(){
      return carritosDB;
    },
    escanearCarros:function(milisegundos){
     
      ble.startScan([],function(device){
        
        carritoScan.push(device);
      },function(err){
        
      });
      //parar en un tiempo determinado
      setTimeout(
                ble.stopScan,
                2000,
                function(){
                 
                 // alert("Terminado");
                },
                function(){
                  
                }
            );
      
      return carritoScan;
      
    }
    
  }
})

.factory('DBCarr',function($firebaseArray){
  
   var dispositivos = new Firebase("https://carritoscc.firebaseio.com/Ubicacion/Premium Plaza/Dispositivos");
   var carritosDB=$firebaseArray(dispositivos);
   
  return {
    ObtenerCarros : function(){
       return carritosDB;
    },
    addCarro:function(carro){
      carritosDB.$add(carro);
    },
    getCar: function(id){
      var i;
      var CarroEncontrado;
      
      for (i=0;i<carritosDB.length;i++){
        if(carritosDB[i].id == id){
          CarroEncontrado=carritosDB[i];
        }
      }
      
      return CarroEncontrado;
      
    }
  };
})


  .factory('DeviceFactory', function DeviceFactory(){
    var devices = [];
    return {
      addDevice: function(device){
        devices.push(device);
      },
     deleteDevice:function(device){
       var index=devices.indexOf(device);
       devices.splice(index,1);
     },
      getDevices: function(){
        return devices;
      },
      setDevices: function(dispositivos){
        devices=dispositivos;
      },
      getIndex:function(elemento){
        var valor=-1;
        var iterador; 
        
        for(iterador=0;iterador< devices.length;iterador++){
          
            if(devices[iterador].id==elemento.id){
              valor=iterador;
            }
        }
       
        return valor;
        
      },
      getDevice: function(id){
        var device_found = devices.filter(function(device){
          return device.id == id;
        });
        return device_found[0];
      },

      reset: function(){
        devices = [];
      }

    };
  })

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
