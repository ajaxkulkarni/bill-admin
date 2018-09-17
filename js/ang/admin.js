angular.module("app").controller('items', function ($scope, userService, Upload, Auth, $http) {

    $scope.item = {};
    console.log("Admin Items loaded ..");
    $scope.root = root;

    $('#datetimepicker1').datetimepicker({date: new Date()});

    //$scope.requestedDate = new Date();

    $scope.getAllItems = function () {
        userService.callService($scope, "getAllItems").then(function (response) {
            console.log(response);
            $scope.items = response.items;
        });

    };
    
    //
    
    $scope.updateCost = function () {
        
        console.log($('#requestedDate').val());
        
        $scope.dataObj = {
            item: {
                parentItemId: $scope.item.id,
                costPrice: $scope.costPrice
            },
            requestedDate:  new Date($('#requestedDate').val())
        };
        
        userService.callService($scope, "updateOrders").then(function (response) {
            console.log(response);
            if(response.status == 200) {
                alert("Done!");
            } else {
                alert("Error!");
            }
            
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
                'image': $scope.imageFile,
                'item': JSON.stringify($scope.item)
            },
            headers: {
                'Token': Auth.isLoggedIn(),
                'Accept': "application/json",
                'Content-Type': undefined
            }
        }).then(function (resp) {
                console.log(resp.data);
                alert("Successful!");
                $scope.getAllItems();
            },
            function (resp) {
                console.log(resp);
                console.log('Error status: ' + resp.status);
                $scope.errorMsg = "Error connecting server!";
                alert("Error!");
            },
            function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });

        /*var config = {
            transformRequest: angular.identity,
            headers: {
                'Token': Auth.isLoggedIn(),
                'Content-Type': undefined
            }
        };
        console.log("headers = >" + JSON.stringify(config));
        var fd = new FormData();
        fd.append('image', $scope.imageFile);
        fd.append('item', JSON.stringify($scope.item));
        var res = $http.post(root + 'updateParentItem', fd, config);
        res.success(function (data, status, headers, config) {
            response = data;
        });
        res.error(function (data, status, headers, config) {
            response = data;
            errorCode = status;
            console.log("Error :" + errorCode + ":" + JSON.stringify(data) + ":" + JSON.stringify(headers))
        });*/


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

    $scope.updateParentCost = function (item) {
        $scope.item = item;
        $("#costUpdate").modal('show');
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


angular.module("app").controller('settlements', function ($scope, userService, Upload, Auth, $http) {

    $scope.item = {};
    console.log("Admin Settlements loaded ..");

    $scope.approveVendor = function (vendor) {

    }

    $scope.getSettlements = function (type) {

        $scope.tab = type;
        $scope.dataObj = {
            requestType: type
        };
        userService.callService($scope, "getSettlements").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.pending = response.businesses;
            } else {
                alert("Error!");
            }
        });


    }

    $scope.initiate = function () {
        $scope.dataObj = {
            requestType: "INITIATE"
        };
        userService.callService($scope, "getSettlements").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                alert("Done!");
                $scope.getSettlements("PENDING");
            } else {
                alert("Error!");
            }
        });
    }

    $scope.download = function () {

        $scope.dataObj = {
            requestType: "DOWNLOAD"
        };

        var url = root + "downloadTransferExcel";
        $http({
            url: url,
            method: "POST",
            data: $scope.dataObj, //this is your json data string
            headers: {
                'Content-type': 'application/json',
                'Token': Auth.isLoggedIn()
            },
            responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {
            console.log(data);
            var blob = new Blob([data], {
                type: "application/vnd.ms-excel"
            });
            var objectUrl = URL.createObjectURL(blob);
            //window.open(objectUrl);

            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = objectUrl;
            a.download = "transfer.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);

        }).error(function (data, status, headers, config) {
            //upload failed
            console.log(data);
            console.log("Error!!!" + data);
        });
    }

    $scope.startSettlement = function (business) {
        $scope.business = business;
        $("#settlementModal").modal('show')
    }

    $scope.settle = function () {
        $scope.dataObj = {
            requestType: "SETTLE",
            business: {
                id: $scope.business.id
            },
            invoice: {
                paymentId: $scope.settlementId
            }
        };
        userService.callService($scope, "getSettlements").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                alert("Done!");
                $scope.getSettlements("INITIATED");
            } else {
                alert("Error!");
            }
        });
    }

    $scope.getSettlements("PENDING");



});
