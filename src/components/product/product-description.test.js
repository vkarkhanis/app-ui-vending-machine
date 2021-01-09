import { render, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { ProductDescription } from './ProductDescription';
import * as restService from '../../services/rest-service';

beforeEach(() => {
    fetch.resetMocks();
});
afterEach(cleanup);

const mockedProductsResponse = 
        [{id: 1, price: 20, name: 'Product 1'}, {id: 2, price: 40, name: 'Product 2'}];
const mockHandleResponse = jest.fn();

describe('Render component', () => {
    
    it('Check rendered DOM', async () => {

        fetch.mockResponseOnce(JSON.stringify(mockedProductsResponse));
        const container = render(<ProductDescription onProductSelected={mockHandleResponse} 
                requestId={10} 
                disabled = {true} />);

        const {getByText, getByTestId} = await waitFor(() => container);

        expect(getByText('Please select a product')).toBeDefined();
        expect(getByTestId('product-name-1')).toBeDefined();
        expect(getByTestId('product-price-1')).toBeDefined();
        expect(getByTestId('product-select-1')).toBeDefined();
        expect(getByTestId('product-select-1')).toBeDisabled();

        expect(getByTestId('product-name-2')).toBeDefined();
        expect(getByTestId('product-price-2')).toBeDefined();
        expect(getByTestId('product-select-2')).toBeDefined();
        expect(getByTestId('product-select-1')).toBeDisabled();
    });

});

describe('Fire Events', () => {

    it('Select product', async () => {
        
        fetch.mockResponseOnce(JSON.stringify(mockedProductsResponse));
        restService.fetchProduct = jest.fn();

        
        const container = render(<ProductDescription onProductSelected={mockHandleResponse} 
                requestId={10} 
                disabled = {false} />);

        const {getByTestId} = await waitFor(() => container);
        fireEvent.click(getByTestId('product-select-1'));

        /* Since there is an await call inside orderProduct handler in ProductDescription component
         we need to call expect(mockHandleResponse) inside waitFor */
        await waitFor(() => expect(mockHandleResponse).toHaveBeenCalled());
    });

    it('Product selection button can be disabled with props', async () => {
        
        fetch.mockResponseOnce(JSON.stringify(mockedProductsResponse));
        const container = render(<ProductDescription onProductSelected={mockHandleResponse} 
                requestId={10} 
                disabled = {true} />);

        const {getByTestId} = await waitFor(() => container);
        expect(getByTestId('product-select-1')).toBeDisabled();
    });
});