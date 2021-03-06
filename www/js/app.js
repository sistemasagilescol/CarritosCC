// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.cloud','starter.controllers', 'starter.services','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    
    ble.isEnabled(
      function(){
        // Bluetooth is enabled
      },
      function(){
        // Bluetooth not yet enabled so we try to enable it
        ble.enable(
          function(){
            // bluetooth now enabled
          },
          function(err){
            alert('Cannot enable bluetooth');
          }
        );
      }
    );
    
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicCloudProvider) {


    $ionicCloudProvider.init({
    "core": {
      "app_id": "3386d6cb"
    }
  });
  
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('login',{
      url: "/login",
      templateUrl:"templates/Login.html",
      controller: 'loginCtrl'
    })
    
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'  
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    
    //Backend Usuarios
    .state('tab.Usuarios', {
      url: '/Usuarios',
      views: {
        'Usuarios': {
          templateUrl: 'templates/Usuarios.html',
          controller: 'UsuariosCtrl'
        }
      }
    })
    
     .state('tab.NuevoUsuario',{
    url: '/NuevoUsuario',
    views: {
      'Usuarios' : {
          templateUrl: 'templates/NuevoUsuario.html',
          controller: 'UsuariosCtrl'
      }
    }
    })
    
//Final backEnd Usuarios    
    
    //Backend Configuraciones
    .state('tab.Configuraciones', {
      url: '/Configuraciones',
      views: {
        'Configuraciones': {
          templateUrl: 'templates/Configuraciones.html',
          controller: 'ConfigCtrl'
        }
      }
    })
    //Final backend Configuraciones
    
    
    .state('tab.DispDetail',{
    url: '/chats/:dispId',
    views: {
      'tab-chats' : {
          templateUrl: 'templates/dispositivo-detail.html',
          controller: 'DetalleDispCtrl'
      }
    }
    })
    
    
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })    
  
  
  
 /* .state('AddCarro', {
        url: "/Dispositivos/:AddCarro",
        templateUrl: "templates/AddCarro.html",
        controller: 'NuevoCarroCtrl'
    })*/
  
   .state('tab.AddCarro', {
      url: '/AddCarro',
      views: {
          'Dispositivos': {
            templateUrl: 'templates/AddCarro.html',
            controller: 'NuevoCarroCtrl' 
          }
      }
    })
  

  .state('tab.Dispositivos',{
    url: '/Dispositivos',
    views: {
        'Dispositivos': {
          templateUrl: 'templates/Dispositivos.html',
          controller: 'DispositivosCtrl'
        }
      }    
    }
  );

  

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/dash');
  $urlRouterProvider.otherwise('/login');
});
