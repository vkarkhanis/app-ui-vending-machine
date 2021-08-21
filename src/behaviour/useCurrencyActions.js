import {addAmount, increaseAmount, refundAmount as attemptRefund} from '../services/rest-service';
import VendingMachineResponse from "../model/VendingMachineResponse";

export const useCurrencyActions = (orderId) => {

    const getFailureResponseWhenUpdatingAmount = (response) => {

        if (response.errors) {
            return {...response, status: "UPDATE_AMOUNT_AND_REFUND_FAILURE"};
        }

        return {...response, status: "UPDATE_AMOUNT_FAILURE"};
    }

    const onAmountAdded = async (value) => {

        let vendingMachineResponse;
                
        if (orderId) {
            
            try {
                vendingMachineResponse = await increaseAmount(value, orderId);
            } catch(err) {
                console.error(err);
                return getFailureResponseWhenUpdatingAmount(await attemptRefund(orderId));
            }
            
            if (vendingMachineResponse.errors) {
                return getFailureResponseWhenUpdatingAmount(await attemptRefund(orderId));
            }

            return new VendingMachineResponse(orderId, "MONEY_UPDATED", vendingMachineResponse.balance);
            
        } else {

            try{
                vendingMachineResponse = await addAmount(value);	
            } catch (err) {
                console.error(err);
                throw err;
            }
            
            if (vendingMachineResponse.errors) {
                console.error("Exception while processing the request: " + vendingMachineResponse.message);
                return new VendingMachineResponse(undefined, "ERROR");
            }
            return new VendingMachineResponse(vendingMachineResponse.id, "MONEY_ADDED", vendingMachineResponse.balance);

        }
    }

    return { onAmountAdded };
};