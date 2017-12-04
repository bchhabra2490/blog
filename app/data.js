app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var config = {
            apiKey: "AIzaSyC1N0XbE5ZEUM4jAnFlqQbzbB7K6q4uOuI",
            authDomain: "youngdreams-dc2a1.firebaseapp.com",
            databaseURL: "https://youngdreams-dc2a1.firebaseio.com",
            storageBucket: "youngdreams-dc2a1.appspot.com",
            messagingSenderId: "1019774134972"
        };
        firebase.initializeApp(config);
        var ref = firebase.database().ref();
        return ref;
    }
]);