import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, collection, doc, setDoc, getDoc, onSnapshot, getDocs} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

(function () {
    const app = angular.module("app");

    app.controller("ParticipanteController", function ($scope) {
        function configurarFirestore() {
            const firebaseConfig = {
                apiKey: "AIzaSyBaS996gkDTjwCwwMk1M0KLljUUvkVrOsU",
                authDomain: "torredecomando-7b24c.firebaseapp.com",
                projectId: "torredecomando-7b24c",
                storageBucket: "torredecomando-7b24c.firebasestorage.app",
                messagingSenderId: "365860858872",
                appId: "1:365860858872:web:994adf54fa4bc5cb1f440d",
                measurementId: "G-0PDPVK2HK7"
            };

            const app = initializeApp(firebaseConfig);

            const db = getFirestore(app);
            var collectionDeParticipantes = collection(db, "Participante");

            onSnapshot(collectionDeParticipantes, (querySnapshot) => {

                $scope.participantes = [];

                querySnapshot.forEach((doc) => {
                    var data = doc.data();
                    $scope.participantes.push({
                        Nome: data.Nome,
                        Telefone: doc.id,
                        DataDeCadastro: data.DataDeCadastro,
                    });
                    $scope.$apply();
                });
            });


        }

        $scope.iniciar = function () {
            configurarFirestore();
        }
    });
})();