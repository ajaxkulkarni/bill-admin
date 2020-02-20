angular.module("app").controller('items', function ($scope, userService, Upload, Auth, $http) {

    $scope.item = {};
    console.log("Admin Items loaded ..");
    $scope.root = root;

    $('#datetimepicker1').datetimepicker({
        date: new Date()
    });

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
            requestedDate: new Date($('#requestedDate').val())
        };

        userService.callService($scope, "updateOrders").then(function (response) {
            console.log(response);
            if (response.status == 200) {
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

angular.module("app").controller('vendors', function ($scope, userService, Upload, Auth) {

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

    $scope.getLocations = function (type) {

        $scope.dataObj = {

        };
        userService.callUserService($scope, "getAllAreas").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.locations = response.locations;
            } else {
                console.log("Error in locations!");
            }
        });
    }

    $scope.getAllItems = function (type) {

        $scope.dataObj = {

        };
        userService.callService($scope, "getAllItems").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.parentItems = response.items;
            } else {
                console.log("Error in items!");
            }
        });
    }


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


    $scope.addItem = function () {
        console.log("adding .." + $scope.selectedItem);
        var selectedItem = {};
        selectedItem.parentItem = $scope.selectedItem;
        selectedItem.selected = true;
        selectedItem.status = 'A';
        $scope.items.push(selectedItem);
    }

    $scope.loadBusinessItems = function () {
        if ($scope.vendor.currentBusiness == null) {
            return;
        }


        $scope.dataObj = {
            business: {
                id: $scope.vendor.currentBusiness.id
            }
        };
        userService.callUserService($scope, "loadBusinessItems").then(function (response) {
            console.log(response);
            if (response.status == 200 && response.items != null) {
                $scope.items = response.items;
                $scope.items.forEach(function (item) {
                    item.selected = true;
                });
            } else {
                console.log("Error in items!");
            }
        });
    }

    $scope.updateVendorFull = function (vendor) {
        $scope.vendor = {};
        $scope.items = [];
        console.log(vendor);
        if (vendor != null) {
            var business = angular.copy(vendor);
            $scope.vendor = angular.copy(business.owner);
            $scope.vendor.currentBusiness = business;
            business.owner = null;
            if ($scope.vendor.currentBusiness.businessLocations != null && $scope.vendor.currentBusiness.businessLocations.length > 0) {
                $scope.selectedLocation = $scope.vendor.currentBusiness.businessLocations[0];
            }
            if ($scope.vendor.currentBusiness.type == 'Distributor') {
                $scope.distributor = true;
            }
            //$scope.vendor.currentBusiness = vendor;
            //$scope.items = $scope.vendor.currentBusiness.items;
        }
        $scope.getAllItems();
        $scope.getLocations();
        $scope.loadBusinessItems();
        $("#updateVendorModal").modal('show');


    }

    $scope.saveVendor = function () {

        //var items = [];

        $scope.items.forEach(function (item) {
            if (!item.selected) {
                item.status = 'D';
            }
            if ($scope.distributor) {
                item.access = 'Distributor';
            }
        });

        if ($scope.distributor) {
            $scope.vendor.currentBusiness.type = "Distributor";
        }

        $scope.vendor.currentBusiness.businessLocations = [];
        $scope.vendor.currentBusiness.businessLocations.push($scope.selectedLocation);
        console.log("Items = >" + JSON.stringify($scope.items));

        Upload.upload({
            url: root + 'updateBusinessInfo',
            data: {
                'business': JSON.stringify($scope.vendor),
                'items': JSON.stringify($scope.items)
            },
            headers: {
                'Token': Auth.isLoggedIn(),
                'Accept': "application/json",
                'Content-Type': undefined
            }
        }).then(function (resp) {
                console.log(resp.data);
                alert("Successful!");
                $scope.loadVendors();
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

    }

    $scope.vendor = {};
    $scope.scheme = {};

    $scope.approveConfirm = function (v) {
        $scope.vendor = v;
        $("#approveModal").modal('show');
    }

    $scope.approveVendor = function () {
        $scope.vendor.owner.status = 'A';
        $scope.dataObj = {
            user: $scope.vendor.owner,
            scheme: $scope.scheme,
            business: {
                transactionCharges: $scope.vendor.transactionCharges
            }
        };
        userService.callService($scope, "updateUserStatus").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.loadVendors();
                alert("Vendor approved!! " + response.warningText);
                $("#approveModal").modal('hide');
            } else {
                alert("Error!");
            }
        });
    }

    $scope.generateInvoices = function () {
        $scope.dataObj = {
            invoice: {
                month: $scope.selectedMonth,
                year: $scope.selectedYear
            },
            requestType: $scope.overwriteInvoices,
            business: $scope.selectedUser
        }

        userService.callService($scope, "generateInvoices").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                alert("Done!!");
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


angular.module("app").controller('transactions', function ($scope, userService, Auth, $http) {


    console.log("Admin Transactions loaded ..");

    $scope.approveVendor = function (vendor) {

    }

    $scope.items = 10;

    $scope.getTransactions = function (type) {

        $scope.tab = type;
        $scope.dataObj = {

        };
        userService.callService($scope, "getTransactions").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.transactions = response.users;
            } else {
                alert("Error!");
            }
        });
    }

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.getTransactions();

});

angular.module("app").controller('locations', function ($scope, userService, Auth, $http) {


    console.log("Admin Locations loaded ..");

    $scope.updateLocation = function () {
        $scope.dataObj = {
            location: $scope.loc
        };
        userService.callService($scope, "updateLocation").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                alert("Done!");
                $scope.getLocations();
            } else {
                alert("Error!");
            }
        });
    }

    $scope.items = 10;

    $scope.getLocations = function (type) {

        $scope.dataObj = {

        };
        userService.callUserService($scope, "getAllAreas").then(function (response) {
            console.log(response);
            if (response.status == 200) {
                $scope.locations = response.locations;
            } else {
                alert("Error!");
            }
        });
    }

    $scope.editLoc = function (loc) {
        if (loc == null) {
            loc = {};
        }
        $scope.loc = loc;
        $("#locationModal").modal('show');
    }

    //

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.getLocations();

});


angular.module("app").controller('invoices', function ($scope, userService, Upload, $http, Auth) {

    $scope.item = {};
    console.log("Admin Invoices loaded ..");
    $scope.root = root;

    $scope.reviewData = function () {
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
        userService.callService($scope, "getMonthlyBillData").then(function (response) {
            console.log(response);
            $scope.items = response.items;
        });

    };

    $scope.generate = function () {
        if ($scope.month == null || $scope.year == null) {
            alert("Please select month and year!");
            return;
        }

        var f = document.getElementById('inputData').files[0];
        console.log("File:", f);
        if (f == null || f == undefined) {
            alert("Please select a file to upload!");
            return;
        }

        $("#confirmModal").modal('show');

    }

    $scope.confirmGenerate = function () {

        var f = document.getElementById('inputData').files[0];
        console.log("File:", f);
        if (f == null || f == undefined) {
            alert("Please select a file to upload!");
            return;
        }
        var fd = new FormData();
        fd.append('data', f);
        var req = {
            invoice: {
                month: $scope.month,
                year: $scope.year
            }
        }
        fd.append('request', JSON.stringify(req));

        toggleSpinner("show");

        $http.post(root + "generateInvoices", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Token': Auth.isLoggedIn(),
                    'Content-Type': undefined
                }
            })
            .success(function (response) {

                toggleSpinner("hide");
                console.log("Done!!!", response);
                if (response.status == 200) {
                    alert("Done!!");
                } else {
                    alert("Error!!" + response.response);
                }
                

            })
            .error(function (data, status, headers, config) {

                console.log("Error :" + status + ":" + JSON.stringify(data) + ":" + JSON.stringify(headers));
                toggleSpinner("hide");
                alert("Error!");

            });

    }

    toggleSpinner = function (toggle) {
        $("#loader").modal(toggle);
    }

});
