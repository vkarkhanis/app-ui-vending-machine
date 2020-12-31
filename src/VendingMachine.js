import VendingMachineSetup from './components/machine-setup/VendingMachineSetup';
import React, {useState} from 'react';

export const VendingMachine = () => {
	
	const [resetKey, setResetKey] = useState(0);
	return (
		<VendingMachineSetup key={resetKey} resetVendingMachine = {() => setResetKey(resetKey + 1)} />
	)
}