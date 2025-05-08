import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {collection, doc, getFirestore, onSnapshot, updateDoc, setDoc, deleteDoc, getDocs} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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
            if (!$scope.dataInicial || !$scope.dataFinal || !$scope.valorInicial || !$scope.valorFinal) {
                return;
            }

            for (let i = $scope.valorInicial; i <= $scope.valorFinal; i++) {
                let titulo = `Pergunta ${i}`;
                var pergunta = $scope.perguntas.firstOrDefault(null, q => q.Id === titulo);
                if (pergunta === null)
                    continue;

                let document = doc(firestore, "Pergunta", pergunta.Id);

                pergunta.DataDeLiberacao = $scope.dataInicial;
                pergunta.DataFinalDeLiberacao = $scope.dataFinal;

                updateDoc(document, pergunta).then(function () {
                    $scope.$apply();
                }).catch(function (error) {
                    $messages.error(error.message);
                });
            }
        };

        $scope.zerarRespostas = async function () {

            var perguntas = [];
            var perguntasDoFirebase = await getDocs(collection(firestore, "Pergunta"));

            perguntasDoFirebase.forEach(function (perguntaDoFirebase) {

                let document = perguntaDoFirebase.data();

                perguntas.push({
                    Id: perguntaDoFirebase.id,
                    Numero: parseInt(perguntaDoFirebase.id.replace(/\D/g, "")),
                    Correto: document.Correto
                });
            });

            var dicionario = [];

            let respostas = await getDocs(collection(firestore, "Resposta"));
            respostas.forEach(function (resposta) {
                let telefone = resposta.id;                

                var respostasDoParticipante = resposta.data();
                for (let i = 1; i <= 56; i++) {
                    let pergunta = perguntas.first(q => q.Numero === i);
                    var respostaDoParticipante = respostasDoParticipante[pergunta.Id];
                    if (respostaDoParticipante != pergunta.Correto)
                        respostasDoParticipante[pergunta.Id] = pergunta.Correto;                   

                    // updateDoc(resposta, pergunta).then(function () {
                    //     $scope.$apply();
                    // }).catch(function (error) {
                    //     $messages.error(error.message);
                    // });
                }

                dicionario[telefone] = respostasDoParticipante;

            });

            for (const [key, value] of Object.entries(dicionario)) {
                let document = doc(firestore, "Resposta", key);

                updateDoc(document, value).then(function () {
                    $scope.$apply();
                }).catch(function (error) {
                    $messages.error(error.message);
                });
            }

            //
            //
            // let respostas = await getDocs(collection(db, "Resposta"));
            // respostas.forEach(function (resposta) {
            //     let telefone = resposta.id;
            //     let participante = $scope.participantes.first(q => q.Id === telefone);
            //     let respostasDoParticipante = resposta.data();
            //
            //     for (let i = 1; i <= 2; i++) {
            //         let titulo = `Pergunta ${i}`;
            //         var pergunta = $scope.perguntas.firstOrDefault(null, q => q.Id === titulo);
            //         if (pergunta === null)
            //             continue;
            //
            //         let document = doc(firestore, "Resposta", pergunta.Id);
            //
            //         pergunta.DataDeLiberacao = $scope.dataInicial;
            //         pergunta.DataFinalDeLiberacao = $scope.dataFinal;
            //
            //         updateDoc(document, pergunta).then(function () {
            //             $scope.$apply();
            //         }).catch(function (error) {
            //             $messages.error(error.message);
            //         });
            //     }
            //    
            //
            //    
            //
            //     $scope.perguntas.forEach(function (pergunta) {
            //         let respostaDoParticipante = respostasDoParticipante[pergunta.Id];
            //         if (respostaDoParticipante === pergunta.Correto)
            //             participante.Pontuacao++;
            //     });
            //
            //     // let dados = participante.data();
            //     //
            //     // $scope.perguntas.push({
            //     //     Id: pergunta.id,
            //     //     Numero: numero,
            //     //     Correto: dados.Correto
            //     // });
            //
            // });
        };
    });
})();