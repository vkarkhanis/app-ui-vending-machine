const BASE_URL = 'http://localhost:8080'

export const addAmount = async (value) => {

	try {
		// return await updateAmount(`${BASE_URL}/vendingmachine/amount`, 'post', value);
		return await updateAmount(`${BASE_URL}/vendingmachine/v2/order`, 'post', value);
	} catch (e) {
		console.error(e);
		throw e;
	}
	
}

export const increaseAmount = async (value, orderId) => {

	try {
		// return await updateAmount(`${BASE_URL}/vendingmachine/amount?requestId=${requestId}`, 'put', value);
		return await updateAmount(`${BASE_URL}/vendingmachine/v2/order/${orderId}`, 'put', value);
	} catch(err) {
		console.error(err);
		throw err;
	}
}

export const refundAmount = async (orderId) => {
	// const resp = await fetch(`${BASE_URL}/vendingmachine/amount?requestId=${requestId}`);

	let resp;

	try {
		resp = await fetch(`${BASE_URL}/vendingmachine/v2/order/${orderId}/refund`);
	} catch(err) {
		console.error(err);
		throw err;
	}
	
	const refundAmount = await resp.json();

	if (refundAmount.errors) {
		return {
			operationStatus: "ERROR",
		}
	}
	return {
		operationStatus: "REFUND_PROCESSED",
		requestId: orderId,
		currentBalance: {
			amount: refundAmount,
		}
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

export const fetchProduct = async (productId, orderId) => {
	
	try {
		// const resp = await fetch(`${BASE_URL}/vendingmachine/product/${productId}?requestId=${requestId}`);
		const resp = await fetch(`${BASE_URL}/vendingmachine/v2/order/${orderId}/product/${productId}`);
		const vendingMachineResponse = await resp.json();
		return {
			operationStatus: "PRODUCT_DISPATCHED",
			requestId: orderId,
			change: {
				amount: vendingMachineResponse.balance,
			},
			productToDispatch: vendingMachineResponse.product
		}
		// return await resp.json();
	} catch(err) {
		console.error(err);
		throw err;
	}
	
}