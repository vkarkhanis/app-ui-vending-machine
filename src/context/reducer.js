export const initialState = {
    orderId: 0, 
    displayMsg: 'Please add required amount', 
    disabled: false, 
    changeDispatch: 0,
    productDispatch: undefined
}

export const reducer = (state, action) => {
    if (!action || !action.payload) {
        return state;
    }

    switch(action.type) {
        case "BALANCE_UPDATE": {
            const {orderId, balance} = action.payload;

            return {
                ...state, ...{orderId, 
                    displayMsg: 'Your current balance amount is Rs: ' + balance}
            }
        }

        case "REFUND_PROCESSED": {
            const {balance} = action.payload;
            return {
                ...state, ...{changeDispatch: balance, disabled: true, 
                    displayMsg: `Please collect your balance amount of Rs: ${balance}`}
            }
        }

        case "REFUND_AFTER_ERROR": {
            const {balance} = action.payload;
            return {
                ...state, ...{changeDispatch: balance, disabled: true, 
                    displayMsg: `There was an error processing your request.
                    Please collect your refund amount: ${balance}`}
            }
        }

        case "PRODUCT_DISPATCHED": {
            const {balance, productToDispatch} = action.payload;
            return {
                ...state, ...{changeDispatch: balance, disabled: true, 
                    productDispatch: productToDispatch.name,
                    displayMsg: `Please collect your product: ${productToDispatch.name} and change of Rs: ${balance}`}
            }
        }

        case "INSUFFICIENT_BALANCE": {
            const {balance} = action.payload;
            return {
                ...state, ...{changeDispatch: balance, disabled: true,
                    displayMsg: `You have insufficient balance. Please collect your refund of Rs: ${balance}`}
            }
        }

        case "INSUFFICIENT_BALANCE_REFUND_ERROR": {
            return {
                ...state, ...{disabled: true,
                    displayMsg: `Product could no be dispatched because you have insufficient balance. We could not process your refund. Please contact the admin`}
            }
        }

        case "PRODUCT_FETCH_AND_REFUND_FAILURE": {
            return {
                ...state, ...{disabled: true,
                    displayMsg: `There was an error while dispatching the product. We could not process your refund. Please contact the admin`}
            }
        }

        case "PRODUCT_FETCH_FAILURE": {
            const {balance} = action.payload;
            return {
                ...state, ...{disabled: true,
                    displayMsg: `There was an error while dispatchig the product. Please collect your refund of Rs: ${balance}`}
            }
        }

        case "UPDATE_AMOUNT_AND_REFUND_FAILURE": {
            return {
                ...state, ...{disabled: true,
                    displayMsg: `There was an error while updating the amount. We could not process your refund. Please contact the admin`}
            }
        }

        case "UPDATE_AMOUNT_FAILURE": {
            const {balance} = action.payload;
            return {
                ...state, ...{disabled: true,
                    displayMsg: `There was an error while updating the amount. Please collect your refund of Rs: ${balance}`}
            }
        }
        
        case "ERROR": {
            const {balance} = action.payload;

            return {
                ...state, ...{changeDispatch: balance || 0, disabled: true,
                    displayMsg: `There was some error while processing your request. 
                    Kindly collect your refund (if any) and try again later`} 
            }
        }

        default: {
            return state;
        }
    }
}