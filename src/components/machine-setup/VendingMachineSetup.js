import {Currency} from '../../components/currency/Currency';
import {ProductDescription} from '../../components/product/ProductDescription';
import React, {useState} from 'react';
import {useVendingMachineActions} from '../../behaviour/useVendingMachineActions';

const VendingMachineSetup =(props)=>{
	
  const { handleResponse, 
		  onRefundRequested, 
		  requestId, 
		  disabled, 
		  displayMsg, 
		  changeDispatch, 
		  productDispatch } = useVendingMachineActions(props.resetVendingMachine);
  
  const denominations = [5, 10, 20, 50];
  
  return (
	
	<>
		<div style={{display: 'flex', flexDirection: 'row'}}>
			<div className={'primary-container'}>
				<ProductDescription onProductSelected={handleResponse} requestId={requestId} disabled = {disabled} />
			</div>
			<div className={'primary-container'}>
			
				<div>
					<div>Please select the denomination: </div>
					{ denominations.map(eachDenom => 
						<Currency value={eachDenom} requestId={requestId} onAmountAdded={handleResponse} disabled = {disabled} />) }
						
				</div>
				
				<button onClick={() => onRefundRequested(requestId)} className={'refundButton'} disabled = {disabled}>Refund</button>
				<div className={'display-message-container'}>{displayMsg}</div>
			</div>
		</div>
		
		<div style={{display: 'flex', flexDirection: 'row'}}>
			<div className={'dispatcher-container'}>
				<div style={{fontWeight: 'bold'}}>Product:</div>
				<div style={{fontSize: '16px', marginTop: '5px', color: '#1E043C'}} className={(productDispatch && productDispatch.trim().length > 0) ? 'animate' : ''}>{productDispatch}</div>
			</div>
			<div className={'dispatcher-container'}>
				<div style={{fontWeight: 'bold'}}>Change:</div>
				<div style={{fontSize: '16px', marginTop: '5px', color: '#1E043C'}} className={(changeDispatch) ? 'animate' : ''}>Rs. {changeDispatch}</div>
			</div>
		</div>
	</>
  );
}

export default VendingMachineSetup;
