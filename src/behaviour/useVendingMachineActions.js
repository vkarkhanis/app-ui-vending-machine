import {useReducer} from 'react';
import {refundAmount} from '../services/rest-service';
import {initialState, reducer} from '../context/reducer';

export const useVendingMachineActions = (resetVendingMachine) => {
	
	const [state, dispatch] = useReducer(reducer, initialState);
	const onRefundRequested = async (requestId) => {
		const vendingMachineReponse = await refundAmount(requestId);
		handleVendingMachineActions(vendingMachineReponse);  
    }

	const handleVendingMachineActions = (vendingMachineResponse) => {
	
		switch (vendingMachineResponse.status) {
			case 'MONEY_ADDED':
			case 'MONEY_UPDATED':
				
				dispatch({
					type: "BALANCE_UPDATE",
					payload: vendingMachineResponse
				});
				break;
			
			case 'REFUND_PROCESSED': 
			case 'REFUND_AFTER_ERROR':
			case 'PRODUCT_DISPATCHED':
			case 'INSUFFICIENT_BALANCE':
			case 'INSUFFICIENT_BALANCE_REFUND_ERROR':
			case "PRODUCT_FETCH_AND_REFUND_FAILURE": 
			case "PRODUCT_FETCH_FAILURE": 
			case "UPDATE_AMOUNT_AND_REFUND_FAILURE": 
			case "UPDATE_AMOUNT_FAILURE": 
				dispatch({
					type: vendingMachineResponse.status,
					payload: vendingMachineResponse
				});
				const timerId = setTimeout(() => {
					resetVendingMachine && resetVendingMachine();
												clearTimeout(timerId);
												}, 10000);
				break;
				
			default:
	
				dispatch({
					type: "ERROR",
					payload: vendingMachineResponse
				});
				
				setTimeout(() => resetVendingMachine && resetVendingMachine(), 10000);
	 	}
	}
	
	return {...state, handleResponse: handleVendingMachineActions, onRefundRequested}
	
}
	