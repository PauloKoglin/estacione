// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives','ngCordova','timer'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.views.forwardCache(false);
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        pageTitle: "Entrar"
      })


      .state('escolha', {
        url: '/escolha',
        templateUrl: 'templates/escolhaCadastro.html'
      })


      .state('cadastroUsuario', {
        url: '/cadastroUsuario',
        templateUrl: 'templates/cadastroUsuario.html',
        controller: 'cadastroUsuarioCtrl',
        pageTitle: "Novo Usuário"
      })

      .state('cadastroEstacionamento', {
        url: '/cadastroEstacionamento',
        templateUrl: 'templates/cadastroEstacionamento.html'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.ajuda', {
        url: '/ajuda',
        views: {
          'menuContent': {
            templateUrl: 'templates/ajuda.html'
          }
        }
      })

      .state('app.perfilUsuario', {
        url: '/meuPerfil',
        views: {
          'menuContent': {
            templateUrl: 'templates/perfilUsuario.html'
          }
        }
      })

      .state('app.estacioneMain', {
        url: '/estacioneMain',
        views: {
          'menuContent': {
            templateUrl: 'templates/estacioneMain.html'
          }
        }
      })

      .state('app.estadia', {
        url: '/estadia',
        views: {
          'menuContent': {
            templateUrl: 'templates/estadia.html',
            controller: 'estadiaCtrl'
          }
        }
      })

      .state('app.historicoEstadia', {
        url: '/historicoEstadia',
        views: {
          'menuContent': {
            templateUrl: 'templates/historicoEstadia.html',
            controller: 'estadiaCtrl'
          }
        }
      })

      .state('app.eventosList', {
        url: '/eventosList',
        views: {
          'menuContent': {
            templateUrl: 'templates/eventosList.html'
          }
        }
      })

      .state('app.novoEvento', {
        url: '/novoEvento?id',
        views: {
          'menuContent': {
            templateUrl: 'templates/novoEvento.html',
            controller: 'novoEventoWizardController'
          }
        }
      })
      .state('app.contribuirEvento', {
        url: '/contribuirEvento?id',
        views: {
          'menuContent': {
            templateUrl: 'templates/eventoContribuir.html',
            controller: 'contribuirEventoController'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/estacioneMain.html',
            controller: 'PlaylistCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    if (!!window.sessionStorage.getItem('login') && window.sessionStorage.getItem('password')) {
      $urlRouterProvider.otherwise('/app/estacioneMain');
    } else {
      $urlRouterProvider.otherwise('/login');
    }
  });
