const BASE_URL = 'http://localhost:8080'

export const addAmount = async (value) => {

	try {
		return await updateAmount(`${BASE_URL}/vendingmachine/amount`, 'post', value);
	} catch (e) {
		console.error(e);
		throw e;
	}
	
}

export const increaseAmount = async (value, requestId) => {

	try {
		return await updateAmount(`${BASE_URL}/vendingmachine/amount?requestId=${requestId}`, 'put', value);
	} catch(err) {
		console.error(err);
		throw err;
	}
	
}

export const refundAmount = async (requestId) => {

	try {
		const resp = await fetch(`${BASE_URL}/vendingmachine/amount?requestId=${requestId}`);
		return await resp.json();
	} catch(err) {
		console.error(err);
		throw err;
	}
	
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
    return vendingMachineResponse;
}

export const fetchAllProducts = async () => {

	try {
		const resp = await fetch(`${BASE_URL}/vendingmachine/product`);
		const products = await resp.json();
		console.log('fetch all products', products)
		return products;
	} catch(err) {
		console.error(err);
		throw err;
	}
	
}

export const fetchProduct = async (productId, requestId) => {
	
	try {
		const resp = await fetch(`${BASE_URL}/vendingmachine/product/${productId}?requestId=${requestId}`);
		return await resp.json();
	} catch(err) {
		console.error(err);
		throw err;
	}
	
}