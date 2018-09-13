var app = angular.module("app", ["angular-loading-bar", "ngRoute", "ngFileUpload"]);

app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }]);

//var host = "http://localhost:8080/billapp-service";
var host = "http://173.255.197.204:8080/billapp";
var root = host + "/admin/";
//var projectRoot = host + "/projectService"
var rootUser = host + "/user/";




app.service('userService', function ($http, $q, Auth) {

    var response = {};
    var errorCode = 0;

    this.callService = function ($scope, method) {
        errorCode = 0;
        var defer = $q.defer();
        var url = root + method;
        var config = {
            headers: {
                'Token': Auth.isLoggedIn()/*,
                'Accept': 'application/json;odata=verbose'*/,
                'Content-Type': 'application/json'
            }
        };
        console.log("headers = >" + JSON.stringify(config));
        var res = $http.post(url, $scope.dataObj, config);
        res.success(function (data, status, headers, config) {
            response = data;
            defer.resolve(response);

        });
        res.error(function (data, status, headers, config) {
            response = data;
            errorCode = status;
            defer.resolve(response);
            console.log("Error :" + errorCode + ":" + JSON.stringify(data) + ":" + JSON.stringify(headers))
        });

        response = defer.promise;
        return $q.when(response);
    }

    this.logout = function () {

    }


});



app.config(function ($routeProvider) {
    $routeProvider
        .when("/home", {
            controller: "dashboard",
            templateUrl: "summary.html"
        })
        .when("/", {
            controller: "dashboard",
            templateUrl: "summary.html"
        })
        .when("/login", {
            controller: "login",
            templateUrl: "login.html"
        })
        .when("/items", {
            controller: "items",
            templateUrl: "gallery.html"
        })
        .when("/vendors", {
            controller: "vendors",
            templateUrl: "users.html"
        })
        .when("/settlements", {
            controller: "settlements",
            templateUrl: "settlements.html"
        })
});



/*app.run(function ($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var user = JSON.parse(localStorage.erpUser);
        
        if (user != null && user.name != null) {
            // no logged user, we should be going to #login
            if (user.status == 'P') {
                if (next.templateUrl != "password_reset.html") {
                    //window.location.href = "#changePassword";
                    $location.path("/changePassword");
                }
            } else if (user.company == null && user.loginType != 'Employee') {
                if (next.templateUrl != "company_details.html") {
                    //window.location.href = "#companyDetails";
                    $location.path("/companyDetails");
                }
            }
        }
    });
});*/

app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if (!Auth.isLoggedIn()) {
            console.log('........ DENY .......');
            event.preventDefault();
            window.location.href = 'login.html';
        } else {
            console.log('........ ALLOW ......');
            //$location.path('/home');
        }
    });
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.factory('Auth', function () {
    var user = false;

    return {
        setUser: function (aUser) {
            setCookie("token", aUser, 1);
            //alert("token is set .." + user);
            console.log(user);
        },
        isLoggedIn: function () {
            var user = getCookie("token");
            console.log("Got token .." + user);
            return (user) ? user : false;
        },
        logout: function () {
            deleteCookie("token");
        }
    }
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
    var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = cname + "=;" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
