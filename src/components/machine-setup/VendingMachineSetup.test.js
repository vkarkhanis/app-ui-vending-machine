import { render, cleanup, waitFor, fireEvent } from '@testing-library/react';
import VendingMachineSetup from './VendingMachineSetup';
import * as restService from '../../services/rest-service';

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify(mockedProductsResponse));
  jest.useFakeTimers();
});

afterEach(cleanup);

const mockedProductsResponse = 
        [{id: 1, price: 20, name: 'Product 1'}, {id: 2, price: 40, name: 'Product 2'}];

describe('Render Vending Machine', () => {

  it('Check all components', async () => {
    const container = await waitFor(() => render(<VendingMachineSetup />));
    expect(container).toBeDefined();
    
    const {getByTestId, getAllByTestId, getByText} = container;
    expect(getByTestId('product-name-1')).toBeDefined();
    expect(getByTestId('product-price-1')).toBeDefined();
    expect(getByTestId('product-select-1')).toBeDefined();
    expect(getAllByTestId('vm-currency-btn-id').length).toBe(4);
    expect(getByText(/refund/i)).toBeDefined();
    expect(getByText(/Please add required amount/i)).toBeDefined();
    expect(getByText('Product:')).toBeDefined();
    expect(getByText('Change:')).toBeDefined();
  });
});

describe('Check various vending machine events', () => {
  
  jest.mock('../../services/rest-service');
 
  it('Add and Update Amount', async () => {
    
    const mockFunction = jest.fn();
    
    restService.addAmount = jest.fn().mockResolvedValue({requestId: 1, productToDispatch: null, currentBalance: {amount: 10}, change: {amount: 0}, operationStatus: 'MONEY_ADDED'});
    restService.increaseAmount = jest.fn().mockResolvedValue({requestId: 1, productToDispatch: null, currentBalance: {amount: 20}, change: {amount: 0}, operationStatus: 'MONEY_UPDATED'});

    const container = await waitFor(() => render(<VendingMachineSetup resetVendingMachine = {mockFunction} />));

    const {getByText,getAllByTestId} = container;
    const currency1 = getAllByTestId('vm-currency-btn-id')[1];
    fireEvent.click(currency1);
    await waitFor(() => expect(getByText('Your current balance amount is: 10')).toBeDefined());


    fireEvent.click(currency1);
    await waitFor(() => expect(getByText('Your current balance amount is: 20')).toBeDefined());

  });

  it('Refund Amount', async () => {

    const mockFunction = jest.fn();
    restService.addAmount = jest.fn().mockResolvedValue({requestId: 1, productToDispatch: null, currentBalance: {amount: 10}, change: {amount: 0}, operationStatus: 'MONEY_ADDED'});
    restService.refundAmount = jest.fn().mockResolvedValue({requestId: 1, productToDispatch: null, currentBalance: {amount: 0}, change: {amount: 10}, operationStatus: 'REFUND_PROCESSED'});
    
    const container = await waitFor(() => render(<VendingMachineSetup resetVendingMachine = {mockFunction} />));

    const {getByText,getAllByTestId} = container;
    const currency = getAllByTestId('vm-currency-btn-id')[1];
    fireEvent.click(currency);
    await waitFor(() => expect(getByText('Your current balance amount is: 10')).toBeDefined());


    const refundButton = getByText('Refund');
    fireEvent.click(refundButton);

    await waitFor(() => expect(getByText('Please collect your balance amount: 10')).toBeDefined());
    expect(getByText('Rs. 10')).toBeDefined();
    expect(refundButton).toBeDisabled();

    jest.runAllTimers();

    expect(mockFunction).toBeCalledTimes(1);
  });

  it('Select Product', async () => {

    const mockFunction = jest.fn();
    restService.addAmount = jest.fn().mockResolvedValue({requestId: 1, productToDispatch: null, currentBalance: {amount: 50}, change: {amount: 0}, operationStatus: 'MONEY_ADDED'});
    restService.fetchProduct = jest.fn().mockResolvedValue({requestId: 1, productToDispatch: {name: 'Product 1', price: 20, id: 1}, currentBalance: {amount: 0}, change: {amount: 30}, operationStatus: 'PRODUCT_DISPATCHED'});
    
    const componentRendered = await waitFor(() => render(<VendingMachineSetup resetVendingMachine = {mockFunction} />));

    const {getByText,getAllByTestId, getByTestId} = componentRendered;
    const currency = getAllByTestId('vm-currency-btn-id')[3];
    fireEvent.click(currency);
    await waitFor(() => expect(getByText('Your current balance amount is: 50')).toBeDefined());


    const product1Btn = getByTestId('product-select-1');
    
    fireEvent.click(product1Btn);

    await waitFor(() => expect(getByText('Please collect your product: Product 1 and change of Rs: 30')).toBeDefined());
    expect(getByText('Rs. 30')).toBeDefined();


    const {container} = componentRendered
    const productDispatch = container.querySelectorAll('div.animate');
    
    expect(productDispatch.length).toBe(2);
    expect(product1Btn).toBeDisabled();

    jest.runAllTimers();

    expect(mockFunction).toBeCalledTimes(1);
  });

  it('Select Product with insufficient funds', async () => {

    const mockFunction = jest.fn();
    jest.spyOn(restService, 'addAmount').mockImplementation(() => {
      return {requestId: 1, 
        productToDispatch: null, 
        currentBalance: {amount: 5}, 
        change: {amount: 0}, 
        operationStatus: 'MONEY_ADDED'
      }
    });

    jest.spyOn(restService, 'fetchProduct').mockImplementation(() => {
      return {requestId: 1, 
        productToDispatch: null, 
        currentBalance: {amount: 5}, 
        change: {amount: 0}, 
        operationStatus: 'INSUFFICIENT_BALANCE'
      }
    });
    
    const componentRendered = await waitFor(() => render(<VendingMachineSetup resetVendingMachine = {mockFunction} />));

    const {getByText,getAllByTestId, getByTestId} = componentRendered;
    const currency = getAllByTestId('vm-currency-btn-id')[0];
    fireEvent.click(currency);
    await waitFor(() => expect(getByText('Your current balance amount is: 5')).toBeDefined());


    const product1Btn = getByTestId('product-select-1');
    
    fireEvent.click(product1Btn);

    const {container} = componentRendered;
    const displayMsgcontainer = container.querySelectorAll('div.display-message-container');
    await waitFor(() => expect(displayMsgcontainer[0].textContent).toBe('You have insufficient balance. Please collect your refund: 5'));
    expect(getByText('Rs. 5')).toBeDefined();

    expect(container.querySelectorAll('div.animate').length).toBe(1);
    expect(product1Btn).toBeDisabled();

    jest.runAllTimers();

    expect(mockFunction).toBeCalledTimes(1);
  });
});

