angular.module('starter.services', [])

.service('Lista',function(){
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

.factory("SESION", function() {
  return {
    data: {}
  };
})


.factory('usuarioServicio',function($firebaseArray){
  var refUsuarios=new Firebase("https://carritoscc.firebaseio.com/Usuarios");
  var usuarios=$firebaseArray(refUsuarios);
  
  var usuarioActual;
  
  return{
    obtenerUsuarios: function(){
      return usuarios;
    },
    
    GuardarUsuario:function(usuario){
      usuarios.$add(usuario);
    },
    
    obtenerUsuario:function(usuario,contrasena){
      var i;
      
      for (i=0;i<usuarios.length;i++){
        if(usuarios[i].usuario == usuario && usuarios[i].contrasena == contrasena){
          usuarioActual=usuarios[i];
        }
      }
      
      return usuarioActual;
    },
    setUsuario:function(user){
      usuarioActual=user;
    },
    obtenerUsuarioActual: function(){
      return usuarioActual;
    }
    
  }
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

.factory('Tarifas',function($firebaseArray){
  
  var guajira=[{t15:7000,t30:10000,t45:15000,t60:18000,tm:300},
  {t15:7000,t30:10000,t45:15000,t60:18000,tm:300},
  {t15:5000,t30:7000,t45:9000,t60:12000,tm:200}];
  
   var mayorca=[{t15:7000,t30:10000,t45:15000,t60:18000,tm:300},
  {t15:5000,t30:7000,t45:9000,t60:12000,tm:200}];
  
   var premium=[{t15:9000,t30:14000,t45:19000,t60:22000,tm:367},
  {t15:7000,t30:10000,t45:15000,t60:18000,tm:300},
  {t15:5000,t30:7000,t45:9000,t60:12000,tm:200}];
  
   var yopal=[{t15:7000,t30:10000,t45:15000,t60:18000,tm:300},
  {t15:7000,t30:10000,t45:15000,t60:18000,tm:300},
  {t15:5000,t30:7000,t45:9000,t60:12000,tm:200}];
  
  return {
    guaj:function(duracion,tipo){
      var index=0;
      var final;
      
     switch(tipo){
       case "Carro manual":
        index=2;
        break;
       case "Carro Animal":
        index=0;
        break;
       case "Carro Electrico":
        index=1;
        break;
     }
      
     
     if(duracion>=0 && duracion<=15){
        final=guajira[index].t15;
      }else if(duracion<=30){
        final=guajira[index].t30;
      }else if(duracion<=45){
        final=guajira[index].t45;
      }else if(duracion<=60){
        final=guajira[index].t60;
      }else{
        final=guajira[index].t60+((duracion-60)*guajira[index].tm);
      }
      return final;
    },
    mayor:function(duracion,tipo){
      var index=0;
      var final;
      
     switch(tipo){
       case "Carro manual":
        index=1;
        break;
       case "Carro Animal":
        index=0;
        break;
     }
      
     
     
     if(duracion>=0 && duracion<=15){
        final=mayorca[index].t15;
      }else if(duracion<=30){
        final=mayorca[index].t30;
      }else if(duracion<=45){
        final=mayorca[index].t45;
      }else if(duracion<=60){
        final=mayorca[index].t60;
      }else{
        final=mayorca[index].t60+((duracion-60)*mayorca[index].tm);
      }
     
      return final;
    },
    
    yop:function(duracion,tipo){
      var index=0;
      var final;
     switch(tipo){
       case "Carro Electrico":
        index=1;
        break;
       case "Carro manual":
        index=2;
        break;
       case "Carro Animal":
        index=0;
        break;
     }
     
     if(duracion>=0 && duracion<=15){
        final=yopal[index].t15;
      }else if(duracion<=30){
        final=yopal[index].t30;
      }else if(duracion<=45){
        final=yopal[index].t45;
      }else if(duracion<=60){
        final=yopal[index].t60;
      }else{
        final=yopal[index].t60+((duracion-60)*yopal[index].tm);
      }
      return final;
    },
    
    
    prem:function(duracion,tipo){
      var index=0;
      var final;
      
     switch(tipo){
       case "Carro Electrico":
        index=1;
        break;
       case "Carro manual":
        index=2;
        break;
       case "Carro Camioneta":
        index=0;
        break;
     }
     
     if(duracion>=0 && duracion<=15){
        final=premium[index].t15;
      }else if(duracion<=30){
        final=premium[index].t30;
      }else if(duracion<=45){
        final=premium[index].t45;
      }else if(duracion<=60){
        final=premium[index].t60;
      }else{
        final=premium[index].t60+((duracion-60)*premium[index].tm);
      }
      return final;
    }
    
  }
})

.factory('DBCarr',function($firebaseArray,$firebaseObject){
   var dispositivos;
   var carritosDB;
   
   var referenciaTarifas;
    var tarifas;
   
  return {
    data:function(cc){
      dispositivos =new Firebase("https://carritoscc.firebaseio.com/Ubicacion/"+cc+"/Dispositivos");
      carritosDB=$firebaseArray(dispositivos);
    },
    ObtenerCarros : function(){
       return carritosDB;
    },ActualizarCarro:function(carrito){
      
      carritosDB.$save(carrito);
      
    },ActualizarEstado:function(est){
       var i;
      
      for (i=0;i<carritosDB.length;i++){
        carritosDB[i].Estado=est;
        carritosDB[i].tiempEsta=0;
        carritosDB[i].timer=0;
        carritosDB[i].timerServicio=0;
        carritosDB.$save(carritosDB[i]);
        
      }
    },
    ObtenerConfiguracion:function(cc){
      var refDisp =new Firebase("https://carritoscc.firebaseio.com/Ubicacion/"+cc+"/Configuracion");
      var configura=$firebaseObject(refDisp);
      
      
      
      return configura;
    },
    addCarro:function(carro){
      carritosDB.$add(carro);
    },
    obtenerTarifa:function(cc,codCarro,duracion){
      
     // alert(tarifas.length);
      
      var final=0;
      if(duracion>=0 && duracion<=15){
        final=tarifas.t15;
      }else if(duracion<=30){
        tarifas.t30;
      }else if(duracion<=45){
        tarifas.t45;
      }else if(duracion<=60){
        tarifas.t60;
      }else{
        final=tarifas.t60+((duracion-60)*tarifas.tm);
      }
        return final;
      
    },
    addService:function(idDispositivo,servicio,cc){
      var ref2 = new Firebase("https://carritoscc.firebaseio.com/Ubicacion/"+cc+"/Dispositivos/" + idDispositivo+"/Servicios");
      var referenciaServicios=$firebaseArray(ref2);
      referenciaServicios.$add(servicio);
    },
    obtenerCarro: function(id){
        var device_found = carritosDB.filter(function(device){
          return device.id == id;
        });
        return device_found[0];
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

.factory('FiltroServicios',function(){
  var servicios = [];
  
  return{
    setservicios:function(servic){
      servicios=servic;
      //alert(servic.length);
      
    },
    getServices:function(){
      return servicios;
    },
    filtrarServicios:function(dat){
      var i=0;
      var objServicio;
      var listaProvicional=[];
      
      //alert(servicios.length);
      
      for(i=0;i<servicios.length;i++){
        alert(objServicio.fecha);
       // objServicio=servicios[i];
        //if(objServicio.fecha==dat){
          //listaProvicional.push(objServicio);
        //}
      }
        
        return listaProvicional;
        
    }
  }
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
