class VendingMachineResponse {

    constructor(orderId, status, balance, productToDispatch) {
        this.orderId = orderId;
        this.balance = balance;
        this.productToDispatch = productToDispatch;
        this.status = status;
    }

    get OrderId() {
        return this.orderId;
    }

    get Balance() {
        return this.balance;
    }

    get ProductToDispatch() {
        return this.productToDispatch;
    }

    get Status() {
       return this.status;
    }
    
}

export default VendingMachineResponse;