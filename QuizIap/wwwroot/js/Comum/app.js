(function () {
    angular.module("servicesApp", []);
    angular.module("app", ["angular.helpers", "ngSanitize", "ngCookies", "servicesApp", "ui.bootstrap", "ngMask"]);
})();