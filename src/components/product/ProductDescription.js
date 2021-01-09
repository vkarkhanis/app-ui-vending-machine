import {useState, useEffect} from 'react';
import {fetchAllProducts, fetchProduct} from '../../services/rest-service';
import '../../VendingMachine.css';

export const ProductDescription = (props) => {

	const [products, setProducts] = useState([]);
	useEffect(() => {
		fetchAllProducts().then((res) => setProducts(res))
	}, []);
	
	const orderProduct = async (productId) => {
		const vendingMachineResponse = await fetchProduct(productId, props.requestId);
		props.onProductSelected && props.onProductSelected(vendingMachineResponse);
	}
	
	return (
	
		<>
			<div className={'label header'}>Please select a product</div>
			<div style={{display: 'flex', flexWrap: 'wrap'}}>
			{products.map(eachProduct => 
				<div key={eachProduct.id} className={'product-container'}>
					<div className={'product-element-container'}>
						<div data-testid={`product-name-${eachProduct.id}`}>{eachProduct.name}</div>
						<div data-testid={`product-price-${eachProduct.id}`}>Rs. {eachProduct.price}</div>
						<button 
							onClick={() => orderProduct(eachProduct.id)} 
							disabled={props.disabled}
							data-testid={`product-select-${eachProduct.id}`}>
							Select
						</button>
					</div>
				</div>	
				)}
			</div>
		</>
	) 

	
    

}