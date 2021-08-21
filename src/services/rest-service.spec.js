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
        orderId: 1, 
        productToDispatch: null, 
        balance: 10, 
        status: 'MONEY_ADDED'
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
        orderId: 1, 
        productToDispatch: null, 
        balance: 20, 
        status: 'MONEY_UPDATED'
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

    it(`Test refundAmount`, async () => {
        
        fetch.mockResponseOnce(JSON.stringify(10));

        const refundResponse = await refundAmount(1);
        expect(refundResponse.balance).toBe(10);
        expect(refundResponse.orderId).toBe(1);
        expect(refundResponse.productToDispatch).not.toBeDefined();
        expect(refundResponse.status).toBe("REFUND_PROCESSED");

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

    it(`Test product dispatch`, async () => {
        
        fetch.mockResponseOnce(JSON.stringify({balance: 5, product: {id: 1, price: 20, name: 'Product 1'}}));

        const product = await fetchProduct(1, 1);
        expect(product.productToDispatch.id).toBe(1);
        expect(product.productToDispatch.price).toBe(20);
        expect(product.productToDispatch.name).toBe("Product 1");
        expect(product.orderId).toBe(1);
        expect(product.balance).toBe(5);
        expect(product.status).toBe("PRODUCT_DISPATCHED");
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