$(document).ready(function(){
   //-----------------------------------Firebase--------------------//
   const config = {
    apiKey: "AIzaSyCBfiFSLLeNyFmEqPGu9yyTf1--bFtPCIs",
    authDomain: "mood-music-94557.firebaseapp.com",
    databaseURL: "https://mood-music-94557.firebaseio.com",
    projectId: "mood-music-94557",
    storageBucket: "mood-music-94557.appspot.com",
    messagingSenderId: "1055481483778"
};

firebase.initializeApp(config);
const database = firebase.database();
console.log(user);
const auth = firebase.auth();
var user = firebase.auth().currentUser;


// Realtime listener
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            $("#logout").show();
            console.log("poop");
            displayuser();
        } else{
            console.log('not logged in');
        }
    });

    function displayuser(){
        let uid = firebase.auth().currentUser.uid;
        let get_user = database.ref('users/' + uid);
        return get_user.once('value').then(function(snapshot) {
            let username = snapshot.val().username;
            let displayuser = $("<a id='login'>" + username + "</a>");
            $("#logsymb").empty();
            $("#logsymb").append(displayuser);
        })

    };

// Add Login event
$("#log").on("click", function(event){
    event.preventDefault();
    let email = $("#email").val().trim();
    let password = $("#password").val().trim();
    const auth = firebase.auth();
    // Sign in
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error: " + errorMessage);
    })

    validateForm();

    function validateForm() {
        let emailInput = $("#email").val().trim();
        let passwordInput = $("#password").val().trim();
        if( emailInput === "" || passwordInput === ""){
            alert("Input required");
            return false;
        } else{
            setTimeout( function(){
                $("#modal1").hide();
            }, 1000);
        }
        
    }

});

// Add signup event
    $("#AccountCreate").on("click", function(event){
        event.preventDefault();
        let password = $("#passwordNew").val().trim();
        let NewEmail = $("#email").val().trim();
        let auth = firebase.auth();
        // Sign in
        const promise = auth.createUserWithEmailAndPassword(NewEmail, password);
        promise.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error: " + errorMessage);
        });

        $("#modal2").hide();
        $("#modal3").show();
    });

    $("#Final").on("click" , function writeUserData() {
        let username = $("#NewUsername").val().trim();
        let name = $("#first_name").val().trim();
        let lastname = $("#last_name").val().trim();
        let email = $("#email").val().trim();
        let uid = firebase.auth().currentUser.uid;
        database.ref('users/' + uid).set({
            username: username,
            name: name,
            lastname: lastname,
            email: email,
            favorites: "0"
        })

        $("#modal3").hide();
        location.reload();
        
    });

    $("#logout").on("click", function(event){
        event.preventDefault();
        var login = $("<a href='#' id='login'> LOGIN  <i class='small material-icons'>trending_flat</i></a>")
        firebase.auth().signOut().then(function() {

        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error: " + errorMessage)
        })
        setTimeout(function(){
            $("#modal1").hide();
            $("#modal4").hide();
            $("#logout").hide();
            $("#logsymb2").empty();
            $("#logsymb").empty();
            $("#logsymb").append(login);
        }, 1000)
        location.reload();
    });

//------------------------- Index Page code --------------------------//

$("#logsymb").on("click", function(event){
    event.preventDefault();
    $('#modal1').show();
})

$("#nameofuser").on("click", function(event){
    event.preventDefault();
    $('#modal3').show();
})

$("#CreateAccount").on("click", function(event){
    event.preventDefault();
    $('#modal1').hide();
    $('#modal2').show();
})

$(".close").on("click", function(event){
    event.preventDefault();
    $("#modal1").hide();
    $("#modal2").hide();
    $("#modal3").hide();
    $("#modal4").hide();
})

$('.sidenav').sidenav();
$('select').formSelect();

//-------------------------Favorites Page code ------------------------//

firebase.auth().onAuthStateChanged(function(user) {
if(user){
    let uid = firebase.auth().currentUser.uid;
    let ref = firebase.database().ref("users/" + uid + "/favorites/");
    ref.limitToLast(5).on("child_added", function(snapshot){
        $("#playlistsrow").prepend("<tr><td id='gif'><img id='favoritegif' src='" + snapshot.val().gif + "'></td><td id='playlist'><iframe frameborder='0' allowtransparency='true' allow='encrypted-media' width='600' height = '85' src='" + snapshot.val().playlist + "'></td>");
    })
    

} else { 
    
    }
})

});