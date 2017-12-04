//Main Controller
app.controller('indexCtrl', ["$scope", "$firebaseObject", "Auth", function($scope, $firebaseObject, $rootScope, Auth) {

    var ref = firebase.database().ref().child("articles");
    // download the data into a local object
    var syncObject = $firebaseObject(ref);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "articles");
}]);

//Login Controller
app.controller('loginCtrl', ['$scope', '$http', '$firebaseAuth', '$location', 'Auth',
    function($scope, $http, $firebaseAuth, $location, $rootScope, Auth) {
        if (firebase.auth().currentUser) {
            $location.path('/profile');
            $scope.$apply();
            return;
        }
        var auth = firebase.auth();
        console.log('In Login controller');
        $scope.flag = 1;
        $scope.login = function() {
            $scope.flag = 0;
            firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password)
                .then(function(user) {
                    if (user.emailVerified) {
                        $location.path('/profile');
                        $scope.$apply();
                    } else {
                        //user.sendEmailVerification();
                        $location.path('/profile');
                        $scope.$apply();
                        //alert('Please first verify your email.');
                    }
                })
                .catch(function(error) {
                    $scope.flag = 1;
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode == 'auth/invalid-email') {
                        alert('Invalid Email');
                    } else if (errorCode == 'auth/user-disabled') {
                        alert('User is disabled');
                    } else if (errorCode == 'auth/user-not-found') {
                        alert('User not found');
                    } else if (errorCode == 'auth/wrong-password') {
                        alert('You have entered wrong password');
                    } else {
                        alert(errorCode);
                    }
                });
        };
    }
]);


//Register Controller
app.controller('registerCtrl', ["$scope", "$firebaseObject", '$location', "Auth", function($scope, $firebaseObject, $location, $rootScope, Auth) {
    if (firebase.auth().currentUser) {
        $location.path('/profile');
        $scope.$apply();
        return;
    }
    console.log('In registerCtrl');
    var auth = firebase.auth();
    $scope.register = function() {
        if ($scope.password == $scope.pass) {
            firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password)
                .then(function(user) {
                    user.updateProfile({
                        displayName: $scope.firstName + ' ' + $scope.lastName
                    }).then(function() {
                        // Update successful.
                        console.log('Update successful.');
                    }, function(error) {
                        // An error happened.
                        console.log(error);
                    });
                    var ref = firebase.database().ref().child("user");
                    var data = {
                        email: $scope.email,
                        firstName: $scope.firstName,
                        lastName: $scope.lastName,
                        id: user.uid,
                        totalPosts:"0"
                    }
                    ref.child(user.uid).set(data).then(function(ref) {
                        console.log("Saved");
                        $location.path('/profile');
                        $scope.$apply();
                    }, function(error) {
                        console.log(error);
                    });
                })
                .catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode == 'auth/weak-password') {
                        alert('The password is too weak.');
                    } else if (errorCode == 'auth/email-already-in-use') {
                        alert('The email is already taken.');
                    } else if (errorCode == 'auth/weak-password') {
                        alert('Password is weak');
                    } else if (errorCode == 'auth/network-request-failed') {
                        alert('Internet Connection Problem');
                    } else {
                        alert(errorMessage);
                    }
                    console.log(error);
                });

        }
    }
}]);

//Modal Controller
app.controller('modalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
    $scope.close = function() {
        $modalInstance.dismiss('Close');
    }
}]);


//READ Controller
app.controller('readCtrl', ["$scope", "$firebaseObject", "$routeParams", "$location", "$sce", "$modal", "Auth", function($scope, $firebaseObject, $routeParams, $location, $sce, $modal, $rootScope, Auth) {
    var up = 0;
    var down = 0;
    firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $scope.user = user.uid;
            }
        });
    var postId = $routeParams.id;
    var ref = firebase.database().ref().child("articles/" + postId);
    // download the data into a local object
    var obj = $firebaseObject(ref);
    // obj.$loaded().then(function() {
    //     console.log(obj);
    //     
    // });
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    obj.$bindTo($scope, "data");
    //$scope.data = obj;
    // $scope.Trust = function(data) {
    //     return $sce.trustAsHtml(data);
    // };

    $scope.up = function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var refVotes = firebase.database().ref().child("user/" + user.uid+"/votes/"+postId);
                if($scope.data.votes[user.uid]["up"]){
                    $scope.data.votes[user.uid]["up"]=0;
                    $scope.data.up =$scope.data.up-1;
                }else{ 
                    $scope.data.votes[user.uid]["up"] = 1;
                    $scope.data.up =$scope.data.up + 1;
                    if($scope.data.votes[user.uid]["down"]){
                        $scope.data.votes[user.uid]["down"] = 0;
                        $scope.data.down = parseInt($scope.data.down) - 1;
                    }
                    var vote = {
                        down:0,
                        up:1
                    }
                    refVotes.push(vote);
                }
                $scope.$apply();
            } else {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/modalAlert.html',
                    controller: 'modalCtrl',
                    resolve: {}
                });
            }
        });

    }
    $scope.down = function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
               var refVotes = firebase.database().ref().child("user/" + user.uid+"/votes/"+postId);
               if($scope.data.votes[user.uid]["down"]){
                    $scope.data.votes[user.uid]["down"]=0;
                    $scope.data.down =$scope.data.down-1;
                }else{ 
                    $scope.data.votes[user.uid]["down"] = 1;
                    $scope.data.down =$scope.data.down + 1;
                    if($scope.data.votes[user.uid]["up"]){
                        $scope.data.votes[user.uid]["up"] = 0;
                        $scope.data.up = parseInt($scope.data.up) - 1;
                    }
                    var vote = {
                        down:0,
                        up:1
                    }

                }
                $scope.$apply();
            } else {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/modalAlert.html',
                    controller: 'modalCtrl',
                    resolve: {}
                });
                $scope.$apply();
            }
        });
    }

    //Create new comments
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    date = year + "-" + month + "-" + day;
    
    $scope.createNewComment = function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var refComment = firebase.database().ref().child("user/" + user.uid+"/comments");
                //console.log('User logged in');
                var comm = {
                    date:date,
                    text:$scope.readerComment
                }

                var comment = {
                    userId: user.uid,
                    date: date,
                    comment: $scope.readerComment,
                    userName: user.displayName
                }
                refComment.push(comm).then(function(snap) {
                    console.log("comment saved");
                    console.log(snap.key);
                    key = snap.key;
                    $scope.data.comments[key] = comment;
                    $scope.data.totalComments = $scope.data.totalComments + 1;
                    $scope.readerComment = ' ';
                }, function(error) {
                    console.log(error);
                });
            } else {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/modalAlert.html',
                    controller: 'modalCtrl',
                    resolve: {}
                });
            }
        });
    }

}]);


//Blog Controller
app.controller('blogCtrl', ["$scope", "$firebaseObject", "Auth", function($scope, $firebaseObject, $rootScope, Auth) {

    var ref = firebase.database().ref().child("articles");
    // download the data into a local object
    var query = ref.orderByChild("date").limitToLast(10);
    var syncObject = $firebaseObject(query);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");
    //console.log($scope.data)
}]);



//Post Controller
app.controller('postCtrl', ['$scope', "$routeParams", "$firebaseObject", "$sce", "Auth", function($scope, $firebaseObject, $routeParams, $rootScope, Auth, $sce) {
    console.log("In Post Controller");
    // $scope.editorOptions = {
    //        language: 'en',
    //        allowedContent: true,
    //        entities: false
    //    };

    //    $scope.$on("ckeditor.ready", function( event ) {                
    //        var noticeCkEditor = CKEDITOR.instances["noticeDetails"];
    //        noticeCkEditor.on( 'fileUploadResponse', function( evt ) {                      
    //            // Prevent the default response handler.
    //            evt.stop();

    //            // Ger XHR and response.
    //            var data = evt.data,
    //                xhr = data.fileLoader.xhr,
    //                response = xhr.responseText;

    //            var respJson = angular.fromJson(response);
    //            console.log(respJson);

    //            if ( respJson.error ) {
    //                // Error occurred during upload.
    //                data.message = respJson.error.message;
    //                evt.cancel();
    //            } else {                
    //                data.url = respJson.url;
    //            }
    //        } );

    //    });
}]);


//Controller for SignIn/SignOut changes in navbar
app.controller('sign', ['$scope', '$http', '$location', 'Auth', function($scope, $http, $location, $rootScope, Auth) {
    firebase.auth().onAuthStateChanged(function(user) {
        //console.log('State Changed');
        console.log(firebase.auth().currentUser);
        if (user) {
            // User is signed in.
            $scope.first = 'Sign Out';
            $scope.firstLink = '';
            $scope.method = 'signOut',
                $scope.params = '';
            $scope.second = 'Profile';
            $scope.signOut = function() {
                console.log('Sign out');
                firebase.auth().signOut().then(function() {
                    // Sign-out successful.
                    window.location.reload();
                });
            }
            $scope.secondLink = 'blog';
        } else {
            $scope.first = 'Sign In';
            $scope.second = 'Register';
            $scope.firstLink = 'login';
            $scope.secondLink = 'register';
        }
    });
}]);
