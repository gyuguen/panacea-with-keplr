export class KeplrUtils {
    public chainId: string;
    public chainName: string;
    public rpcUri: string;
    public restUri: string

    constructor(chainId: string, chainName: string, rpcUri: string, restUri: string) {
        this.chainId = chainId;
        this.chainName = chainName;
        this.rpcUri = rpcUri;
        this.restUri = restUri;
    }

    public static async build(chainId: string, chainName: string, rpcUri: string, restUri: string): Promise<KeplrUtils> {
        let keplr = new KeplrUtils(chainId, chainName, rpcUri, restUri);
        const status = await keplr.registerKeplr();
        if (!status) {
            return null;
        }
        return keplr;
    }

    private async registerKeplr(): Promise<boolean> {
        if (!(window as any).getOfflineSigner || !this.getKeplrInWindow()) {
            alert("Please install keplr extension");
        } else {
            if (this.getKeplrInWindow().experimentalSuggestChain) {
                try {
                    await this.getKeplrInWindow().experimentalSuggestChain(this.makeOption());
                    return true;
                } catch {
                    alert("Failed to suggest the chain");
                }
            } else {
                alert("Please use the recent version of keplr extension");
            }
        }
        return false;
    }

    public getKeplrInWindow(): any {
        return (window as any).keplr;
    }

    public getOfflineSigner(): any {
        return (window as any).getOfflineSigner(this.chainId);
    }

    public async getSignerAddress(): Promise<string> {
        return (await this.getOfflineSigner().getAccounts())[0].address;
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
            },
            features: ["stargate", 'ibc-transfer', 'cosmwasm']
        };
    }

}