var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'firebase', 'ngSanitize']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
                title: 'index',
                templateUrl: 'partials/main.html',
                controller: 'indexCtrl'
            })
            .when('/blog', {
                title: 'blog',
                templateUrl: 'partials/blog.html',
                controller: 'blogCtrl'
            })
            .when('/about', {
                title: 'about',
                templateUrl: 'partials/about.html'
            })
            .when('/login', {
                title: 'Log In',
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl'
            })
            .when('/register', {
                title: 'register',
                templateUrl: 'partials/register.html',
                controller: 'registerCtrl'
            })
            .when('/read/:id', {
                title: 'read',
                templateUrl: 'partials/read.html',
                controller: 'readCtrl'
            })
            .when('/post', {
                title: 'Post',
                templateUrl: 'partials/post.html',
                controller: 'postCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);

// app.config(function(reCAPTCHAProvider) {
//         // required: please use your own key :)
//         reCAPTCHAProvider.setPublicKey('6LcDzw8UAAAAAGhEBbijPtgq9rtZSmExKyvCL1No');

//         // optional: gets passed into the Recaptcha.create call
//         reCAPTCHAProvider.setOptions({
//             theme: 'clean'
//         });
//     })
    // run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    //     function run($rootScope, $location, $cookies, $http) {
    //         // keep user logged in after page refresh
    //         $rootScope.globals = $cookies.getObject('globals') || {};
    //         if ($rootScope.globals.currentUser) {
    //             $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    //         }

//         $rootScope.$on('$locationChangeStart', function (event, next, current) {
//             // redirect to login page if not logged in and trying to access a restricted page
//             var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
//             var loggedIn = $rootScope.globals.currentUser;
//             if (restrictedPage && !loggedIn) {
//                 $location.path('/login');
//             }
//         });
//     }

// })();
