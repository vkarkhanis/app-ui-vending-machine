import {addAmount, increaseAmount, refundAmount} from '../services/rest-service';

export const useCurrencyActions = (requestId) => {

    const attemptRefund = async (response) => {

        if (response.errors) {

            // Attempt refund                
            const refund = await refundAmount(requestId);
            if (refund.operationStatus === "REFUND_PROCESSED") {

                return {...refund, operationStatus: "REFUND_AFTER_ERROR"}
            } else return refund;
        }

        
    }

    const onAmountAdded = async (value) => {

        let vendingMachineResponse;
                
        if (requestId) {
            
            try {
                vendingMachineResponse = await increaseAmount(value, requestId);
            } catch(err) {
                console.error(err);
                return await attemptRefund(vendingMachineResponse);
            }
            
            if (vendingMachineResponse.errors) {
                return await attemptRefund(vendingMachineResponse);
            }

            return {
                operationStatus: "MONEY_UPDATED",
                requestId: requestId,
                currentBalance: {
                    amount: vendingMachineResponse.balance,
                }
            }
            
        } else {

            try{
                vendingMachineResponse = await addAmount(value);	
            } catch (err) {
                console.error(err);
                throw err;
            }
            
            if (vendingMachineResponse.errors) {
                console.error("Exception while processing the request: " + vendingMachineResponse.message);
                return {
                    operationStatus: "ERROR",
                }
            }

            return {
                operationStatus: "MONEY_ADDED",
                requestId: vendingMachineResponse.id,
                currentBalance: {
                    amount: vendingMachineResponse.balance,
                }
            }

        }
        // return vendingMachineResponse;
    }

    return { onAmountAdded };
};