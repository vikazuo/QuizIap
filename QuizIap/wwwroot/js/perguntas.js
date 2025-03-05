import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {collection, doc, getFirestore, onSnapshot, updateDoc, setDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

(function () {
    const app = angular.module("app");

    app.controller("PerguntaController", function ($scope, $messages) {

        let firestore;

        function proximoNumeroDisponivel(numeros) {
            const numerosOrdenados = [...new Set(numeros)].sort((a, b) => a - b);

            let numeroDisponivel = 1;
            for (let numero of numerosOrdenados) {
                if (numero > 0 && numero === numeroDisponivel) {
                    numeroDisponivel++;
                } else if (numero > numeroDisponivel) {
                    break;
                }
            }

            return numeroDisponivel;
        }

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
                    let video = '';
                    if (data.Video)
                        video = `https://www.youtube.com/watch?v=${data.Video}`;

                    $scope.perguntas.push({
                        Id: doc.id,
                        A: data.A,
                        B: data.B,
                        C: data.C,
                        D: data.D,
                        Correto: data.Correto,
                        DataDeLiberacao: new Date(data.DataDeLiberacao.seconds * 1000),
                        DataFinalDeLiberacao: new Date(data.DataFinalDeLiberacao.seconds * 1000),
                        Explicacao: data.Explicacao || '',
                        Texto: data.Texto || '',
                        Video: video,
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

            $scope.busca = "";
        };

        $scope.selecionarPergunta = function (pergunta) {
            $scope.perguntaSelecionada = pergunta;
        };

        $scope.adicionarPergunta = function () {
            var numerosDasPerguntas = [];

            $scope.perguntas.forEach(pergunta => {
                const numeroDaPergunta = pergunta.Id.replace(/\D/g, "");
                numerosDasPerguntas.push(parseInt(numeroDaPergunta));
            });

            let numeroDaPergunta = proximoNumeroDisponivel(numerosDasPerguntas);

            let id = `Pergunta ${numeroDaPergunta}`;

            let document = doc(firestore, "Pergunta", id);
            setDoc(document, {
                Id: id,
                A: '',
                B: '',
                C: '',
                D: '',
                Correto: '',
                DataDeLiberacao: new Date(2025, 0, 1, 0, 0),
                DataFinalDeLiberacao: new Date(2025, 11, 31, 23, 59),
                Explicacao: '',
                Texto: '',
                Video: '',
            }).then(function () {
                $messages.success("Pergunta adicionada com sucesso!");
            }).catch(function (error) {
                $messages.error(error.message);
            });
        };

        $scope.salvar = async function () {
            if ($scope.perguntaSelecionada.Video) {
                let url = new URL($scope.perguntaSelecionada.Video);
                $scope.perguntaSelecionada.Video = url.searchParams.get("v");
            }

            let document = doc(firestore, "Pergunta", $scope.perguntaSelecionada.Id);

            updateDoc(document, $scope.perguntaSelecionada).then(function () {
                let video = '';
                if ($scope.perguntaSelecionada.Video)
                    video = `https://www.youtube.com/watch?v=${$scope.perguntaSelecionada.Video}`;

                $scope.perguntaSelecionada.Video = video;
                $scope.$apply();

                $messages.success('Pergunta salva com sucesso!');
            }).catch(function (error) {
                $messages.error(error.message);
            });
        };

        $scope.excluir = function () {

            $messages.confirm(`Tem certeza que deseja excluir a  ${$scope.perguntaSelecionada.Id}`, function () {
                var document = doc(firestore, "Pergunta", $scope.perguntaSelecionada.Id);
                deleteDoc(document).then(function () {
                    $messages.success('Pergunta excluída com sucesso!');
                    $scope.perguntaSelecionada = null;
                    $scope.$apply();
                })
            });


        };
    });
})();