import {useState} from 'react';
import {refundAmount} from '../services/rest-service';

export const useVendingMachineActions = (resetVendingMachine) => {
	
	const [requestId, setRequestId] = useState();
	const [displayMsg, setDisplayMsg] = useState('Please add required amount');
	const [disabled, setDisabled] = useState(false);
	const [changeDispatch, setChangeDispatch] = useState(0);
	const [productDispatch, setProductDispatch] = useState('');
	
	const onRefundRequested = async (requestId) => {
		const vendingMachineReponse = await refundAmount(requestId);
		handleVendingMachineActions(vendingMachineReponse);  
    }
  
	const handleVendingMachineActions = (vendingMachineResponse) => {
	
		switch (vendingMachineResponse.operationStatus) {
		 
		 case 'MONEY_ADDED':
		 case 'MONEY_UPDATED':
			setRequestId(vendingMachineResponse.requestId);
			setDisplayMsg(`Your current balance amount is: ${vendingMachineResponse.currentBalance.amount}`);
			break;
		
		 case 'REFUND_PROCESSED':
			setDisplayMsg(`Please collect your balance amount: ${vendingMachineResponse.change.amount}`);
			setChangeDispatch(`${vendingMachineResponse.change.amount}`);
			setDisabled(true);
			const timerId = setTimeout(() => {
											
											resetVendingMachine();
											clearTimeout(timerId);
											}, 10000);
			break;
			
		case 'PRODUCT_DISPATCHED':
			setDisplayMsg(`Please collect your product: ${vendingMachineResponse.productToDispatch.name} and change of Rs: ${vendingMachineResponse.change.amount}`);
			setDisabled(true);
			setChangeDispatch(`${vendingMachineResponse.change.amount}`);
			setProductDispatch(`${vendingMachineResponse.productToDispatch.name}`);
			setTimeout(() => resetVendingMachine(), 10000);
			break;
			
		case 'INSUFFICIENT_BALANCE':
			setDisplayMsg(`You have insufficient balance. Please collect your refund: ${vendingMachineResponse.currentBalance.amount}`);
			setDisabled(true);
			setChangeDispatch(`${vendingMachineResponse.currentBalance.amount}`);
			setTimeout(() => resetVendingMachine(), 10000);
			break;
			
		default:
			setDisplayMsg(`There was some error while processing your request. Kindly collect your refund (if any) and try again later`);
			setDisabled(true);
			setTimeout(() => resetVendingMachine(), 10000);
	 }
	 
	}
	
	return { handleResponse: handleVendingMachineActions, onRefundRequested, requestId, disabled, displayMsg, changeDispatch, productDispatch };
	
}
	