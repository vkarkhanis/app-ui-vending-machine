import VendingMachineResponse from "../model/VendingMachineResponse";

const BASE_URL = 'http://localhost:8080'

export const addAmount = async (value) => {

	try {
		return await updateAmount(`${BASE_URL}/vendingmachine/v2/order`, 'post', value);
	} catch (e) {
		console.error(e);
		throw e;
	}
	
}

export const increaseAmount = async (value, orderId) => {

	try {
		return await updateAmount(`${BASE_URL}/vendingmachine/v2/order/${orderId}`, 'put', value);
	} catch(err) {
		console.error(err);
		throw err;
	}
}

export const refundAmount = async (orderId) => {
	let resp;

	try {
		resp = await fetch(`${BASE_URL}/vendingmachine/v2/order/${orderId}/refund`);
	} catch(err) {
		console.error(err);
		throw err;
	}
	
	const refundAmount = await resp.json();

	if (refundAmount.errors) {
		return new VendingMachineResponse(orderId, "ERROR");
	}
	return new VendingMachineResponse(orderId, "REFUND_PROCESSED", refundAmount);
	
}

const updateAmount = async (url, method, value) => {
	
	const resp = await fetch(url, {
        method,
		headers: {
			"Content-type": "application/json"
		},
        body: JSON.stringify({amount: value}),
    });

    return await resp.json();
}

export const fetchAllProducts = async () => {

	try {
		const resp = await fetch(`${BASE_URL}/vendingmachine/product`);
		const products = await resp.json();
		return products;
	} catch(err) {
		console.error(err);
		throw err;
	}
	
}

export const fetchProduct = async (productId, orderId) => {
	
	try {
		const resp = await fetch(`${BASE_URL}/vendingmachine/v2/order/${orderId}/product/${productId}`);
		const vendingMachineResponse = await resp.json();
	
		if (vendingMachineResponse.errors) {
			if (vendingMachineResponse.status === "INSUFFICIENT_BALANCE") {
				const response = await refundAmount(orderId);
				if (response.status === "ERROR") {
					return {...response, status: "INSUFFICIENT_BALANCE_REFUND_ERROR"}
				}
				return {...response, status: "INSUFFICIENT_BALANCE"}
			} else {
				// Attempt refund                
				const refund = await refundAmount(orderId);
				if (refund.status === "ERROR") {
					return {...refund, status: "PRODUCT_FETCH_AND_REFUND_FAILURE"};
				} else {
					return {...refund, status: "PRODUCT_FETCH_FAILURE"};
				}
			}
		}

		return new VendingMachineResponse(orderId, "PRODUCT_DISPATCHED", vendingMachineResponse.balance, vendingMachineResponse.product);
	} catch(err) {
		console.error(err);
		throw err;
	}
	
}
