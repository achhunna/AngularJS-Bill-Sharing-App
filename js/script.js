//Set cookie expiration date
function cookieExp(){
	var now = new Date();
	now.setDate(now.getDate() + 30); //30 days expiration
	return now;
}

//Scroll animation when receipt opens
function scrollToID(id, speed){
	var targetOffset = $(id).offset().top;
	$('html,body').animate({scrollTop:targetOffset}, speed);
}

//Functions to show and hide receipt
function showReceipt($scope){
	if(!$scope.showReceiptSheet){
		$scope.showReceiptSheet = true;
		//Disable openReceipt button
		$("#openReceipt").prop('disabled', true);
	}
	//Scroll to receipt div
	scrollToID("#receiptId", 500);
}
function hideReceipt($scope){
	if($scope.showReceiptSheet){
		$scope.showReceiptSheet = false;
		//Enable openReceipt button
		$("#openReceipt").prop('disabled', false);
	}
}

//Maximum number for amount entered
function limitKeypress(event, value, maxLength) {
    if (value != undefined && value.toString().length >= maxLength) {
        event.preventDefault();
    }
}
