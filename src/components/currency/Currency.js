import './currency.css';
import {addAmount, increaseAmount} from '../../services/rest-service';

export const Currency = (props) => {

    const onAmountAdded = async () => {

        const {onAmountAdded, requestId} = props;

		let vendingMachineResponse;
		
		if (requestId) {
			vendingMachineResponse = await increaseAmount(props.value, requestId);
		} else {
			vendingMachineResponse = await addAmount(props.value);	
		}
        
		if (vendingMachineResponse) {
			onAmountAdded && onAmountAdded(vendingMachineResponse);
		}
        
    }
	
    return (
        <button className={'bill'} onClick={onAmountAdded} disabled={props.disabled}>{props.value}</button>
    );
}