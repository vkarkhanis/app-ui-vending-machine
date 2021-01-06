import {addAmount, increaseAmount} from '../services/rest-service';

export const useCurrencyActions = (requestId) => {

    const onAmountAdded = async (value) => {

        let vendingMachineResponse;
		
		if (requestId) {
            vendingMachineResponse = await increaseAmount(value, requestId);
     	} else {
			vendingMachineResponse = await addAmount(value);	
        }
        
        return vendingMachineResponse;
    }

    return { onAmountAdded };
};