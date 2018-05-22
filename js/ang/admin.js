angular.module("app").controller('dashboard', function ($scope, userService, Upload) {

    $scope.item = {};
    console.log("Admin loaded ..");



    $scope.getAllItems = function () {
        userService.callService($scope, "getAllItems") .then(function (response) {
            console.log(response);
            $scope.items = response.items;
        });

    };
    
    $scope.edit = function(item) {
        if(item == null) {
            item = {};
        }
        $scope.item = item;
        $("#itemModal").modal('show');
    }
    
    
    
    $scope.getAllItems();
    
    $scope.saveItem = function () {
        console.log($scope.imageFile);
        
        if($scope.item.itemSector == null) {
            $scope.item.itemSector = {
                id: 2
            }
        }
        
        console.log($scope.item);
        
        
        Upload.upload({
            url: root + 'updateParentItem',
            data: {
                image: $scope.imageFile,
                item: JSON.stringify($scope.item)
            }
        }).then(function (resp) {
                console.log(resp.data);
                alert("Successful!");
                $scope.getAllItems();
            },
            function (resp) {
                console.log('Error status: ' + resp.status);
                $scope.errorMsg = "Error connecting server!";
                alert("Error!");
            },
            function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
    };

    $scope.deleteItem = function(item) {
        $scope.item = item;
        $scope.item.status = 'D';
        $scope.imageFile = null;
        $scope.saveItem();
    }
    


});

angular.module("app").controller('login', function ($scope) {

    $scope.response = {};
    console.log("Login loaded ..");

});
