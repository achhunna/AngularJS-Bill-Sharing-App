//Set cookie expiration date
function cookieExp(){
	var now = new Date();
	now.setDate(now.getDate() + 30); //30 days expiration
	return now;
}

//Scroll function
function scrollToID(id, speed){
	var offSet = 0;
	var targetOffset = $(id).offset().top - offSet;
	$('html,body').animate({scrollTop:targetOffset}, speed);
}

//Functions to show and hide receipt
function showReceipt($scope){
	if(!$scope.showReceiptSheet){
		$scope.showReceiptSheet = true;
		//Disable openReceipt button
		$("#openReceipt").addClass("disabled");
		//Scroll to receipt div
		scrollToID("#receiptId", 500);
	}
}

function hideReceipt($scope){
	if($scope.showReceiptSheet){
		$scope.showReceiptSheet = false;
		//Enable openReceipt button
		$("#openReceipt").removeClass("disabled");
	}
}
