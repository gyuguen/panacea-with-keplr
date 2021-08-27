import {KeplrUtils} from "./classes/keplrUtils";
import {NftClient} from "./classes/nft/nftClient";
import {BankClient} from "./classes/bank/sendClient";
import {PaymentClient} from "./classes/payment/paymentClient";

const chainId: string = "gyuguen-1";
const chainName: string = "MediBloc Local";
const rpcUri: string = "http://localhost:26657";
const restUri: string = "http://localhost:1317";

export class Client {
    keplrUtils: KeplrUtils;
    bankClient: BankClient;
    nftClient: NftClient;
    paymentClient: PaymentClient;

    public static async build(): Promise<Client> {
        const client: Client = new Client();
        await client.init()
        return client;
    }

    private async init() {
        this.keplrUtils = await KeplrUtils.build(chainId, chainName, rpcUri, restUri);
        this.bankClient = await BankClient.build(this.keplrUtils);
        this.nftClient = await NftClient.build(this.keplrUtils);
        this.paymentClient = await PaymentClient.build(this.keplrUtils);
    }
}