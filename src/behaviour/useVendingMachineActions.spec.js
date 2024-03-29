import * as restService from '../services/rest-service';
import {useVendingMachineActions} from './useVendingMachineActions';
import { renderHook, act, cleanup } from "@testing-library/react-hooks"

jest.mock('../services/rest-service');

const mockRefundResponse = {
    orderId: 3, 
    balance: 0, 
    productToDispatch: null, 
    status: 'REFUND_PROCESSED'
};

beforeEach(() => {
    jest.useFakeTimers();
});
afterEach(cleanup);

describe('Testing refund Request', () => {
    it('Valid refund request', async () => {

        restService.refundAmount = jest.fn().mockResolvedValue(mockRefundResponse);
        // Render hook using renderHook from @testing-library/react-hooks
        const { result } = renderHook(() => useVendingMachineActions(undefined));
 
        // Act is required if the called method updates state. 
        await act(async () => {
            await result.current.onRefundRequested(mockRefundResponse.requestId)
        });

        expect(restService.refundAmount).toBeCalledWith(mockRefundResponse.requestId);
        expect(restService.refundAmount).toBeCalledTimes(1);
    })
})

describe('Testing vending machine actions', () => {

    const mockResponses = [
        {
            orderId: 3, 
            productToDispatch: null, 
            balance: 10, 
            status: 'MONEY_ADDED'
        },
        {
            orderId: 3, 
            productToDispatch: null, 
            balance: 20, 
            status: 'MONEY_UPDATED'
        },
    ]

    mockResponses.forEach(eachResponse => {

        it(`Test response when ${eachResponse.status}`, () => {
    
            const { result } = renderHook(() => useVendingMachineActions(undefined));
     
            // Act
            act(() => {
                result.current.handleResponse(eachResponse)
            });
    
            // Assert
            expect(result.current.orderId).toBe(3);
            expect(result.current.displayMsg).toBe(`Your current balance amount is Rs: ${eachResponse.balance}`);
        })
    }); 

    
    it(`Test response when amount is refunded`, () => {
      
        const resetVendingMachineCallBack = jest.fn();

        // Render hook using renderHook from @testing-library/react-hooks
        const { result } = renderHook(() => useVendingMachineActions(resetVendingMachineCallBack));
        
        // Act is required if the called method updates state. 
        act(() => {
            result.current.handleResponse(mockRefundResponse)
        });

      
        expect(result.current.orderId).toBe(0);
        expect(result.current.displayMsg).toBe(`Please collect your balance amount of Rs: ${mockRefundResponse.balance}`);
        expect(result.current.changeDispatch).toBe(mockRefundResponse.balance);
        expect(result.current.disabled).toBe(true);
        expect(result.current.productDispatch).not.toBeDefined();
        expect(resetVendingMachineCallBack).not.toBeCalled();

        jest.runAllTimers();

        expect(resetVendingMachineCallBack).toBeCalled();

    });

    const mockProductDispatchResponse = [
        [   'REFUND_AFTER_ERROR',
            {orderId: 3, productToDispatch: null, balance: 10, status: 'REFUND_AFTER_ERROR'}, 
            `There was an error processing your request.
                    Please collect your refund amount: 10`
        ],
        [   'INSUFFICIENT_BALANCE',
            {orderId: 3, productToDispatch: null, balance: 10, status: 'INSUFFICIENT_BALANCE'}, 
            `You have insufficient balance. Please collect your refund of Rs: 10`
        ],
        [
            'PRODUCT_DISPATCHED',
            {orderId: 3, productToDispatch: {id: 1, price: 20.0, name: 'Product 1'}, balance: 10, status: 'PRODUCT_DISPATCHED'}, 
            `Please collect your product: Product 1 and change of Rs: 10`
        ],
        [
            'REFUND_PROCESSED',
            {orderId: 3, productToDispatch: undefined, balance: 10, status: 'REFUND_PROCESSED'}, 
            `Please collect your balance amount of Rs: 10`
        ],
        [
            'INSUFFICIENT_BALANCE_REFUND_ERROR',
            {orderId: 3, productToDispatch: undefined, balance: 0, status: 'INSUFFICIENT_BALANCE_REFUND_ERROR'}, 
            `Product could no be dispatched because you have insufficient balance. We could not process your refund. Please contact the admin`
        ],
        [
            'PRODUCT_FETCH_AND_REFUND_FAILURE',
            {orderId: 3, productToDispatch: undefined, balance: 0, status: 'PRODUCT_FETCH_AND_REFUND_FAILURE'}, 
            `There was an error while dispatching the product. We could not process your refund. Please contact the admin`
        ],
        [
            'PRODUCT_FETCH_FAILURE',
            {orderId: 3, productToDispatch: undefined, balance: 10, status: 'PRODUCT_FETCH_FAILURE'}, 
            `There was an error while dispatchig the product. Please collect your refund of Rs: 10`
        ],
        [
            'UPDATE_AMOUNT_AND_REFUND_FAILURE',
            {orderId: 3, productToDispatch: undefined, balance: 0, status: 'UPDATE_AMOUNT_AND_REFUND_FAILURE'}, 
            `There was an error while updating the amount. We could not process your refund. Please contact the admin`
        ],
        [
            'UPDATE_AMOUNT_FAILURE',
            {orderId: 3, productToDispatch: undefined, balance: 10, status: 'UPDATE_AMOUNT_FAILURE'}, 
            `There was an error while updating the amount. Please collect your refund of Rs: 10`
        ],
        [
            'ERROR',
            {orderId: 3, productToDispatch: undefined, balance: 10, status: 'ERROR'}, 
            `There was some error while processing your request. 
                    Kindly collect your refund (if any) and try again later`
        ]
        
        
    ]
    

    test.each(mockProductDispatchResponse)(
        `Product Dispatched with %p`, (status, eachResponse, expectedResult) => {
            const resetVendingMachineCallBack = jest.fn();

            // Render hook using renderHook from @testing-library/react-hooks
            const { result } = renderHook(() => useVendingMachineActions(resetVendingMachineCallBack));
            
            // Act is required if the called method updates state. 
            act(() => {
                result.current.handleResponse(eachResponse);
            });

            expect(result.current.orderId).toBe(0);
            expect(result.current.displayMsg).toBe(expectedResult);
            expect(result.current.changeDispatch).toBe(eachResponse.balance);
            expect(result.current.disabled).toBe(true);
            expect(result.current.productDispatch).toBe(eachResponse.productToDispatch ? eachResponse.productToDispatch.name : undefined);
            expect(resetVendingMachineCallBack).not.toBeCalled();
    
            jest.runAllTimers();
    
            expect(resetVendingMachineCallBack).toBeCalled();

        }
    )
})