var nombre= localStorage.getItem("nombre");
var src= localStorage.getItem("src");

var cargar= function(){
    $("#nombre").focus();
    $("#nombre").keydown(validarNombreAp);
    $("#next3").click(validarDatos);
    $("#perfil-menu").click(menu);
    $(".absolute").click(desaparecerMenu);

    if((src!=null || src!=undefined)&& location.href.includes("buscador.html")){
        $("#logo-usuario").attr("src", src);
        $("#user").attr("src",src);
    }
    
    function validarNombreAp(evento){
        var ascii = evento.keyCode;
        if (ascii == 8 || ascii == 32 || (ascii >= 65 && ascii <= 90 )|| (ascii >= 97 && ascii <= 122 )) {
            return true;
        }else {
            return false;
        }
    }

    function validarDatos(){
        var email = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        var dni = $(".dni").val().length;
        var mail = $(".email").val().length;
        var correo =$(".email").val().trim();
        if (email.test(correo) && (dni >= 2 && dni <= 20)  && (mail >= 5 && mail <= 50)) {
            $(this).attr("href", "buscador.html");
        } else{
            $("#next3 ").removeAttr("href");
            alert("Por favor, llena tus datos")
        }
    }

    var app_id = '1850360375199136';
    var scopes = '';

    var btn_login = '<a href="#" id="login" class="btn btn-primary">Iniciar sesión</a>';

    var div_session = "<div id='facebook-session'>"+
            "<strong></strong>"+
            "<img>"+
            "<a href='#' id='logout' class='btn btn-danger'>Cerrar sesión</a>"+
            "</div>";

    window.fbAsyncInit = function() {
        FB.init({
            appId      : app_id,
            status     : true,
            cookie     : true, 
            xfbml      : true, 
            version    : 'v2.1'
        });
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response, function() {});
        });
    };



    $(document).on('click', '#login', function(e) {
    e.preventDefault();

    facebookLogin();
    });
    $(document).on('click', '#logout', function(e) {
    e.preventDefault();

    if (confirm("¿Está seguro?"))
      facebookLogout();
    else 
      return false;
    });


    function login(callback) {
        var CLIENT_ID = 'd36ef8fcca3346bbb86a4f3c864adf9a';
        var REDIRECT_URI = 'http://jmperezperez.com/spotify-oauth-jsfiddle-proxy/';
        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }
        
        var url = getLoginURL([
            'user-read-email'
        ]);
        
        var width = 450,
            height = 730,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);
    
        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);
        
        var w = window.open(url,
                            'Spotify',
                            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                           );
        
    }

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    var templateSource = document.getElementById('result-template').innerHTML,
        template = Handlebars.compile(templateSource),
        resultsPlaceholder = document.getElementById('result'),
        loginButton = document.getElementById('btn-login');
    
    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    loginButton.style.display = 'none';
                    resultsPlaceholder.innerHTML = template(response);
                });
            });
    });
}

$(document).ready(cargar);

var statusChangeCallback = function(response, callback) {
    console.log(response);

    if (response.status === 'connected') {
        getFacebookData();
    } else {
        callback(false);
    }
}

var checkLoginState = function(callback) {
    FB.getLoginStatus(function(response) {
        callback(response);
    });
}

var getFacebookData =  function() {
    FB.api('/me', function(response) {
        localStorage.setItem("nombre", response.name);
        localStorage.setItem("src", 'http://graph.facebook.com/'+response.id+'/picture?type=large');
        window.location = 'buscador.html';
    });
}

var facebookLogin = function() {
    checkLoginState(function(data) {
        if (data.status !== 'connected') {
            FB.login(function(response) {
                if (response.status === 'connected')
                    getFacebookData();
            }, {scope: scopes});
        }
    })
}
var facebookLogout = function() {
    checkLoginState(function(data) {
      if (data.status === 'connected') {
        FB.logout(function(response) {
          $('#facebook-session').before(btn_login);
          $('#facebook-session').remove();
        });
      }
    });
}

var menu= function(){
    $("#menu").animate({width:'toggle'},350);
    $(".absolute").show();
};

var desaparecerMenu= function(){
$("#menu").animate({width:'toggle'},350);
$(".absolute").hide();
}
