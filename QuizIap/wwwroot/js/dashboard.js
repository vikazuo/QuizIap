import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, collection, doc, setDoc, getDoc, onSnapshot, getDocs} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

(function () {
    const app = angular.module("app");

    app.controller("DashboardController", function ($scope) {

        let db;

        async function configurarFirestore() {
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
            db = getFirestore(firebaseApp);
        }

        async function listarRanking() {
            await listarParticipantes();
            await listarPerguntas();
            await listarRespostas();

            $scope.$apply();
        }

        async function listarParticipantes() {
            let participantes = await getDocs(collection(db, "Participante"));
            participantes.forEach(function (participante) {
                let dados = participante.data();
                $scope.participantes.push({
                    Id: participante.id,
                    Nome: dados.Nome,
                    Pontuacao: 0,
                });

            });
        }

        async function listarPerguntas() {
            let perguntas = await getDocs(collection(db, "Pergunta"));
            perguntas.forEach(function (pergunta) {
                let dados = pergunta.data();
                let numero = parseInt(pergunta.id.replace(/\D/g, ""))
                $scope.perguntas.push({
                    Id: pergunta.id,
                    Numero: numero,
                    Correto: dados.Correto
                });

            });
        }

        async function listarRespostas() {
            let respostas = await getDocs(collection(db, "Resposta"));
            respostas.forEach(function (resposta) {
                let telefone = resposta.id;
                let participante = $scope.participantes.first(q => q.Id === telefone);
                participante.Pontuacao = 0;

                let respostasDoParticipante = resposta.data();

                $scope.perguntas.forEach(function (pergunta) {
                    let respostaDoParticipante = respostasDoParticipante[pergunta.Id];
                    if (respostaDoParticipante === pergunta.Correto)
                        participante.Pontuacao++;
                });

                // let dados = participante.data();
                //
                // $scope.perguntas.push({
                //     Id: pergunta.id,
                //     Numero: numero,
                //     Correto: dados.Correto
                // });

            });
        }

        $scope.iniciar = async function () {
            $scope.participantes = [];
            $scope.perguntas = [];
            $scope.respostas = [];


            await configurarFirestore();
            await listarRanking();
        }
    });
})();