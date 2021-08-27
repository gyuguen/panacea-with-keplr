import {ExecuteResult, InstantiateResult, SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate"
import {Coin, isBroadcastTxFailure, logs, StdFee} from "@cosmjs/stargate"
import {KeplrUtils} from "../keplrUtils";
import {AllNftInfo, ContractCreate, ContractInfo, Execute, Query, Tokens} from "./nft";
import {toUtf8} from "@cosmjs/encoding";
import {MsgExecuteContract} from "@cosmjs/cosmwasm-stargate/build/codec/cosmwasm/wasm/v1beta1/tx";
import {BroadcastTxFailure} from "@cosmjs/stargate/build/stargateclient";

export class NftClient {
    public rpcUri: string;
    private keplr: KeplrUtils;
    private wasmClient: SigningCosmWasmClient;
    private defaultFee: StdFee;

    constructor(keplr: KeplrUtils) {
        this.rpcUri = keplr.rpcUri;
        this.keplr = keplr;
    }

    public static async build(keplr: KeplrUtils) {
        const client: NftClient = new NftClient(keplr);
        await client.init();
        return client;
    }

    private async init() {
        this.wasmClient = await SigningCosmWasmClient.connectWithSigner(this.rpcUri, this.keplr.getOfflineSigner());
    }

    public async instantiate(code: number, name: string, symbol: string): Promise<InstantiateResult> {
        const minter: string = await this.keplr.getSignerAddress();

        return this.wasmClient.instantiate(minter, code, ContractCreate.toRecord(name, symbol, minter), "create contract");
    }

    public async getContracts(code: number): Promise<ContractInfo[]> {
        const contractAddress: readonly string[] = await this.wasmClient.getContracts(code);

        return Promise.all(contractAddress.map(async contractAddr => {
            let contractInfo: ContractInfo = await this.wasmClient.queryContractSmart(contractAddr, Query.contractInfoToRecord());
            contractInfo.contract = contractAddr;
            return contractInfo;
        }));
    }

    public async mintNFT(contract: string, owner: string, name: string, image: string, _price: string): Promise<ExecuteResult> {
        const minter: string = await this.keplr.getSignerAddress();
        let price = parseFloat(_price) * 1000000;
        return this.wasmClient.execute(minter, contract, Execute.mintToRecord(owner, name, image, {
            denom: "umed",
            amount: price.toString(),
        }));
    }

    public async getNFTs(contract: string): Promise<AllNftInfo[]> {
        const tokens: Tokens = await this.wasmClient.queryContractSmart(contract, Query.allTokensToRecord());

        return Promise.all(
            tokens.tokens.map(async tokenId => {
                const allNftInfo: AllNftInfo = await this.wasmClient.queryContractSmart(contract, Query.allNftInfoToRecord(tokenId));
                allNftInfo.tokenId = tokenId;
                allNftInfo.info.price = JSON.parse(allNftInfo.info.description).price;
                return allNftInfo;
            })
        );
    }

    public async getTokens(contract: string, owner: string, startAfter?: string, limit?: number): Promise<AllNftInfo[]> {
        const tokens: Tokens = await this.wasmClient.queryContractSmart(contract, Query.tokens(owner, startAfter, limit))
        return Promise.all(
            tokens.tokens.map(async tokenId => {
                const allNftInfo: AllNftInfo = await this.wasmClient.queryContractSmart(contract, Query.allNftInfoToRecord(tokenId));
                allNftInfo.tokenId = tokenId;
                allNftInfo.info.price = JSON.parse(allNftInfo.info.description).price;
                return allNftInfo;
            })
        );
    }

    public async transferNFT(contract: string, tokenId: string, recipient: string): Promise<ExecuteResult> {
        const owner: string = await this.keplr.getSignerAddress();
        return this.wasmClient.execute(owner, contract, Execute.transferNftToRecord(tokenId, recipient));
    }

    public async sendNFT(contract: string, tokenId: string, recipient: string): Promise<ExecuteResult> {
        const owner: string = await this.keplr.getSignerAddress();
        return this.executeWithFee(owner, contract, Execute.sendNftToRecord(tokenId, recipient), {
            amount: [{
                denom: "umed",
                amount: "5"
            }], gas: "300000"
        })
    }

    /**
     * There is no way to modify the fe in the current version.
     * In version v0.26.0, the fee is expected to be entered, but the cosmwasm version has been raised.
     * If version up to v0.26.0 then you remove this function.
     * @param senderAddress
     * @param contractAddress
     * @param msg
     * @param fee
     * @param memo
     * @param funds
     */
    async executeWithFee(senderAddress: string, contractAddress: string, msg: Record<string, unknown>, fee?: StdFee, memo?: string, funds?: readonly Coin[]): Promise<ExecuteResult> {
        const executeContractMsg = {
            typeUrl: "/cosmwasm.wasm.v1beta1.MsgExecuteContract",
            value: MsgExecuteContract.fromPartial({
                sender: senderAddress,
                contract: contractAddress,
                msg: toUtf8(JSON.stringify(msg)),
                funds: [...(funds || [])],
            }),
        };
        const result = await this.wasmClient.signAndBroadcast(senderAddress, [executeContractMsg], fee || this.wasmClient.fees.exec, memo);
        if (isBroadcastTxFailure(result)) {
            throw new Error(this.createBroadcastTxErrorMessage(result));
        }
        return {
            logs: logs.parseRawLog(result.rawLog),
            transactionHash: result.transactionHash,
        };
    }

    createBroadcastTxErrorMessage(result: BroadcastTxFailure) {
        return `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`;
    }

}