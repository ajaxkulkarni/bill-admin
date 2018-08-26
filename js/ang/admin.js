angular.module("app").controller('items', function ($scope, userService, Upload) {

    $scope.item = {};
    console.log("Admin Items loaded ..");
    $scope.root = root;


    $scope.getAllItems = function () {
        userService.callService($scope, "getAllItems").then(function (response) {
            console.log(response);
            $scope.items = response.items;
        });

    };

    $scope.edit = function (item) {
        if (item == null) {
            item = {};
        }
        $scope.item = item;
        $("#itemModal").modal('show');
    }



    $scope.getAllItems();

    $scope.saveItem = function () {
        console.log($scope.imageFile);

        if ($scope.item.itemSector == null) {
            $scope.item.itemSector = {
                id: 4
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

    $scope.deleteConfirm = function (item) {
        $scope.item = item;
        $("#deleteModal").modal('show');
    }

    $scope.deleteItem = function () {
        //$scope.item = item;
        $scope.item.status = 'D';
        $scope.imageFile = null;
        $scope.saveItem();
    }



});


angular.module("app").controller('dashboard', function ($scope, userService, Upload) {

    $scope.item = {};
    console.log("Admin Dashboard loaded ..");
    $scope.root = root;

    $scope.loadSummary = function () {
        var invoice;
        if ($scope.month != null && $scope.month != "" && $scope.year != null && $scope.year != "") {
            invoice = {
                month: $scope.month,
                year: $scope.year
            }
        }
        $scope.dataObj = {
            invoice: invoice
        };
        userService.callService($scope, "dashboardSummary").then(function (response) {
            console.log(response);
            $scope.dashboard = response.dashboard;
        });

    };

    $scope.loadSummary();

});

angular.module("app").controller('vendors', function ($scope, userService, Upload) {

    $scope.item = {};
    console.log("Vendors loaded ..");
    $scope.root = root;

    $scope.loadVendors = function () {
        /*var invoice;
        if($scope.month != null && $scope.month != "" && $scope.year != null && $scope.year != "") {
            invoice = {
                month: $scope.month,
                year: $scope.year
            }
        }*/
        $scope.dataObj = {
            /*invoice: invoice*/
        };
        userService.callService($scope, "getAllVendors").then(function (response) {
            console.log(response);
            $scope.businesses = response.businesses;
        });

    };

    $scope.updateVendor = function (business) {
        $scope.vendor = business.owner;
        $scope.vendor.currentBusiness = {
            id: business.id,
            identificationNumber: business.identificationNumber
        }
        $("#saveModal").modal('show');
    }

    $scope.saveVendor = function () {
        console.log($scope.vendor);
        Upload.upload({
            url: rootUser + 'updateUserBasicInfo',
            data: {
                pan: $scope.panFile,
                aadhar: $scope.aadharFile,
                user: JSON.stringify($scope.vendor)
            }
        }).then(function (resp) {
                console.log(resp.data);
                $scope.loadVendors();
                alert("Successful!");
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

    }




    $scope.approveVendor = function (vendor) {
        vendor.status = 'A';
        $scope.dataObj = {
            user: vendor
        };
        userService.callService($scope, "updateUserStatus").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.loadVendors();
                alert("Vendor approved!!");
            } else {
                alert("Error!");
            }
        });
    }

    $scope.loadVendors();

});


angular.module("app").controller('login', function ($scope, userService, Auth, $location) {

    $scope.response = {};
    console.log("Login loaded ..");

    $scope.login = function () {

        $scope.dataObj = {
            user: {
                email: $scope.username,
                password: $scope.password
            }
        }
        userService.callService($scope, "login").then(function (response) {
            //alert(response.status);
            console.log(response);
            if (response != null && response.status == 200) {
                Auth.setUser(response.response);
                window.location.href = "/bill-admin/";
            } else {
                if (response.response == null) {
                    $scope.errorMsg = "Unauthorized!!"
                } else {
                    $scope.errorMsg = response.response;
                }

            }

        });

    }

    /* $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
         console.log($location.path());

         if (!value && oldValue) {
             console.log("Disconnect");
             $location.path('/login');
         }

         if (value) {
             console.log("Connect");
             //Do something when the user is connected
             window.location.href = "/bill-admin/";
         }

     }, true);*/

});
