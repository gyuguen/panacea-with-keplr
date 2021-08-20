
export class SendToken {
    recipient: string;
    amount: string;

    constructor(recipient: string, amount: string) {
        this.recipient = recipient;
        this.amount = amount;
    }
}