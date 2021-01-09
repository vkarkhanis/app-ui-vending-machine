import { render, waitFor } from '@testing-library/react';
import { VendingMachine } from './VendingMachine';
import * as restService from './services/rest-service';

const mockedProductsResponse = 
        [{id: 1, price: 20, name: 'Product 1'}, {id: 2, price: 40, name: 'Product 2'}];

it('Test if Vending Machine renders withouot crash', async () => {
    jest.spyOn(restService, 'fetchAllProducts').mockImplementation(() => Promise.resolve(mockedProductsResponse));
    const container = await waitFor(() => render(<VendingMachine />));
    expect(container).toBeDefined();
})
