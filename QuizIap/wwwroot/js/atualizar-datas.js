import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {collection, doc, getFirestore, onSnapshot, updateDoc, setDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

(function () {
    const app = angular.module("app");

    app.controller("AtualizarDatasController", function ($scope, $messages) {

        let firestore;

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

            const firebaseApp = initializeApp(firebaseConfig);

            firestore = getFirestore(firebaseApp);
            let collectionPerguntas = collection(firestore, "Pergunta");

            onSnapshot(collectionPerguntas, (querySnapshot) => {

                $scope.perguntas = [];

                querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    $scope.perguntas.push({
                        Id: doc.id,
                        DataDeLiberacao: new Date(data.DataDeLiberacao.seconds * 1000),
                        DataFinalDeLiberacao: new Date(data.DataFinalDeLiberacao.seconds * 1000),
                    });
                });

                $scope.perguntas.sort((a, b) => {
                    let numeroA = parseInt(a.Id.replace(/\D/g, ""))
                    let numeroB = parseInt(b.Id.replace(/\D/g, ""))
                    return numeroA - numeroB;
                });

                $scope.$apply();
            });


        }

        $scope.iniciar = function () {
            configurarFirestore();
        };

        $scope.alterarDatas = async function () {
            if (!$scope.dataInicial || !$scope.dataFinal) {
                return;
            }

            var perguntasSelecionadas = $scope.perguntas.where(q => q.Selecionada === true);

            perguntasSelecionadas.forEach(pergunta => {
                let document = doc(firestore, "Pergunta", pergunta.Id);

                pergunta.DataDeLiberacao = $scope.dataInicial;
                pergunta.DataFinalDeLiberacao = $scope.dataFinal;

                updateDoc(document, pergunta).then(function () {
                    $scope.$apply();
                }).catch(function (error) {
                    $messages.error(error.message);
                });

            });


        };
    });
})();