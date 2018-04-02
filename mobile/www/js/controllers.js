var app = angular.module('starter.controllers', ['ionic.wizard', 'ion-datetime-picker','ngCordova','timer'])

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

  .run(function($ionicPickerI18n) {
    $ionicPickerI18n.okClass = "button-dark";
    $ionicPickerI18n.cancelClass = "button-stable";
    $ionicPickerI18n.arrowButtonClass = "button-dark";
  })

  app.service('GlobalFunctions', function($ionicLoading, $ionicPopup){
    this.showAlert = function(titulo, erroMsg) {
      var alertPopup = $ionicPopup.alert({
        title: titulo,
        template: erroMsg,
        buttons: [
          { text: 'OK',
            type: 'button-dark'}
          ]
      });
      alertPopup.then(function(res) {
        console.log('Err');
      });
    };
  })

  app.service('LoginService', function($ionicLoading, $ionicPopup, $http, $state, $rootScope){
    var serverUrl = 'https://estacioneapp.herokuapp.com';//'https://pure-mesa-29909.herokuapp.com';
    this.doLogin = function (user) {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      this.showAlert = function(titulo, erroMsg) {
        var alertPopup = $ionicPopup.alert({
          title: titulo,
          template: erroMsg
        });
        alertPopup.then(function(res) {
          console.log('Err');
        });
      };

      var req = {
        method: 'POST',
        url: serverUrl + '/oauth/token?grant_type=password&username=' + user.username + '&password=' + user.password,
      };
      $http(req).then(function (response) {
        window.sessionStorage.setItem('token', response.data.access_token);
        this.usuario = response.data;
        //localStorage.setItem('token', response.data.access_token);
        $rootScope.$broadcast('login')
        $ionicLoading.hide();
      }).catch(function (response) {
        $ionicLoading.hide();
        if (response.data.error == "unauthorized") {
          this.showAlert('Problema ao conectar', 'Usuário ou senha inválido!');
        } else {
          this.showAlert('Problema ao conectar', 'Usuário inválido!');
        }
        //$state.go('login');
      });
    }

    this.doLogout = function () {
      window.sessionStorage.setItem('token', null);
      //$state.go('login');
    }
  })

  .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $ionicHistory) {
    $rootScope.cleanHistory = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
    }
    $rootScope.url = 'https://estacioneapp.herokuapp.com';//'https://pure-mesa-29909.herokuapp.com';
    //$rootScope.url = 'https://localhost:8443';
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });


/*
    // Triggered in the login modal to close it
    $scope.closeLogin = function () {

      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };*/
  })

  .controller('eventosCtrl', function ($scope, $rootScope, $http, $state, $ionicLoading) {
    $scope.isNoneMine = function () {
      for (eIdx in $scope.eventos) {
        if ($scope.eventos[eIdx].mine) {
          return false;
        }
      }
      return true;
    }

    $scope.loadEventos = function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      $http.get($rootScope.url + '/evento?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.eventos = response.data;
        $ionicLoading.hide();
      }).catch(function (response) {
        $ionicLoading.hide();
        $state.go('login');
      });
    }

    $rootScope.$on('login', function (events, args) {
      $scope.loadEventos();
    })
    $scope.loadEventos();
  })

/*
  .controller('escolhaCadastroCtrl', function ($scope, $rootScope, $state, $ionicPopup, $ionicLoading) {
    $scope.isMotorista = false;

    $scope.setUserMotorista = function (param) {
      $scope.isMotorista = param;
    }

    $scope.options = {
        loop: false,
        effect: 'fade',
        speed: 100,
        initialSlide: 0,
        direction: 'horizontal', //or vertical
       speed: 300 //0.3s transition
     };

    $scope.slides = [
      {
        title: "Bem vindo ao EstacioneApp!",
        description: "O <b>EstaioneApp</b> encontra o estacionamento mais próximo de você, assim você não perde tempo dando voltas em busca de um lugar para estacionar seu automóvel.",
        image: "img/estacione_background.png",
      },
      {
        title: "É fácil de usar!",
        description: "Basta ler o <b>QRCode</b> através de sua camera ao entrar e sair do estacionamento.",
        image: "img/qrCode.jpg",
      }
    ];
   })
*/

  .controller('cadastroUsuarioCtrl', function ($scope, $rootScope, $http, $state, $ionicPopup, $ionicLoading, LoginService) {
    $rootScope.url = 'https://estacioneapp.herokuapp.com';

    $scope.setUserMotorista = function (param) {
      $scope.isMotorista = param;
    }

    $scope.options = {
      loop: false,
      effect: 'fade',
      speed: 100,
      initialSlide: 0,
      direction: 'horizontal', //or vertical
      speed: 300 //0.3s transition
    };

    $scope.slides = [
      {
        title: "Bem vindo ao EstacioneApp!",
        description: "O <b>EstaioneApp</b> encontra o estacionamento mais próximo de você, assim você não perde tempo dando voltas em busca de um lugar para estacionar seu automóvel.",
        image: "img/estacione_background.png",
      },
      {
        title: "É fácil de usar!",
        description: "Basta ler o <b>QRCode</b> através de sua camera ao entrar e sair do estacionamento.",
        image: "img/qrCode.jpg",
      }
    ];

    $scope.templatesHtml =
      [{ name: 'cadastroEstacionamento', url: 'templates/cadastroEstacionamento.html'}];

    $scope.cadastrarUsuario = function (user) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      $scope.showAlert = function(titulo, erroMsg) {
        var alertPopup = $ionicPopup.alert({
          title: titulo,
          template: erroMsg
        });
        alertPopup.then(function(res) {
          console.log('Err');
        });
      };

      $scope.doLogin = function (user) {
        LoginService.doLogin(user);
      }

      if ($scope.isMotorista) {
        user.tipoUsuario = 'M';
      } else {
        user.tipoUsuario = 'E';
      }

      console.log(user);
      //if (!!$scope.usuario.id) {
        $http.post($rootScope.url + '/usuario/', user).then(function (response) {
          $scope.showAlert('Aviso', 'Usuário cadastrado! ID: ' );
          //$rootScope.cleanHistory();
          $ionicLoading.hide();
          user.username = response.data.login;
          user.password = response.data.senha;
          $scope.doLogin(user);
          if ($scope.isMotorista) {
            $state.go('app.estacioneMain');
          } else {
            $state.go('cadastroEstacionamento');
          }
        }).catch(function (response) {
          $ionicLoading.hide();
          $scope.showAlert('Aviso', 'Não foi possível cadastrar usuário: ' + response.data.message);
          //$state.go('login');
        });
    }
  })

  .controller('LoginCtrl', function ($scope, $rootScope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {
    $rootScope.url = 'https://estacioneapp.herokuapp.com';//'https://pure-mesa-29909.herokuapp.com';
    $scope.doLogin = function (user) {
      if (user.nome == "") {
        $scope.showAlert("Erro", "Informe o usuário");
      }

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      $scope.showAlert = function(titulo, erroMsg) {
        var alertPopup = $ionicPopup.alert({
          title: titulo,
          template: erroMsg
        });
        alertPopup.then(function(res) {
          console.log('Err');
        });
      };
/*
      $http.get($rootScope.url + '/usuario?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.retorno = response;

        var eventos = $scope.retorno.data;
        console.log("Eventos: ", eventos);

      }).catch(function (response) {

      });
    */


      var req = {
        method: 'POST',
        url: $rootScope.url + '/oauth/token?grant_type=password&username=' + user.username + '&password=' + user.password,
      };
      $http(req).then(function (response) {
        window.sessionStorage.setItem('token', response.data.access_token);
        $scope.usuario = response.data;
        //localStorage.setItem('token', response.data.access_token);
        $rootScope.$broadcast('login')
        $ionicLoading.hide();
        $state.go('app.estacioneMain');

      }).catch(function (response) {
        $ionicLoading.hide();
        if (response.data.error == "unauthorized") {
          $scope.showAlert('Problema ao conectar', 'Usuário ou senha inválido!');
        } else {
          $scope.showAlert('Problema ao conectar', 'Usuário inválido!');
        }

        //$state.go('login');
      });
    }

    $scope.doLogout = function () {
      window.sessionStorage.setItem('token', null);
      //$state.go('login');
    }
  })


    .controller('novoEventoWizardController', function ($scope, $ionicLoading) {
      $scope.mapCreated = function (map) {
        $scope.map = map;
        $scope.centerOnMe();
        $scope.map.addListener('click', function (data) {
          alert($scope.evento);
          var uluru = {lat: data.latLng.lat(), lng: data.latLng.lng()};
          if ($scope.marker) $scope.marker.setMap(null);
          $scope.marker = new google.maps.Marker({
            position: uluru,
            map: $scope.map
          });
          console.log(data);
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        $scope.searchBox = new google.maps.places.SearchBox(input);
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        $scope.map.addListener('bounds_changed', function () {
          $scope.searchBox.setBounds(map.getBounds());
        });

        $scope.searchBox.addListener('places_changed', function () {
          $scope.places = $scope.searchBox.getPlaces();

          if ($scope.places.length == 0) {
            return;
          }

          // Clear out the old markers.
          if ($scope.marker) $scope.marker.setMap(null);

          // For each place, get the icon, name and location.
          $scope.bounds = new google.maps.LatLngBounds();
          $scope.places.forEach(function (place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            $scope.icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            $scope.marker = new google.maps.Marker({
              map: $scope.map,
              position: place.geometry.location
            });

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              $scope.bounds.union(place.geometry.viewport);
            } else {
              $scope.bounds.extend(place.geometry.location);
            }
          });
          $scope.map.fitBounds($scope.bounds);
        });
      };

      $scope.centerOnMe = function () {
        console.log("Centering");
        if (!$scope.map) {
          return;
        }
        navigator.geolocation.getCurrentPosition(function (pos) {
          console.log('Got pos', pos);
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
          });
        }, function (error) {
          alert('Unable to get location: ' + error.message);
        });
      }
    })


    .controller('mapsEventosCtrl', function ($scope, $ionicLoading, $state, $http, $rootScope) {
      $scope.mapCreated = function (map) {
        $scope.map = map;

        $scope.centerOnMe();
        loadEventos();

        function loadEventos() {
          $http.get($rootScope.url + '/evento?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
            $scope.retorno = response;

            var eventos = $scope.retorno.data;
            console.log("Eventos: ", eventos);

            //for (var j = 0; j < eventos.; j++) {
            var records = eventos;

            for (var i = 0; i < records.length; i++) {

              var record = records[i];
              var markerPos = new google.maps.LatLng(record.lat, record.lng);

              console.log(record);

              if (record.mine) {
                // Add the markerto the map
                var icone = {
                  url: 'img/icone-maps.png',
                  size: new google.maps.Size(80, 80),
                  resize: new google.maps.Size(80, 80),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(0, 32)
                };
                var marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: markerPos,
                  icon: icone
                });
              } else {
                var marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: markerPos
                });
              }

              var infoWindowContent = "<h4><link rel=\"stylesheet\" type=\"text/css\" href=" + record.urlFacebook + ">" + record.nome + " </h4>" +
                  "<img src=" + record.urlImagem + " height=\"100\" width=\"100\" >" + " <br>" +
                  "Data: " + record.dtInicial + " até " + record.dtFinal + "<br>" +
                  "Organizado por: " + record.usuario.nome + "<br>" +
                  '<a target="_blank" jstcache="6" href="http://www.maps.google.com.br/?q' + record.lat + ',' + record.lng + 'z=14"> <span> Vizualizar no Google Maps </span> </a>'
                ;

              adicionarResumoInfo(marker, infoWindowContent, record);

            }
            //}

            function adicionarResumoInfo(marker, message, record) {
              var infoWindow = new google.maps.InfoWindow({
                content: message
              });

              google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
              });
            }

          }).catch(function (response) {

          });
        };
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        $scope.searchBox = new google.maps.places.SearchBox(input);
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        $scope.map.addListener('bounds_changed', function () {
          $scope.searchBox.setBounds(map.getBounds());
        });

        $scope.searchBox.addListener('places_changed', function () {
          $scope.places = $scope.searchBox.getPlaces();

          if ($scope.places.length == 0) {
            return;
          }

          // For each place, get the icon, name and location.
          $scope.bounds = new google.maps.LatLngBounds();
          $scope.places.forEach(function (place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            $scope.icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              $scope.bounds.union(place.geometry.viewport);
            } else {
              $scope.bounds.extend(place.geometry.location);
            }
          });
          $scope.map.fitBounds($scope.bounds);
        });
      };

      $scope.centerOnMe = function () {
        console.log("Centering");
        if (!$scope.map) {
          return;
        }


        navigator.geolocation.getCurrentPosition(function (pos) {
          console.log('Got pos', pos);
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          console.log("Adicionando posicao atual");
          //$scope.marker = new google.maps.Marker({
          //  map: $scope.map,
          //  position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
          //});
        }, function (error) {
          alert('Unable to get location: ' + error.message);
        });
      };

    })

  .controller('estacionamentoCtrl', function ($scope, $rootScope, $http, $state, $ionicHistory, $stateParams, $ionicLoading, GlobalFunctions, $ionicModal) {
    $rootScope.url = 'https://estacioneapp.herokuapp.com';
    //carrega
    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    /*
    if (!!$stateParams.id) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      var terminou = false;
      $http.get($rootScope.url + '/evento/' + $stateParams.id + '?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.evento = response.data;

        //adiciona o ponto no mapa
        var uluru = {lat: parseFloat($scope.evento.lat), lng: parseFloat($scope.evento.lng)};
        if ($scope.marker) $scope.marker.setMap(null);
        $scope.marker = new google.maps.Marker({
          position: uluru,
          map: $scope.map
        });


        $scope.eventoOriginalName = angular.copy($scope.evento.nome);
        // if(terminou){
        $ionicLoading.hide();
        // }
        terminou = true
      });
      $http.get($rootScope.url + '/necessidade/' + $stateParams.id + '?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.necessidades = response.data;
        $scope.necessidadesOriginal = [];
      });
    }
    */
    /*
    $scope.necessidades = [
      {descricao: ''},
    ];
    $scope.addNecessidade = function () {
      $scope.necessidades.push({descricao: ""});
    }

    $scope.removeNecessidade = function (index, necessidade) {
      $scope.necessidades.splice(index, 1);
      if (!!necessidade.id) {
        $scope.necessidadesOriginal.push(necessidade);
      }
    }

    $scope.$watch('necessidades', function (newVal, oldVal) {
      if ($scope.necessidades == null || $scope.necessidades.length == 0) {
        $scope.necessidades = [
          {descricao: ''}
        ];
      }
    }, true);

    */
    $scope.estacionamento = {};

    $scope.mapCreated = function (map) {
      $scope.map = map;
      $scope.centerOnMe();
      $scope.map.addListener('click', function (data) {
        $scope.estacionamento.longitude = data.latLng.lng();
        $scope.estacionamento.latitude  = data.latLng.lat();
        var uluru = {lat: data.latLng.lat(), lng: data.latLng.lng()};
        if ($scope.marker) $scope.marker.setMap(null);
        $scope.marker = new google.maps.Marker({
          position: uluru,
          map: $scope.map
        });
        console.log(data);
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      $scope.searchBox = new google.maps.places.SearchBox(input);
      $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      $scope.map.addListener('bounds_changed', function () {
        $scope.searchBox.setBounds(map.getBounds());
      });

      $scope.searchBox.addListener('places_changed', function () {
        $scope.places = $scope.searchBox.getPlaces();

        if ($scope.places.length == 0) {
          return;
        }

        // Clear out the old markers.
        if ($scope.marker) $scope.marker.setMap(null);

        // For each place, get the icon, name and location.
        $scope.bounds = new google.maps.LatLngBounds();
        $scope.places.forEach(function (place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          $scope.icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: place.geometry.location
          });

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            $scope.bounds.union(place.geometry.viewport);
          } else {
            $scope.bounds.extend(place.geometry.location);
          }
        });

        $scope.estacionamento.longitude = $scope.marker.position.lng();
        $scope.estacionamento.latitude = $scope.marker.position.lat();
        /*$scope.evento.address = $scope.marker.position.add();*/

        $scope.map.fitBounds($scope.bounds);
      });
    };

    $scope.centerOnMe = function () {
      console.log("Centering");
      if (!$scope.map) {
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log('Got pos', pos);
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

        $scope.marker = new google.maps.Marker({
          map: $scope.map,
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
        });

      }, function (error) {
        alert('Não foi possível encontrar a posição: ' + error.message);
      });
    }

    $scope.inserirEstacionamento = function () {
      console.log($scope.estacionamento.toString());
      //if (!!$scope.estacionamento.id) {
        $http.post($rootScope.url + '/estacionamento/?access_token=' + window.sessionStorage.getItem('token'),
          $scope.estacionamento).then(function (response) {

          var estacionamento = response.data;
          GlobalFunctions.showAlert('Aviso', 'Dados gravados!');
          //$rootScope.cleanHistory();
          //$ionicLoading.hide();
          $state.go('app.estacioneMain');
        }).catch(function (response) {
          //$ionicLoading.hide();
          GlobalFunctions.showAlert('Aviso', 'Não foi possível gravar: ' + response.data.message);

        })


      //}

        //delete $scope.evento;

          /*angular.forEach($scope.necessidadesOriginal, function (necessidade, key) {
            if (necessidade.id) {
              $http.delete($rootScope.url + '/necessidade/' + eventoId + '/' + necessidade.id + '?access_token=' + window.sessionStorage.getItem('token'), necessidade).then(function (response) {
              });
            }
          });
          angular.forEach($scope.necessidades, function (necessidade, key) {
            if (!necessidade.id) {
              $http.post($rootScope.url + '/necessidade/' + eventoId + '?access_token=' + window.sessionStorage.getItem('token'), necessidade).then(function (response) {
                delete $scope.necessidades;
              });
            } else {
              $http.post($rootScope.url + '/necessidade/' + $scope.evento.id + '/' + necessidade.id + '?access_token=' + window.sessionStorage.getItem('token'), necessidade).then(function (response) {
                $state.go('app.eventosList');
                delete $scope.necessidades;
              });
            }
          });*/
          //$rootScope.cleanHistory();
          //$state.go('app.eventosList');
        //}); }
      /* else {
        $http.post($rootScope.url + '/evento' + '?access_token=' + window.sessionStorage.getItem('token'), $scope.evento).then(function (response) {
          var eventoId = response.data.id;
          delete $scope.evento;
          angular.forEach($scope.necessidades, function (necessidade, key) {
            $http.post($rootScope.url + '/necessidade/' + eventoId + '?access_token=' + window.sessionStorage.getItem('token'), necessidade).then(function (response) {
              delete $scope.necessidades;
            });
          });
          $rootScope.cleanHistory();
          $state.go('app.eventosList');
        });
      }*/
    }

  })

  .controller('estadiaCtrl', function ($scope, $rootScope, $http, GlobalFunctions, $state, $cordovaBarcodeScanner) {
    $scope.estadia = {};
    $scope.estacionamento = {};
    $scope.estadiasUsuario = {};
    $scope.startTime = 0;

    $scope.isEstadiaAndamento = function () {
      /*$http.get($rootScope.url + '/estadia/usuario/?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.estadia = response.data;
        return (!$scope.estadia);
      }).catch(function (response) {
        //$ionicLoading.hide();
        GlobalFunctions.showAlert('Erro', 'Não consultar estadias: ' + response.data.message);
        return false;
      })*/
      //console.log("Consultou andamento");
      return $scope.estadia.idEstacionamento > 0;

    }

    $scope.verificaEstadiaAndamento = function () {
      console.log("Verificando se há estadia em andamento...");
      $http.get($rootScope.url + '/estadia/estadiaAberta/?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.estadia.idEstadia = response.data.idEstadia;
        $scope.estadia.idEstacionamento = response.data.idEstacionamento;
        $scope.estadia.idUsuario = response.data.idUsuario;
        $scope.estadia.dataEntrada = response.data.dataEntrada;
        $scope.estacionamento.valorHora = 15;
          if ($scope.estadia.idEstacionamento > 0) {
            console.log($scope.estadia.dataEntrada);
            var momentDate = moment($scope.estadia.dataEntrada, "dd/MM/YYYY HH:mm");
            var dataEntrada = new Date();
            dataEntrada = momentDate;
            $scope.startTime = (new Date(dataEntrada)).getTime();
            $scope.timerConsole = '';
            $scope.timerType = '';
            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;
            console.log("Encontrou estadia: " + $scope.estadia);
          }

       }).catch(function (response) {
          GlobalFunctions.showAlert('Erro', 'Não foi possível consultar estadias: ' + response.data.message);
       })
    }

    $scope.getTimeTimer = function (param) {
      console.log(param);
      return 5;
    }

    $scope.setTempo = function (value) {
      console.log(value);
      $scope.tempo = value;
    }

    $scope.scanNow = function() {
      console.log("iniciando estadia...");
      /*alert($scope.estadia.dataInicio);
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        alert(imageData.text);
        $scope.estadia = getDate();
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
      }, function(error) {
        console.log("An error happened -> " + error);
      });*/
      var data = new Date();
      //estadia.idUsuario = null;
      $scope.estadia.idEstacionamento = 1;
      $scope.estadia.dataEntrada = data.toLocaleString()+" "+data.getHours()+":"+data.getMinutes();
      $scope.estacionamento.valorHora = 15;
      console.log($scope.estadia);
      console.log($scope.estacionamento);
      $http.post($rootScope.url + '/estadia/?access_token=' + window.sessionStorage.getItem('token'), $scope.estadia).then(function (response) {
        $scope.estadia = response.data;
        GlobalFunctions.showAlert('Aviso', 'Checkin confirmado!');
      }).catch(function (response) {
        GlobalFunctions.showAlert('Aviso', 'Não foi possível realizar checkin: ' + response.data.message);

      })
      $scope.tempoAtual = 0;
      $scope.timerConsole = '';
      $scope.timerType = '';
      $scope.$broadcast('timer-start');
      $scope.timerRunning = true;
      console.log($scope.estadia);
    };

    $scope.terminarEstadia = function () {
      console.log("finalizando estadia...");
      var dataSaida = new Date();
      //estadia.idUsuario = null;
      $scope.estadia.idEstacionamento = 1;
      $scope.estadia.dataSaida = dataSaida.toLocaleString()+" "+dataSaida.getHours()+":"+dataSaida.getMinutes();
      $scope.estadia.preco = 30;
      console.log($scope.estadia);
      $http.post($rootScope.url + '/estadia/'+ $scope.estadia.idEstadia  +'?access_token=' + window.sessionStorage.getItem('token'), $scope.estadia).then(function (response) {
        $scope.estadia = response.data;
        GlobalFunctions.showAlert('Aviso', 'Checkout confirmado!');
      }).catch(function (response) {
        GlobalFunctions.showAlert('Aviso', 'Não foi possível realizar checkout: ' + response.data.message);

      })
      console.log("parando timer");
      $scope.timerRunning = false;
      $scope.minutes = 0;
      $scope.$broadcast('timer-stop');
      $scope.estadia = {};
    }

    $scope.$on('timer-tick', function (event, args) {
      $scope.timerConsole = ($scope.estacionamento.valorHora * args.hours).toFixed(2).replace(".",",");
    });

    $scope.carregarEstadiasUsuario = function () {
      console.log("Verificando se há estadia em andamento...");
      $http.get($rootScope.url + '/estadia/usuario/1?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.retorno = response;
        var estadiasUsuario = $scope.retorno.data;
          //var momentDate = moment($scope.estadia.dataEntrada, "dd/MM/YYYY HH:mm");
          //var dataEntrada = new Date();
          //dataEntrada = momentDate;
        /*
          var records = eventos;

          for (var i = 0; i < records.length; i++) {

            var record = records[i];


            var infoWindowContent = "<h4><link rel=\"stylesheet\" type=\"text/css\" href=" + record.urlFacebook + ">" + record.nome + " </h4>" +
                "<img src=" + record.urlImagem + " height=\"100\" width=\"100\" >" + " <br>" +
                "Data: " + record.dtInicial + " até " + record.dtFinal + "<br>" +
                "Organizado por: " + record.usuario.nome + "<br>" +
                '<a target="_blank" jstcache="6" href="http://www.maps.google.com.br/?q' + record.lat + ',' + record.lng + 'z=14"> <span> Vizualizar no Google Maps </span> </a>'
              ;

            adicionarResumoInfo(marker, infoWindowContent, record);

        }*/

      }).catch(function (response) {
        GlobalFunctions.showAlert('Erro', 'Não foi possível consultar estadias: ' + response.data.message);
      })
    }
    /*
    $scope.$on('timer-stopped', function (event, data){
      console.log('Timer Stopped - data = ', data);
      $scope.$broadcast('reset');
    });
    */
    /*document.addEventListener("deviceready", function () {

      $scope.scanNow = function() {
        $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {

            // Success! Barcode data is here
            console.log(barcodeData);
          }, function(error) {
            // An error occurred
            console.log(error);
          });

      }

      // NOTE: encoding not functioning yet
      $scope.generateQrCode = function () {
        $cordovaBarcodeScanner
          .encode(BarcodeScanner.Encode.TEXT_TYPE, "teste")
          .then(function(success) {
            // Success!
          }, function(error) {
            // An error occurred
          });
      }


    }, false);*/

  });

  /*
  .controller('contribuirEventoController', function ($scope, $rootScope, $http, $state, $ionicHistory, $stateParams, $ionicLoading, $rootScope) {
    if (!!$stateParams.id) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      var terminou = false;
      $http.get($rootScope.url + '/evento/' + $stateParams.id + '?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.evento = response.data;
        // if(terminou){
        $ionicLoading.hide();
        // }
        terminou = true
      });
      $http.get($rootScope.url + '/necessidade/' + $stateParams.id + '?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.necessidades = response.data;
        $scope.necessidadesOriginal = angular.copy($scope.necessidades);
      });
      $scope.salvaNecessidade = function () {
        angular.forEach($scope.necessidades, function (necessidade, key) {
          $http.post($rootScope.url + '/necessidade/' + $scope.evento.id + '/' + necessidade.id + '?access_token=' + window.sessionStorage.getItem('token'), necessidade).then(function (response) {
            $state.go('app.eventosList');
            delete $scope.necessidades;
          });
        });
      }

      $scope.isContribuir = function () {
        for (necessidade in $scope.necessidades) {
          if (!$scope.necessidades[necessidade].contribuidor) {
            return true;
          }
        }
        return false;
      }
    }
  });
*/



