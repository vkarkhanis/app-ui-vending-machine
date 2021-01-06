import * as restService from '../services/rest-service';
import {useVendingMachineActions} from './useVendingMachineActions';
import { renderHook, act, cleanup } from "@testing-library/react-hooks"

jest.mock('../services/rest-service');

const mockRefundResponse = {
    requestId: 3, 
    productToDispatch: null, 
    currentBalance: {amount: 0}, 
    change: {amount: 10}, 
    operationStatus: 'REFUND_PROCESSED'
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
            requestId: 3, 
            productToDispatch: null, 
            currentBalance: {amount: 10}, 
            change: {amount: 0}, 
            operationStatus: 'MONEY_ADDED'
        },
        {
            requestId: 3, 
            productToDispatch: null, 
            currentBalance: {amount: 20}, 
            change: {amount: 0}, 
            operationStatus: 'MONEY_UPDATED'
        },
    ]

    mockResponses.forEach(eachResponse => {

        it(`Money ${eachResponse.operationStatus}`, () => {

            restService.addAmount = jest.fn().mockResolvedValue(eachResponse);
    
            const { result } = renderHook(() => useVendingMachineActions(undefined));
     
            act(() => {
                result.current.handleResponse(eachResponse)
            });
    
            expect(result.current.requestId).toBe(3);
            expect(result.current.displayMsg).toBe(`Your current balance amount is: ${eachResponse.currentBalance.amount}`);
        })
    }); 

    
    it(`Money refunded`, () => {
        restService.refundAmount = jest.fn().mockResolvedValue(mockRefundResponse);
    
        const resetVendingMachineCallBack = jest.fn();

        // Render hook using renderHook from @testing-library/react-hooks
        const { result } = renderHook(() => useVendingMachineActions(resetVendingMachineCallBack));
        
        // Act is required if the called method updates state. 
        act(() => {
            result.current.handleResponse(mockRefundResponse)
        });

      
        expect(result.current.requestId).not.toBeDefined();
        expect(result.current.displayMsg).toBe(`Please collect your balance amount: ${mockRefundResponse.change.amount}`);
        expect(result.current.changeDispatch).toBe(`${mockRefundResponse.change.amount}`);
        expect(result.current.disabled).toBe(true);
        expect(result.current.productDispatch).toBe('');
        expect(resetVendingMachineCallBack).not.toBeCalled();

        jest.runAllTimers();

        expect(resetVendingMachineCallBack).toBeCalled();

    });

    const mockProductDispatchResponse = [
        {
            requestId: 3, 
            productToDispatch: null, 
            currentBalance: {amount: 10}, 
            change: {amount: 0}, 
            operationStatus: 'INSUFFICIENT_BALANCE',
            displayMsg: `You have insufficient balance. Please collect your refund: 10`

        },
        {
            requestId: 3, 
            productToDispatch: {id: 1, price: 20.0, name: 'Product 1'}, 
            currentBalance: {amount: 0}, 
            change: {amount: 10}, 
            operationStatus: 'PRODUCT_DISPATCHED',
            displayMsg: `Please collect your product: Product 1 and change of Rs: 10`
        },
    ]

    mockProductDispatchResponse.forEach(eachResponse => {

        it(`Product Dispatched with ${eachResponse.operationStatus}`, () => {
            restService.fetchProduct = jest.fn().mockResolvedValue(eachResponse);
        
            const resetVendingMachineCallBack = jest.fn();
    
            // Render hook using renderHook from @testing-library/react-hooks
            const { result } = renderHook(() => useVendingMachineActions(resetVendingMachineCallBack));
            
            // Act is required if the called method updates state. 
            act(() => {
                result.current.handleResponse(eachResponse)
            });
    
          
            expect(result.current.requestId).not.toBeDefined();
            expect(result.current.displayMsg).toBe(eachResponse.displayMsg);
            expect(result.current.changeDispatch).toBe(`${mockRefundResponse.change.amount}`);
            expect(result.current.disabled).toBe(true);
            expect(result.current.productDispatch).toBe(eachResponse.productToDispatch ? eachResponse.productToDispatch.name : '');
            expect(resetVendingMachineCallBack).not.toBeCalled();
    
            jest.runAllTimers();
    
            expect(resetVendingMachineCallBack).toBeCalled();
    
        });
    });
    
    
})