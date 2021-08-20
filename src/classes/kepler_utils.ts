
export class KeplrUtils {
    public chainId: string;
    public chainName: string;
    public rpcUri: string;
    public restUri: string;

    constructor(chainId: string, chainName: string, rpcUri: string, restUri: string) {
        this.chainId = chainId;
        this.chainName = chainName;
        this.rpcUri = rpcUri;
        this.restUri = restUri;
        this.init();
    }

    private async init() {
        console.log("init");
    }

    async getOfflineSigner() {
        console.log("getOfflineSigner");
    }

    async sendToken(recipient: string, _amount: string) {
        console.log("sendToken.", recipient, _amount);
    }

}