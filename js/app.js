(function () {
  "use strict";
  angular
    .module("NarrowItDownApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service("MenuSearchService", MenuSearchService)
    .directive("foundItems", FoundItemsDirective)
    .factory("MenuSearchFactory", MenuSearchFactory)
    .constant("ApiBasePath", "https://davids-restaurant.herokuapp.com");

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: "foundItems.html",
      scope: {
        found: "<",
        onRemove: "&"
      },
      controller: FoundItemsDirectiveController,
      controllerAs: "ctrl",
      bindToController: true
    };
    return ddo;
  }

  function FoundItemsDirectiveController() {
    var ctrl = this;

    ctrl.isEmpty = function () {
      return ctrl.found != undefined && ctrl.found.length === 0;
    };
  }

  NarrowItDownController.$inject = ["MenuSearchService"];

  function NarrowItDownController(MenuSearchService) {
    var ngController = this;

    ngController.searchTerm = "";

    ngController.narrowIt = function () {
      if (ngController.searchTerm === "") {
        ngController.items = [];
        return;
      }
      var promise = MenuSearchService.getMatchedMenuItems(
        ngController.searchTerm
      );
      promise
        .then(function (response) {
          ngController.items = response;
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    };

    ngController.removeItem = function (index) {
      ngController.items.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ["$http", "ApiBasePath"];

  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: ApiBasePath + "/menu_items.json"
      }).then(function (result) {
        var items = result.data.menu_items;

        var foundItems = [];

        for (var i = 0; i < items.length; i++) {
          if (
            items[i].description
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) >= 0
          ) {
            foundItems.push(items[i]);
          }
        }

        return foundItems;
      });
    };
  }

  function MenuSearchFactory() {
    var factory = function () {
      return new MenuSearchService();
    };

    return factory;
  }
})();
