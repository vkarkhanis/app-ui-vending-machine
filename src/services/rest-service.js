const BASE_URL = 'http://localhost:8080'

export const addAmount = async (value) => {

	return await updateAmount(`${BASE_URL}/vendingmachine/amount`, 'post', value);
}

export const increaseAmount = async (value, requestId) => {

	return await updateAmount(`${BASE_URL}/vendingmachine/amount?requestId=${requestId}`, 'put', value);
}

export const refundAmount = async (requestId) => {

	const resp = await fetch(`${BASE_URL}/vendingmachine/amount?requestId=${requestId}`);
	return await resp.json();
	
}

const updateAmount = async (url, method, value) => {
	
	    const resp = await fetch(url, {
        method,
		headers: {
			"Content-type": "application/json"
		},
        body: JSON.stringify({amount: value}),
    });

    const vendingMachineResponse = await resp.json();
    console.log(`${method}Amount`, vendingMachineResponse);
    return vendingMachineResponse;
}

export const fetchAllProducts = async () => {

	const resp = await fetch(`${BASE_URL}/vendingmachine/product`);
	const products = await resp.json();
	console.log('fetch all products', products)
	return products;

}

export const fetchProduct = async (productId, requestId) => {
	
	const resp = await fetch(`${BASE_URL}/vendingmachine/product/${productId}?requestId=${requestId}`);
	return await resp.json();
}