/* Set cookie expiration date */
function cookieExp(){
	var now = new Date();
	now.setDate(now.getDate() + 30); //30 days expiration
	return now;
}

function showHideReceipt($scope){
	if($scope.showReceiptSheet){
		$scope.showReceiptSheet = false;
	}else{
		$scope.showReceiptSheet = true;
	}
}