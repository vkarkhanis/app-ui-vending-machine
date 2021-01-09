import React from 'react';
import ReactDOM from 'react-dom';
import { Currency } from './currency';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import * as restService from '../../services/rest-service';

jest.mock('../../services/rest-service');

beforeEach(() => {
    restService.addAmount = jest.fn().mockResolvedValue({amount: 20});
    restService.increaseAmount = jest.fn().mockResolvedValue({amount: 30});
})

afterEach(cleanup);

describe('Render Currency component test', () => {

    it('Currency component renders properly', () => {
        const divElem = document.createElement('div');
        ReactDOM.render(<Currency />, divElem);
        ReactDOM.unmountComponentAtNode(divElem);
    });
    
    it('Currency button name', () => {
        const { getByTestId } = render(<Currency disabled={false} value='Test' />);
        expect(getByTestId('vm-currency-btn-id')).toHaveTextContent('Test');
    });
    
    it('Match snapshot', () => {
        const tree = renderer.create(<Currency disabled={false} value='Test' onAmountAdded = {() => {}} />).toJSON();
        expect(tree).toMatchSnapshot();
    }); 

    it('Disable button', () => {
        const mockFn = jest.fn();
        const { getByTestId } = render(<Currency value='Test' disabled onAmountAdded={mockFn} />);
        expect(getByTestId('vm-currency-btn-id')).toBeDisabled();
    });

});

describe('Test Events', () => {

    it('Currency clicked', async () => {

        const mockFunction = jest.fn();

        const { getByTestId } = await waitFor(() => render(<Currency 
            disabled={false} value='Test' onAmountAdded={mockFunction} />));

        fireEvent.click(getByTestId('vm-currency-btn-id'));
        await waitFor(() => expect(mockFunction).toHaveBeenCalledTimes(1));
    });

});
