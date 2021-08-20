/*
import {assertIsBroadcastTxSuccess, SigningStargateClient} from "@cosmjs/stargate"

export class KeplrUtils {
    public chainId: string;
    public chainName: string;
    public rpcUri: string;
    public restUri: string;
    public keplr: any;

    constructor(chainId: string, chainName: string, rpcUri: string, restUri: string) {
        this.chainId = chainId;
        this.chainName = chainName;
        this.rpcUri = rpcUri;
        this.restUri = restUri;
        this.init();
    }

    private async init() {
        this.keplr = (window as any).keplr;
        if (!(window as any).getOfflineSigner || !this.keplr) {
            alert("Please install keplr extension");
        } else {
            if (this.keplr.experimentalSuggestChain) {
                try {
                    let option = this.makeOption();
                    await this.keplr.experimentalSuggestChain(option);
                } catch {
                    alert("Failed to suggest the chain");
                }
            } else {
                alert("Please use the recent version of keplr extension");
            }
        }
        return this;
    }

    private makeOption() {
        return {
            chainId: this.chainId,
            chainName: this.chainName,
            rpc: this.rpcUri,
            rest: this.restUri,
            stakeCurrency: {
                coinDenom: "MED",
                coinMinimalDenom: "umed",
                coinDecimals: 5,
            },

            bip44: {
                coinType: 371,
            },

            bech32Config: {
                bech32PrefixAccAddr: "panacea",
                bech32PrefixAccPub: "panaceapub",
                bech32PrefixValAddr: "panaceavaloper",
                bech32PrefixValPub: "panaceavaloperpub",
                bech32PrefixConsAddr: "panaceavalcons",
                bech32PrefixConsPub: "panaceavalconspub"
            },
            currencies: [{
                coinDenom: "MED",
                coinMinimalDenom: "umed",
                coinDecimals: 5,
            }],
            feeCurrencies: [{
                coinDenom: "MED",
                coinMinimalDenom: "umed",
                coinDecimals: 5,
            }],
            coinType: 371,
            gasPriceStep: {
                low: 0.01,
                average: 0.025,
                high: 0.04
            }
        };
    }

    async getOfflineSigner() {
        await this.keplr.enable(this.chainId);
        return this.keplr.getOfflineSignerOnlyAmino(this.chainId);
    }

    async sendToken(recipient: string, _amount: string) {
        let amount = parseFloat(_amount);
        if (isNaN(amount)) {
            alert("Invalid amount");
            return false;
        }

        amount *= 1000000;
        amount = Math.floor(amount);

        const offlineSigner: any = this.getOfflineSigner();

        const [firstAccount] = await offlineSigner.getAccounts();

        const client = await SigningStargateClient.connectWithSigner(this.rpcUri, offlineSigner);

        const coin = {
            denom: "umed",
            amount: amount.toString()
        };

        const result = await client.sendTokens(firstAccount.address, recipient, [coin], "Have fun with your star coins");

        assertIsBroadcastTxSuccess(result);
    }

}*/
