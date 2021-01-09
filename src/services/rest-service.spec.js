import { addAmount, 
    increaseAmount, 
    refundAmount, 
    fetchAllProducts, 
    fetchProduct } from './rest-service';

beforeEach(() => {
    fetch.resetMocks();
});

describe('Test rest-service', () => {

    const mockedAddResponse = {
        requestId: 1, 
        productToDispatch: null, 
        currentBalance: {amount: 10}, 
        change: {amount: 0}, 
        operationStatus: 'MONEY_ADDED'
    };

    it(`Test addAmount`, async () => {
        
        fetch.mockResponseOnce(JSON.stringify(mockedAddResponse));

        const moneyAdded = await addAmount(10);
        expect(moneyAdded).toStrictEqual(mockedAddResponse);
        expect(fetch).toBeCalledTimes(1);
    });

    it(`Test addAmount error`, async () => {
        
        fetch.mockReject(() => Promise.reject(new Error('Error while adding the amount')));

        await addAmount(10).catch(err => {
            expect(err).toBeDefined();
            expect(err.message).toBe('Error while adding the amount');
        });
        
    });

    const mockedIncreaseResponse = {
        requestId: 1, 
        productToDispatch: null, 
        currentBalance: {amount: 20}, 
        change: {amount: 0}, 
        operationStatus: 'MONEY_UPDATED'
    };

    it(`Test increaseAmount`, async () => {
        
        fetch.mockResponseOnce(JSON.stringify(mockedIncreaseResponse));

        const moneyAdded = await increaseAmount(10);
        expect(moneyAdded).toStrictEqual(mockedIncreaseResponse);
        expect(fetch).toBeCalledTimes(1);
    });

    it(`Test increaseAmount error`, async () => {
        
        fetch.mockReject(() => Promise.reject(new Error('Error while updating the amount')));

        await increaseAmount(10).catch(err => {
            expect(err).toBeDefined();
            expect(err.message).toBe('Error while updating the amount');
        });
        
    });

    const mockedRefundResponse = {
        requestId: 1, 
        productToDispatch: null, 
        currentBalance: {amount: 0}, 
        change: {amount: 10}, 
        operationStatus: 'REFUND_PROCESSED'
    };

    it(`Test refundAmount`, async () => {
        
        fetch.mockResponseOnce(JSON.stringify(mockedRefundResponse));

        const moneyAdded = await refundAmount(10);
        expect(moneyAdded).toStrictEqual(mockedRefundResponse);
        expect(fetch).toBeCalledTimes(1);
    });

    it(`Test refundAmount error`, async () => {
        
        fetch.mockReject(() => Promise.reject(new Error('Error while refunding the amount')));

        await refundAmount(10).catch(err => {
            expect(err).toBeDefined();
            expect(err.message).toBe('Error while refunding the amount');
        });
        
    });
    
    const mockedProductsResponse = 
        [{id: 1, price: 20, name: 'Product 1'}, {id: 2, price: 40, name: 'Product 2'}];

    it(`Test fetch all products`, async () => {
        
        fetch.mockResponseOnce(JSON.stringify(mockedProductsResponse));

        const moneyAdded = await fetchAllProducts();
        expect(moneyAdded).toStrictEqual(mockedProductsResponse);
        expect(fetch).toBeCalledTimes(1);
    });

    it(`Test fetch all products error`, async () => {
        
        fetch.mockReject(() => Promise.reject(new Error('Error fetching list of products')));

        await fetchAllProducts(10).catch(err => {
            expect(err).toBeDefined();
            expect(err.message).toBe('Error fetching list of products');
        });
        
    });

    const mockedProductDispatch = {
        requestId: 1, 
        productToDispatch: {id: 1, price: 20, name: 'Product 1'}, 
        currentBalance: {amount: 0}, 
        change: {amount: 5}, 
        operationStatus: 'PRODUCT_DISPATCHED'
    };

    it(`Test product dispatch`, async () => {
        
        fetch.mockResponseOnce(JSON.stringify(mockedProductDispatch));

        const product = await fetchProduct(10);
        expect(product).toStrictEqual(mockedProductDispatch);
        expect(fetch).toBeCalledTimes(1);
    });

    it(`Test product dispatch error`, async () => {
        
        fetch.mockReject(() => Promise.reject(new Error('Error while fetching requested Product')));

        await fetchProduct(10).catch(err => {
            expect(err).toBeDefined();
            expect(err.message).toBe('Error while fetching requested Product');
        });
        
    });
});