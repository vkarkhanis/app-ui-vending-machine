import { useCurrencyActions } from './useCurrencyActions';
import { renderHook } from "@testing-library/react-hooks";
import * as restService from '../services/rest-service';

jest.mock('../services/rest-service');

describe('Test behaviour of currency component', () => {

    it('Add new amount', async () => {

        // Create mock implementations
        restService.addAmount = jest.fn().mockResolvedValue({amount: 20});
        restService.increaseAmount = jest.fn().mockResolvedValue({amount: 30});

        // Render hook using renderHook from @testing-library/react-hooks
        const { result } = renderHook(() => useCurrencyActions(undefined));

        // Check the returned object of React Hook
        expect(result.current).toBeDefined();
        
        // Wait for async method call in hook
        await result.current.onAmountAdded(10);

        // Assert expected method calls from rest-service module
        expect(restService.addAmount).toBeCalled();
        expect(restService.increaseAmount).not.toBeCalled();
        
    })

    it('Update amount', async () => {

        restService.addAmount = jest.fn().mockResolvedValue({amount: 20});
        restService.increaseAmount = jest.fn().mockResolvedValue({amount: 30});

        const { result } = renderHook(() => useCurrencyActions(1));
        expect(result.current).toBeDefined();

        await result.current.onAmountAdded(10);

        expect(restService.addAmount).not.toBeCalled();
        expect(restService.increaseAmount).toBeCalled();
    })

})