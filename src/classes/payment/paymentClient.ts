import {KeplrUtils} from "../keplrUtils";
import {ExecuteResult, InstantiateResult, SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {ContractCreate, ContractInfo, Execute, Query} from "./payment";

export class PaymentClient {
    public rpcUri: string;
    private keplr: KeplrUtils;
    private wasmClient: SigningCosmWasmClient;

    constructor(keplr: KeplrUtils) {
        this.rpcUri = keplr.rpcUri;
        this.keplr = keplr;
    }

    public static async build(keplr: KeplrUtils) {
        const client: PaymentClient = new PaymentClient(keplr);
        await client.init();
        return client;
    }

    private async init() {
        this.wasmClient = await SigningCosmWasmClient.connectWithSigner(this.rpcUri, this.keplr.getOfflineSigner());
    }

    public async instantiate(code: number, sourceContracts: string[], amount: string): Promise<InstantiateResult> {
        const payer: string = await this.keplr.getSignerAddress();

        return this.wasmClient.instantiate(payer, code, ContractCreate.toRecord(sourceContracts, payer), "create contract", {
            transferAmount: [{denom: "umed", amount: (parseFloat(amount) * 1000000).toString()}]
        });
    }

    public async getContracts(code: number): Promise<ContractInfo[]> {
        const contractAddress: readonly string[] = await this.wasmClient.getContracts(code);

        return Promise.all(contractAddress.map(async contractAddr => {
            let contractInfo: ContractInfo = await this.wasmClient.queryContractSmart(contractAddr, Query.contractInfoToRecord());
            contractInfo.contract = contractAddr;
            let coin = await this.wasmClient.getBalance(contractAddr, "umed");
            contractInfo.amount = (parseFloat(coin.amount) / 1000000).toString() + "MED";
            return contractInfo;
        }));
    }

    public async deposit(contract: string, amount: string): Promise<ExecuteResult> {
        const payer: string = await this.keplr.getSignerAddress();
        const funds = [{denom: "umed", amount: (parseFloat(amount) * 1000000).toString()}];

        return this.wasmClient.execute(payer, contract, Execute.depositToRecord(), "", funds);
    }
}