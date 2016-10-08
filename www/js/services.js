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
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

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
