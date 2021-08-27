import {KeplrUtils} from "../keplrUtils";
import {BroadcastTxResponse, Coin, SigningStargateClient} from "@cosmjs/stargate"

export class BankClient {
    public rpcUri: string;
    private keplr: KeplrUtils;
    private client: SigningStargateClient;

    constructor(keplr: KeplrUtils) {
        this.rpcUri = keplr.rpcUri;
        this.keplr = keplr;
    }

    public static async build(keplr: KeplrUtils) {
        const client: BankClient = new BankClient(keplr);
        await client.init();
        return client;
    }

    private async init() {
        this.client = await SigningStargateClient.connectWithSigner(this.rpcUri, this.keplr.getOfflineSigner());
    }

    public async getBalance(address: string): Promise<string> {
        const coin: Coin = await this.client.getBalance(address, "umed");
        return (parseFloat(coin.amount) / 1000000).toString();
    }

    public async sendToken(recipient: string, _amount: string): Promise<BroadcastTxResponse> {
        const sender: string = await this.keplr.getSignerAddress();

        let amount = parseFloat(_amount) * 1000000;

        return this.client.sendTokens(sender, recipient, [{denom: "umed", amount: amount.toString()}]);
    }
}