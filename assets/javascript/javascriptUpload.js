$(document).ready(function(){
init();
$("#startBtn").on('click', startWebcam );
$("#snapBtn").on('click', snapshot );
$("#analyze").on('click', processImage );
$( document ).on('change','#imageFile' , previewFile );
$("#preview").slideUp();
 //--------------------
 // GET USER MEDIA CODE
 //--------------------
 navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
    
    var video;
    var webcamStream;
    var sourceImgUrl;
    
    function startWebcam() {
        $("#preview").slideUp();
        $("#fileUp").val(null);
        $("#selfie").slideUp(); //hide selfie div to display video in its place
        $("#video").slideDown();
        if (navigator.getUserMedia) {
            navigator.getUserMedia ({
                video: true,
                audio: false
            },
            // successCallback
            function(localMediaStream) {
                video = document.querySelector('video');
                try {
                    video.srcObject = localMediaStream;
                } catch (error) {
                    video.src = URL.createObjectURL(localMediaStream);
                }
                webcamStream = localMediaStream;
            },
            // errorCallback
            function(err) {
                console.log("The following error occured: " + err);
            });
        } else {
            console.log("getUserMedia not supported");
        }  
    }
    
    //---------------------
    // TAKE A SNAPSHOT CODE
    //---------------------
    
    var canvas, ctx;
    
    function init() {
        // Get the canvas and obtain a context for
        // drawing in it
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext('2d');
        $("#video").slideUp(5);
         $("#selfie").slideUp(5); 
         $("#preview").slideUp(5);
         $("#gif").slideUp(5);
    }
    
    function snapshot() {     
        $("#selfieImg").remove(); //remove any previously displayed selfies
        ctx.drawImage(video, 0,0, canvas.width, canvas.height);
        var selfie = new Image();
        selfie.id = "selfieImg";
        selfie.src = canvas.toDataURL();  
        $("#selfie").html(selfie); 
        stopVideo();
        $("#video").slideUp(); 
        $("#selfie").slideDown(); 
    }
     
    
    function stopVideo() {
        if (webcamStream!= null) {
        webcamStream.getTracks().map(function (val) {
            val.stop(); }
            );
        }
    }
    
    //---------------------------
    // IMAGE UPLOAD & PREVIEW CODE
    //---------------------------
        function previewFile() {
         
      var preview = document.querySelector("#previewImg");
      var file    = document.querySelector("input[type=file]").files[0];
      var reader  = new FileReader();
    
      reader.addEventListener("load", function () {
        stopVideo();
        $("#video").slideUp();
        $("#selfie").slideUp();
        preview.src = reader.result;
        }, false);
        $("#preview").slideDown()
        if (file) {
            reader.readAsDataURL(file);
            sourceImgUrl = file;
            console.log(sourceImgUrl);
        }
    }
    //----------------------------------
    // ANALZYE IMAGE AND DISPLAY RESULTS
    //----------------------------------
    
    function processImage() {
    //Only  allow if user is logged in
        let user = firebase.auth().currentUser;
   if(user){
    
            console.log(sourceImgUrl);
        var rapid = new RapidAPI("default-application_5b2ee88be4b08122a9a23ae4", "efb47cc8-30f0-4748-8471-3360632e9d86");
        var randomNum = Math.floor(Math.random()*20);
        var gifNum = randomNum.toString();
    
            rapid.call('KairosAPI', 'createEmotionalAnalysis', { 
            'appId': '856d4e0d',
            'source': sourceImgUrl,
            'appKey': '436faeac678d376364b610aa4c2822e7'
    
            }).on('success', function (payload) {
                M.toast({html: "Success!"});
                console.log(payload);
                console.log(payload.frames["0"].people["0"].emotions);
    
                let emotions = payload.frames["0"].people["0"].emotions;
                let strongestEmotion = "";
                let emotionScore = 0;
                    for (var key in emotions) {
                    if (emotions[key] > emotionScore) {
                        emotionScore = emotions[key];
                        strongestEmotion = key;
                        } else if (emotions[key] == emotionScore) {
                            strongestEmotion = "chill";
                        }
                    };
                    
                    console.log(strongestEmotion);
                    //put if statements for synonym array or thesaurus api call here. Set strongestEmotion to synonym to pass into giphy and spotify
            
            rapid.call('Giphy', 'searchGifs', { 
                            'query': strongestEmotion, 
                            'apiKey': 'dc6zaTOxFJmzC',
                            'limit': '20',
                        }).on('success', function (payload) {
                        // console.log(payload);
                        //console.log(payload.data); to test payload
                               var gifSrc = payload.data[gifNum].images.original.url;
                               $("#mood-gif").attr("src", gifSrc);
                               $("#gif").slideDown(200);
                                console.log(payload.data);  
              
            var genreChoice = $("#genre option:selected").text();
            console.log($("#genre option:selected").text());
            if (genreChoice !== "rock" | "hip-hop" | "electronic" | "pop" | "indie") {
                M.toast({html: "Please pick a genre to get a playlist."});
            }
    
            //This section contains code for the genre select option
    
            //JOY
            if (strongestEmotion === "joy") {
    
                if (genreChoice === "rock") {
    
                    var joyRock = ["digster.fr/playlist/2esHfruMW8rAZI2DxQCNcj",
                    "spotify/playlist/37i9dQZF1DX2sUQwD7tbmL",
                    "dommett.w/playlist/6oWaWD4OHnOgFH6uRue3p4?si=1Uy7fN4zTrOhQEjXPAMqYw",
                    "lindakarlborg/playlist/3tS3DHCkXKMg0Bos1SAsM8?si=5UfnT_NFS9mRFbm65kx1DA",
                "1186421995/playlist/1sEVqNHeCMCXZ1V089ewvV?si=Ap3IgnaOTgO-InQ2z1emiw", "124087160/playlist/5UrxMrLgblrt6kgKvlnDiw?si=PKduwcDqTMO25FELODlgcg", "consistentcontradiction/playlist/59OEeam7sz3LT2ygqP4Rmm?si=hXWkKN3fQ9ivWT_ZDxUWTQ", "1114396841/playlist/12OJYmJD3LCv8C8HNBTsgg?si=jJs5oSuCQU-Yk-Alet2oYA"];
                    var randomIndex = Math.floor(Math.random()*joyRock.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + joyRock[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "pop"){
    
                    var joyPop = ["1196608018/playlist/38LCcA7ZWIamTuUogTr8Qr?si=1NhucVNcQ_GhFdS2amqKUw",
                    "laetitiaadam/playlist/4aKuOtCoGz0Agcyf6FuQwH?si=wz9xBlWlSL6u8oT0243QYA", "1284867860/playlist/0zexnndfKBTSs7TZOQ7b04?si=JyycOp2kTkSSFgf2rP-7cg", "sarahkatewright/playlist/4I5nnGqvwhuYphlzmmDBDG?si=15PETBBwQgOqg0LjNVZUfw", "bengibbs96/playlist/3rnBJdfNkQDmkNf2RHqqLB?si=taSJ-HDFSWqhjzzb0nffoA", "allyson.favre/playlist/1X12rn1N7SWQuBaxGcVz16?si=nJJ6ez1ORqm5czlpbBdj7A", "fkyle21/playlist/4JajIPREKMVIr55XPBxgIq?si=Ons8wCQhRXWGrxontJJKIg", "madiparis100/playlist/45NcABM9CfHEdxCD2U59Se?si=pZB_D1EKTHyz0MU_b9DlWw"];
                    var randomIndex = Math.floor(Math.random()*joyPop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + joyPop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "electronic") {
    
                    var joyElectronic = ["cmihran/playlist/4FW02V8r0GQxCAckzGRKl6?si=_FCzd2zLTICCVkJTCl0W8w", "nicolaschun4577/playlist/3qEhZ8gXTmoUiJVFN6t88p?si=GLrq29OXSyyzlA4F2H71Xg", "sonymusicentertainment/playlist/5L8kmuWZJL1DJgNaICXKYi?si=cQg-L2HoTuSuRQLyy2tbVA", "derlooord/playlist/3AbPwd548dJLTaxpsZ8FQI?si=hUO2a3-lQs2yky2i359vSw", "spotify/playlist/37i9dQZF1DWYBO1MoTDhZI", 
                    "joelegolvan21/playlist/33g666JlpoCauQpP7BW78N?si=YUJlW56xRnuPNRXnWPyx7A", "1135569240/playlist/6puFQGV7LwEjKR9IfzkCCf?si=JUp6i9ArQcCvwhe6FeohkQ", "1135974523/playlist/2kPKDZcZQdR02jDAdsx9tW?si=dc4haY1cQOuoPCOMHQXgkQ", "vero-dubois/playlist/4atmJJiVG9LrfoXDex0Sru?si=LsB6b7mAQJ-B9fxCGUpguQ"];
                    var randomIndex = Math.floor(Math.random()*joyElectronic.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + joyElectronic[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    console.log(genreChoice);
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "hip-hop") {
    
                    var joyHipHop = ["notkevinstoley/playlist/5qYlKze6iLqi0UiFsqDlAL?si=x0iA_ZnRQE-IXtr37aGMRQ", "spotify/playlist/37i9dQZF1DX0XUsuxWHRQd?si=d97NMb7pT4SEowJm4diK9w", "spotify/playlist/37i9dQZF1DWY4xHQp97fN6?si=vkerzxUvQC2h_CXpXM90fw", "spotify/playlist/37i9dQZF1DX186v583rmzp?si=ORNnPoTZRG2n-M9oN0HYPg", "spotify/playlist/37i9dQZF1DWW3mVKqVYIFi?si=9Adz7RfPTl-tx67VH997Ew",
                    "44dtqjgy37pjulgl5xhafj5mu/playlist/5yVZLvDKmgqU60cYgH60bS?si=l7TCnw9HT3iJWMIXMmJvjQ", "hannes0ta/playlist/5CJEHOgaHVp7kXiJ0yeMis?si=Jg81Mr3CQqibSu_21SSwvA", "12132186884/playlist/0sgucuJz2tYLJArRM6NsyP?si=rjH8nOSeTx-2RSBHBA9x9Q"
                    ];
                    var randomIndex = Math.floor(Math.random()*joyHipHop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + joyHipHop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "indie") {
    
                    var joyIndie = ["spotify/playlist/37i9dQZF1DWSkMjlBZAZ07", 
                    "sonymusicnl/playlist/7ddF8HQX3A1tCkZv1AN77S?si=eWsCtSlcS6id515oXh5OhA", "alxrnbrdmusic/playlist/2WSQOTscbCoNpovNL6J35n?si=6yEdrdvrSE6nyXPEl7g8Wg",
                    "emi2332/playlist/3oTIYE9O8IcqtJruuk1cjg?si=Ha9v9r-mRCyMcmF7XJJyFw", "1181952632/playlist/4qOOLk1jaIBiB2661gBu2Z?si=RWySMqnwRUWq5jrP6GBuLw",
                    "12136562497/playlist/7quXDVGoy13517tAj6bnDR?si=V6ARJGisTP-kF6jeGado8Q",
                    "sanik007/playlist/2UrxDORJc8Gvx4wmhkaHuZ?si=K8-DCtTcQeWN5ocNhOIc0g",
                    "sanik007/playlist/178APKGN54qS1Utvaink7S?si=7I61hQykTgyxP0qQJ0gMsA" ];
                    var randomIndex = Math.floor(Math.random()*joyIndie.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + joyIndie[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
            }
    
            //ANGER
            if (strongestEmotion === "anger") {
    
                if (genreChoice === "rock") {
    
                    var angerRock = ["adamwannan/playlist/7EHi89t6C9jozEBhrtPzQU?si=qH5PCW0jRByaWhAveX37ig", "huntervogel1/playlist/2yhKcaUgTRqEjbsGCPby6g?si=xg56ZgiYQsiWrPQ469i98A", "spotify/playlist/37i9dQZF1DX1tyCD9QhIWF"];
                    var randomIndex = Math.floor(Math.random()*angerRock.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + angerRock[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "pop"){
    
                    var angerPop = ["anniewerner/playlist/4ca6MwaTAiz852ZffCSWRS?si=lH3-ifgFT2624UlS4gMKPg", "fitsugar/playlist/7zUhXOxlrSeuUfgGgzR4AX?si=PRkj1a_iRu6A9B0Sr76QqA", "12168050655/playlist/0jCSuCJEncEmXl9PQIUMkj?si=LPK1bCn6RNSJ3sXrmgPDqQ"];
                    var randomIndex = Math.floor(Math.random()*angerPop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + angerPop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "electronic") {
    
                    var angerElectronic = ["spotify/playlist/37i9dQZF1DX76Wlfdnj7AP?si=G-A8gHS7QNS4g3Vq3hAPEA", "12168404324/playlist/0uIfc8Y8m1ZFFZ2dTIzLdA?si=WKDDJWYYRb2Nq1ckR-2zSw", "gorgik/playlist/1hdEF6nCRdhYJ5a2QG54jW?si=I_pv7dbhQBSuS5R6Pq4Ktg"];
                    var randomIndex = Math.floor(Math.random()*angerElectronic.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + angerElectronic[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    console.log(genreChoice);
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "hip-hop") {
    
                    var angerHipHop = ["kerwino/playlist/4mCGD3C9QXhrWv3uBIpbRF?si=SEkE9G5CSsiRYbtMJUDAzw",
                "1265383759/playlist/0Y9jnBCaOyVBDdouyHK2ii?si=67qhvIuySWeQ8_yWpmg-jA", "sunlitsage/playlist/5lwo8EzRL9IEl6mHpdWZHL?si=xfsH7m5sSXK0Y5elfSDCrw"];
                    var randomIndex = Math.floor(Math.random()*angerHipHop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + angerHipHop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "indie") {
    
                    var angerIndie = ["1268609393/playlist/1qOGt1aQkgp2upO07ZuwRJ?si=B_UwhXLWQU6FHO71SDjIlQ", "calumman17/playlist/0WWeaE3nSylcS9ql0IrejN?si=sjpjRd2jRDqKtuIKoLWt2w", "rer13b/playlist/5311HiUlLvIN61gJZe2TxX?si=d2t2PVDzQJuPxc92uRPITQ"];
                    var randomIndex = Math.floor(Math.random()*angerIndie.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + angerIndie[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
            }
    
            //DISGUST
            if (strongestEmotion === "disgust") {
    
                if (genreChoice === "rock") {
    
                    var disgustRock = ["stealthyelf17/playlist/3Wi6oDCqZCAoeWn7kdbC8l?si=BeEbPdeNRd-scYGeQSGk3w", "spotify/playlist/37i9dQZF1DX7k3T9O9bscd?si=6n_lDaDkSe6CHMg6uxDssA", "ikebrunkow/playlist/3uqAF7GlAoB58pMuPFD7un?si=8g4aYgX7RZ-vS2qjuVJ1EQ"];
                    var randomIndex = Math.floor(Math.random()*disgustRock.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + disgustRock[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "pop"){
    
                    var disgustPop = ["juandurfelworld/playlist/1SUu5S4mKpyOEeuImxGM64", "sijo52/playlist/2yviiRXzq3x8Jx8qAZLza4?si=O2U_grPXSECAq3WBsP3Miw"];
                    var randomIndex = Math.floor(Math.random()*disgustPop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + disgustPop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "electronic") {
    
                    var disgustElectronic = ["spotify/playlist/37i9dQZF1DX2VvACCrgjrt?si=-tNs2g38RJyMnd-xJM1PSw", "x0supq26im83z2sehx5avokni/playlist/0td0QYHChPLazY7uQHfefY?si=syR-9x_gTBaXw2REkG8dkA", "shponglemusic/playlist/5w72FrmmT9R1CqsMiUYORk?si=HRpyJV-2RTuuwBpoLm2j6Q", "seand719/playlist/5jIO7X7Wq4sp1kLZCi83XF?si=r4frc44PT6CoGJZZF2tEZQ", "spotify/playlist/1Fawk7qeF2iKL2MLTQFQGD"];
                    var randomIndex = Math.floor(Math.random()*disgustElectronic.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + disgustElectronic[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    console.log(genreChoice);
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "hip-hop") {
    
                    var disgustHipHop = ["1240405531/playlist/3lVkLGjwIg9l5QIcWWTPHU?si=yElSuA-cTcCMbKT3KVNoKg", "seanhockey8/playlist/6MRCgwQC5ZTxQ6477046QI?si=iPbZ3BaqTpSEYQ7PaNhsCw"];
                    var randomIndex = Math.floor(Math.random()*disgustHipHop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + disgustHipHop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "indie") {
    
                    var disgustIndie = ["tomwiththemusic/playlist/7oNxT0OfeAtfpSqk2eMB12?si=I3qIcrtgQNehJ1-ZTw_a7w", "1282590447/playlist/20jdj4iRAsO7BGhzWScF2Z?si=ZAmT5cxJRlm8VBVWHZF6hQ"];
                    var randomIndex = Math.floor(Math.random()*disgustIndie.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + disgustIndie[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
            }
    
            //FEAR
            if (strongestEmotion === "fear") {
    
                if (genreChoice === "rock") {
    
                    var fearRock = ["1113800793/playlist/5NWoCkC6PkSwoHIfmECZAH?si=IedcI72BSf2U3rSXr1JVig", "campanale252/playlist/38UqQL1dLUnsDVE4IQGqi3?si=xgQ8Ts3eQkyb0MS-dDXUOw", "spotify/playlist/37i9dQZF1DX9wa6XirBPv8?si=nCaXI9FPQ-GNfOuJsEi1PQ"];
                    var randomIndex = Math.floor(Math.random()*fearRock.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + fearRock[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "pop"){
    
                    var fearPop = ["sqot/playlist/4L7wdWg7VrRNOh7BMnQvWh?si=F3YoypcaSx6NDUHjIfpnqg", "michaelahyow/playlist/5qZBUyNqeoJ7IL1K8V8e1L?si=tRgRWqBYT-q2KCTm3_I-Fg"];
                    var randomIndex = Math.floor(Math.random()*fearPop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + fearPop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "electronic") {
    
                    var fearElectronic = ["eradiel/playlist/22jV8DlAdlWUeOYtOcIHPF?si=Sx3LqamrTqWWjqr-QQGhCA", "12138174879/playlist/1BM3VyKTJfIA9PI8wfQuuM?si=yvasj8_MTYSorRSnq8kc9g", "danielroybal/playlist/1t7OhTEObDQ3M45rc9IOWd?si=9Py2uMuNQb-47VgMnkjJ1Q"];
                    var randomIndex = Math.floor(Math.random()*fearElectronic.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + fearElectronic[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    console.log(genreChoice);
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "hip-hop") {
    
                    var fearHipHop = ["tayfun.99/playlist/4qWJAIt04UfZ6bTP5VP1Xv?si=lA0ZREcTT_K-h_VEPvWMxw", "11138368418/playlist/4YcBuNpCcjnba4u8SIq93c?si=JZC9e7tMT-OurgKrqbIZVg", "nedoga/playlist/6UCg39owLd9LsNLul2KpLC?si=GP-352CUTj6VYR1mBv311w"];
                    var randomIndex = Math.floor(Math.random()*fearHipHop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + fearHipHop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "indie") {
    
                    var fearIndie = ["1149327321/playlist/4RaXcsAFGwi02k3aPFhEPe?si=F-i10vE_TPmk-hjkFnVTdg", "1o84mb209h5jntphr9u5vlfek/playlist/3JabXQK1fWWdDBAIKhC20S?si=s_4YpiSuTEmQsF_V5MNFLg", "1263132674/playlist/2xbMILQC7tzv0Sw0Jsaf7k?si=q9FgNK3gTq-RGsVn0_9dvg", "22k4thvovj4fn4lgpvvradabi/playlist/4ddFmu9cIsQat7451P2ppU?si=rmuage3_QbSpIjcjYj1F5Q", "androgena44/playlist/5Ux55PgEjNx4DX0VqlMEr8?si=YOEEmTjiRjyqOgAy7CGRbg"];
                    var randomIndex = Math.floor(Math.random()*fearIndie.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + fearIndie[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
            }
    
            //SADNESS
            if (strongestEmotion === "sadness") {
    
                if (genreChoice === "rock") {
    
                    var sadnessRock = ["22sdelatipo7d7d7mhtttbq6y/playlist/2PL6fUigWwg66lHUsLWp61?si=UxgkQXfESqCzp6Un65wgag",
                    "tomascerveira/playlist/7K6OfhWwTTT3pnDOgOFAmo?si=gEz2FzR0R0SWt_5Q7AgVFg", "teugion/playlist/32xM33dhvlVsnvCcMWDZ68?si=NMgXeGIPSdKJ7GrsV0SYkw", "spaceman769/playlist/2OYu3BebwgIeztXOc9lQUY?si=YDSbCl-cTBGIJx9335mzPA", "12130910266/playlist/1gjxn7reGhdYN5BgtVLoNG?si=HLwyROwIQyaI9sAiX3w6pw", "caitxisxfab/playlist/2G8v0rC3yP7Eaj86RTer2M?si=EzDjFr8kQvOruCyKU1fpoA", "kingknowles/playlist/6V2Gbag4NZinNyeyQVpxPQ?si=N09-XFSlTW6PcsGZc8IrPA", "karathauer/playlist/1YHXDjnkJO0UwKOsGOiyZA?si=3xvlkpERQE6hT48vjEwaqw",
                    "1215006120/playlist/6Gt4Q6hgowx2zPeGMMWyZ4?si=B41QcoFdTSWGm9cchUK9yg",
                    "kingknowles/playlist/6V2Gbag4NZinNyeyQVpxPQ?si=Ja4Z43ujSRW4Dc20ODaM3A"];
                    var randomIndex = Math.floor(Math.random()*sadnessRock.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + sadnessRock[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "pop"){
    
                    var sadnessPop = ["darien1126/playlist/1Iq0NzMH4xnPSoJY4OXcFr?si=6UbpPZn2SXylcQaAxhwj2w", "michaela.agee/playlist/4ncvRmDsxOPrgNcUQ4CYMh?si=eRnkvPn_TCCNPI6mrMef1w", "enkennelly/playlist/5ngzYTyvT5UnRSoTj0rUPC?si=ruJFdc5RTqCw8g6U07WkDg", "22es2mpssalrkuzaoutb6kxmi/playlist/2IpSLfiAv855GFVJ0STicJ?si=IUUvh-2SSKe2st2cVA2NQg", "1257554784/playlist/4vtNlBr6L9DDMWBFlxH40k?si=VosRWHOGRkGBc5GHAKYtSg", "mrvica.890/playlist/124IQDMnINOyZmkrbXTrqB?si=uR4RwxgJR8qBQ2prgHT7ZQ", "jayjaytmnt/playlist/46jmMz0va7hSBpYZ0km0J0?si=wjI8STU_RvCxPWpqc5Z5Ww", "imnataliem/playlist/13tOEiyvvqftPFLoC7XJtX?si=YTk4mUzAR1uWyXvz4G1U-Q"];
                    var randomIndex = Math.floor(Math.random()*sadnessPop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + sadnessPop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "electronic") {
    
                    var sadnessElectronic = ["tranquicity/playlist/11BRxrRM9e5Qa6GGmTBFNw?si=uFiXux3XS9mgbxVZAC2Fhg","suicidesheepify/playlist/3DQA5O85gsUYPfM8def1zo?si=lIUlu73LScu29Epq2icj0g", "1154427251/playlist/40jr1n77fqij6qECIb5BX8?si=cFJyifuWSwm0nG60dfO6CQ", "jakkar-nl/playlist/4o3gKFu47w64bsCyFMbNXW?si=iRg5QIpyS0Gk4lUcSyY3cw", "yangx2/playlist/3iGLc3KWBsDAwIoDzoPKa1?si=rJUNcuMqStO3GtlC-GJszw", "yqagzhdcrnyy6uu2ag69kwo0d/playlist/7D8fQoPR4PJGta7Nv991qQ?si=4bIWoYXEQReUffuK1SA_Zw", "joetehgamer/playlist/5ogZfYBWAh9oM5sTDx4pYP?si=hdu2RcLrRK60xbaxOmUvWg", "juliankhw/playlist/4eel69kXg3sff9FXonZeFk?si=jLrHa1fGQlO58e63dphInA", "1156907761/playlist/668GGNbUMDcWWXcyxHjMIk?si=IgsHOcliTBKhqvBTEFK3Tg",
                    "ericgc1997/playlist/5pVbt8FniOoJgffxR2R5DB?si=rw3BVwozSzmr2CQEsqQI0A", "12129625368/playlist/7FNwAuLX837Ik9JXXg1PR1?si=iA3Bnr_JRbGDPF6mPQHKXQ", "razf/playlist/7zwYkH7y8hy4QhzwY48KoO?si=t5XMaM1uSmmmB_r_xv0a1Q"];
                    var randomIndex = Math.floor(Math.random()*sadnessElectronic.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + sadnessElectronic[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    console.log(genreChoice);
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "hip-hop") {
    
                    var sadnessHipHop = ["spotify/playlist/37i9dQZF1DX6xZZEgC9Ubl",
                    "nceagles/playlist/5c1Z80Ymv2sDAKCjm16dcM?si=u6jV-q-iRZO3w0JeT_KB1A", "1120431800/playlist/3uPU6am3ph9bYpplLWj4Sa?si=LmiDXvdBSuyHeVAnXE6bDA", "mystisking/playlist/7urNoNYkexOsYH9bgveivu?si=tQVD6WoSTly6o7SEB84aaQ", "jurgensen_ben/playlist/4XpY2PtCUqzhddUnFEbckt?si=OZmS1WxRSMOyF8QAnJb6JA",
                    "leah_jannetti/playlist/6yzfHGOsyzTx0JlGwqeNXI?si=XQD18fO9RuO_BCG-6a52sA", "daisyeklof/playlist/6gIZkBX7sd63PxxEgkzyaY?si=IFqd-pznQ2uI685nUQDPVA", "lalanjel/playlist/23JiGiNyzfbQ9F0PPnGSY7?si=W9c1c7wMSmSg_0upk6wUEQ",
                    "mahaliamcdaniel/playlist/4KzvLga8BQgUF29x38iKZY?si=6QGsBK7JTeONViCfKZp9QQ"];
                    var randomIndex = Math.floor(Math.random()*sadnessHipHop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + sadnessHipHop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "indie") {
    
                    var sadnessIndie = ["spotify/playlist/37i9dQZF1DWVV27DiNWxkR",
                    "spotify/playlist/37i9dQZF1DWTtTyjgd08yp?si=je2D-fsVSL6lsm1BwXOdVg","11177484791/playlist/24dvWxJKVpDNYaXGnebiAW?si=BgHH_9tMSfuE5GByalHidg", "jessie_elizabeth_wade/playlist/0CXlEur9u22QQ4WVqdQsnW?si=qqzuXPrYSSqF4Vqy_yFMYw", "1259387454/playlist/57MrdnLEVLu00VfCZD4EOP?si=MJ3X8so_SNSjgu9Qx16h5g", "jttotpvjqyuxciileecrtic0e/playlist/05Ql2rqMri56ReEsKEheKy?si=CEaqglGqSzmMICg6pWN5iw", "genericsadnessgirl/playlist/3PchujUsQ0u1d9LmdPmxKN?si=BtJd7Ha6QP28IkAPZqNETg", "sanik007/playlist/78chSqjM9vnycjGsMQ4KK4?si=D5PVbaeyTdWZYHD3FH2rNA", "echosofficial/playlist/2PC3ccRzBYNSUx5IXgxvHp?si=ho8KxmdhQF-rjnCUeAaqgA", "spotify/playlist/37i9dQZF1DX4jSp9PHDkEC?si=GWyHWliwQUSQZMTfVNlG-Q"];
                    var randomIndex = Math.floor(Math.random()*sadnessIndie.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + sadnessIndie[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
            }
    
            //SURPRISE
            if (strongestEmotion === "surprise") {
    
                if (genreChoice === "rock") {
    
                    var surpriseRock = ["easyspotifyit/playlist/6HRQmYj9V0RTHl9Rz22q8E?si=6v5HNcneQvabfxBnxKFcAQ", "12141224409/playlist/33rPuTF1VYlXDfxzaSfZiF?si=2JRw1u8ET8uf5rTx83vNQQ", "https://open.spotify.com/user/1241169850/playlist/6uFGFwaneRYIRp3sieqcs8?si=nSRdElDTTBuqnG5zpBuwDQ", "https://open.spotify.com/user/12141224409/playlist/5bIOZrnHZ7IWOH8bDr0nLZ?si=VXCmCes7RYO488VXUkop9g"];
                    var randomIndex = Math.floor(Math.random()*surpriseRock.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + surpriseRock[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "pop"){
    
                    var surprisePop = ["1231264598/playlist/2yMzyJyW90MwdR73GLqQrp?si=iZA33en8Tbucw8ql-Pl9Ng", "1279905851/playlist/4rf4Fm7oAV8FnxkwzgTdd5?si=QF_ZiAjKR4aCbO-OxiiiWg", "spotify/playlist/37i9dQZF1DWSt89CX9de4L?si=w_f1rrK2SUSDdOpF0QftsA", "21vi27aas7m4plsuqzrir3oxa/playlist/0hlSvRQEWrtgQudVkgCFFt?si=kAQxVDw3TH2LzNWFIcbNew"];
                    var randomIndex = Math.floor(Math.random()*surprisePop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + surprisePop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "electronic") {
    
                    var surpriseElectronic = ["spotify/playlist/37i9dQZF1DWVF0pvJ1YrL7", "spotify/playlist/37i9dQZF1DX8CopunbDxgW?si=VcxhiBRXQtmNNjxisY1V0w", "uyandrewlong/playlist/3G2fzKc7uR4UczkGheYZah?si=aO_qfjkaSKmWi99ZYRljKw", "1263812709/playlist/5mF8E4fi8G1WjMve3rO2bI?si=UGzwiyytT0qAS0gPbV8QuA"];
                    var randomIndex = Math.floor(Math.random()*surpriseElectronic.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + surpriseElectronic[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    console.log(genreChoice);
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "hip-hop") {
    
                    var surpriseHipHop = ["seth_aaron_hutton/playlist/4qcGpqO5g2r6C0fhTPZqRX?si=IeaDiD4lSnudfT2VRCqe_w", "wonderwoman9006/playlist/10opXFoFa0w0xwKFZHb6hL?si=UrrRdOhGTES5mI_5IYZUhw", "spotify/playlist/37i9dQZF1DX30w0JtSIv4j?si=vXL78VoUSuSa2jAFAujWcQ", "sonymusicentertainment/playlist/2nJsRFJkr7BegSfKpG2d7O?si=TOxOWEsDTkCG1zWpwrEqGQ", "bear-town/playlist/1rvMBmH0aPKsc5mJk5DAW2?si=WFv7-T4pQ522JPxEVHOVhQ"];
                    var randomIndex = Math.floor(Math.random()*surpriseHipHop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + surpriseHipHop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "indie") {
    
                    var surpriseIndie = ["caciafrickingbrinley/playlist/51Ca05x9QkTaA63dg4NWyP?si=ZOTA1xiKSX-cd3aTxMXh9w", "spotify/playlist/37i9dQZF1DZ06evO2vjEpW?si=8iziJqM4Ssy2Px0DdEtgCw", "kirajeanne/playlist/6amaqMWhSeN5jv7wlF7vfJ?si=lj5QJiDiQq2A1al0mjQJCw", "spotify/playlist/37i9dQZF1DWX9VXBLRgDqu?si=J0Cy7OQzSuOHKPIBuqwTTA", ""];
                    var randomIndex = Math.floor(Math.random()*surpriseIndie.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + surpriseIndie[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
            }
    
            //CHILL
            if (strongestEmotion === "chill") {
    
                if (genreChoice === "rock") {
    
                    var chillRock = ["luukku_/playlist/77IVfRs9Tz03TfcKoYrOK0?si=Wky0gFGCTzSAbzjNfWiHvA", "12176196223/playlist/37a2nlwryXDSLWGfzFMFGB?si=N3U65Hq7RBmWMpkeEb6oWQ", "spotify/playlist/37i9dQZF1DX2UXfvEIZvDK?si=8D6KFQEqS4qod2qleclCiA", "1194690767/playlist/3faAYjW8rUWcRC52820AQ9?si=K99S7ieTTw6OJLu4p5KgXg", "d8m8l/playlist/6cujTXm0be5UTAJmxOipBz?si=vS6cnj87RpS_Qu6cCo1zTQ", "1132351420/playlist/1m5e8YXMfmCy7RfuHLMwfJ?si=jk0fQFOOQFyFV0Jt68X8sg", "e7tap4v0v8ypaf1kawp7lx5bl/playlist/5yxwhFZbqkSlcRxk9s7ChT?si=LPOaRWo5T5Oni9AvSuf74g"];
                    var randomIndex = Math.floor(Math.random()*chillRock.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + chillRock[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "pop"){
    
                    var chillPop = ["calbrit0407/playlist/3zDZruOuCP5nb5ORI6kasR?si=y5lH7QsbQdC3Qhs2-Y2vQQ", "spotify/playlist/37i9dQZF1DX4WYpdgoIcn6?si=si7uB8UWTwu16k7MzDLpkA", "1181641130/playlist/6zK70m9xpU1VRXrtbWr3Wr?si=hjMV9smVSZatWO8lHzG1ag", "1299747796/playlist/4221XSW5GtzuctFH7yOmFX?si=z1Bq_nPkRM-vZu0YarZc_w", "jeannettet001gs/playlist/0vNIXOg1IUOKeWETQIMbWs?si=4rZpXkQ8QW6eRfnmi7R41A", "joesxph/playlist/6cT8ygpUE1Q6s9m0vYRcxM?si=fkHCP0VGSFmy8t2kDKY79w"];
                    var randomIndex = Math.floor(Math.random()*chillPop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + chillPop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "electronic") {
    
                    var chillElectronic = ["1246397672/playlist/0zkYfEBlFcoXT5CJOnxbx5?si=Acudru7KRtu1Fb6-gO7SVg", "lowlypalace/playlist/4255caFkn50N8gNSyhlTlV?si=Jkhm98OBTpC0rp8CDcXtNA", "chobobcon/playlist/5GLqkMFRLpRzQ5ChbPZ75o?si=113rxqLTQgyBT2iEBealRw", "nic_x3/playlist/2m93O8FX1wuvFZUHCHdR8X?si=FXF_Yw5YSOCMh49e9OWJQQ", "spotify/playlist/37i9dQZF1DX3Ogo9pFvBkY?si=PmpwzZcSSnCmMlSmY2zl8g", "21ifzjxggdajdpc4w6iqxslkq/playlist/6nlx9ZF7MtxiosJxvz1ROE?si=OhwrC5m7RsijY4tkEhbUZw", "1157638289/playlist/4iyo6SKHGk9D32uqkJ7Axo?si=KlxKib9oTr-PISu2V9n9xg"];
                    var randomIndex = Math.floor(Math.random()*chillElectronic.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + chillElectronic[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    console.log(genreChoice);
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if (genreChoice === "hip-hop") {
    
                    var chillHipHop = ["chillhopmusic/playlist/74sUjcvpGfdOvCHvgzNEDO?si=HhiFzLYsTj2U5w_TE4OHXA", "1249683057/playlist/127nYNYE0UQKuoXSfZzGJv?si=s6cqIlw3SZCreTDebhvTkw", "spotify/playlist/37i9dQZF1DX2UgsUIg75Vg?si=K2TGWuKmRkORmMLooZKnmA", "spotify/playlist/37i9dQZF1DX889U0CL85jj?si=b4nZdOe-RICaIQH-31ID_Q", "dhohgzj361rygqw63n4964aob/playlist/6dALwmMGDgKPSLlKFnE7IQ?si=m8vxA_WsRwmWPZ_W91BUhQ", "coatsie/playlist/0bTXKaNLOK2oq7PLzs4X0O?si=sXBMeeuGRsqUPwNJgHkKcg"];
                    var randomIndex = Math.floor(Math.random()*chillHipHop.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + chillHipHop[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
    
                if(genreChoice === "indie") {
    
                    var chillIndie = ["spotify/playlist/37i9dQZF1DWWv6MSZULLBi?si=jBLoVOrnQmK_WoI-RCjFZw", "kymnx/playlist/4dl5lKPPuupOFljKBOOToD?si=hm0OwAkdSzu7oChq26MI3g", "spotifyacc12-au/playlist/3AQvpfZKaesFCE2kyCdb7l?si=lKeE-Gk5SAahk5_CCO-Kjg", "spotify/playlist/37i9dQZF1DWWv6MSZULLBi?si=y4acZRTVTuqUR3XvZxre0w", "spotify/playlist/37i9dQZF1DXat5j4Lk8UEj?si=bqSF30YqRkq232s6j_vtJg", "spotify/playlist/37i9dQZF1DWSkMjlBZAZ07?si=NtyULDrLSr29fYtOkxxdmw"];
                    var randomIndex = Math.floor(Math.random()*chillIndie.length);
                    var randomPlaylist = "<iframe id='iframe' src='https://open.spotify.com/embed/user/" + chillIndie[randomIndex] + "' width='300' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>";
                    
                    $("#spotify-playlist").html(randomPlaylist);
    
                }
            }   
            
                }).on('error', function (payload) {
                    M.toast({html: "I'm sorry, there was an error fetching your GIF. That sucks huh? Maybe try again?"});
                    console.log(payload);
                });
    
                }).on('error', function (payload) {
                    M.toast({html: "I'm sorry,  but that picture can't be analyzed. Please try another photo."});
                    console.log(payload);
                    })    
            }else{
               M.toast({html: "I'm sorry, please login/create an account to generate a playlist."});
            }}
    
             $("#favoriteBtn").on("click", function(){
                        let uid = firebase.auth().currentUser.uid;
                        let jif = $("#mood-gif").attr("src");
                        let playlist = $("#iframe").attr("src");
                        firebase.database().ref("users/" + uid + "/favorites/").push({
                            gif:jif,
                            playlist: playlist,
                            dateAdded: firebase.database.ServerValue.TIMESTAMP
                       });  M.toast({html: "Playlist added to Favorites. Listen again on Favorite's page."});
                   })
    });