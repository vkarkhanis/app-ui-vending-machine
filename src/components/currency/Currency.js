import './currency.css';
import { useCurrencyActions } from '../../behaviour/useCurrencyActions';

export const Currency = (props) => {

	const { onAmountAdded } = useCurrencyActions(props.requestId);

    const onCurrencyClicked = async () => {

		try {
			const vendingMachineResponse = await onAmountAdded(props.value);
		
			if (vendingMachineResponse) {
				props.onAmountAdded && props.onAmountAdded(vendingMachineResponse);
			} 
		} catch(e) {
			console.error(e);
			throw e;
		}
	}
	
    return (
        <button 
			data-testid={'vm-currency-btn-id'} 
			className={'bill'} 
			onClick={onCurrencyClicked} 
			disabled={props.disabled}>

			{props.value}
		</button>
    );
}