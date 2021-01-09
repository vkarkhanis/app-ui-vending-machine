import {addAmount, increaseAmount} from '../services/rest-service';

export const useCurrencyActions = (requestId) => {

    const onAmountAdded = async (value) => {

        let vendingMachineResponse;
        
        try {
            if (requestId) {
                vendingMachineResponse = await increaseAmount(value, requestId);
             } else {
                vendingMachineResponse = await addAmount(value);	
            }
        } catch(error) {
            throw error;
        }
		
        
        return vendingMachineResponse;
    }

    return { onAmountAdded };
};