import {assertIsBroadcastTxSuccess, SigningStargateClient} from "@cosmjs/stargate";
import {CosmWasmClient, SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";

const chainId = "gyuguen-1";
const rpcUri = 'http://127.0.0.1:26657';
const restUri = 'http://127.0.0.1:1317';

window.onload = async () => {
    if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
    } else {
        if (window.keplr.experimentalSuggestChain) {
            try {
                await window.keplr.experimentalSuggestChain({
                    chainId: chainId,
                    chainName: "gyuguen-1",
                    rpc: rpcUri,
                    rest: restUri,
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
                });
            } catch {
                alert("Failed to suggest the chain");
            }
        } else {
            alert("Please use the recent version of keplr extension");
        }


        let offlineSigner = window.getOfflineSigner(chainId);
        const [firstAccount] = await offlineSigner.getAccounts();
        document.getElementById("address").append(firstAccount.address);




        const client = await SigningStargateClient.connectWithSigner(rpcUri, offlineSigner);
        const ownerBalance = client.getBalance(firstAccount.address, "umed");
        document.getElementById("ownerAmount").append((await ownerBalance).amount + (await ownerBalance).denom);
    }
}

document.getElementById("recipient").onchange = () => {
    let recipient = document.sendForm.recipient.value;
    (async () => {
        await window.keplr.enable("gyuguen-1");
        const offlineSigner = window.keplr.getOfflineSignerOnlyAmino("gyuguen-1");

        const client = await SigningStargateClient.connectWithSigner(rpcUri, offlineSigner);

        const recipientBalance = client.getBalance(recipient, "umed");
        document.getElementById("recipientAmount").innerHTML = (await recipientBalance).amount + (await recipientBalance).denom;
    })();
}

document.sendForm.onsubmit = () => {
    let recipient = document.sendForm.recipient.value;
    let amount = document.sendForm.amount.value;

    amount = parseFloat(amount);
    if (isNaN(amount)) {
        alert("Invalid amount");
        return false;
    }

    amount *= 1000000;
    amount = Math.floor(amount);

   (async () => {
        await window.keplr.enable("gyuguen-1");
        const offlineSigner = window.keplr.getOfflineSignerOnlyAmino("gyuguen-1");

        const [firstAccount] = await offlineSigner.getAccounts();

        const client = await SigningStargateClient.connectWithSigner(rpcUri, offlineSigner);

        const coin = {
            denom: "umed",
            amount: amount.toString()
        };

        const result = await client.sendTokens(firstAccount.address, recipient, [coin], "Have fun with your star coins");

        assertIsBroadcastTxSuccess(result);

       const ownerBalance = client.getBalance(firstAccount.address, "umed");
       document.getElementById("ownerAmount").innerHTML = (await ownerBalance).amount + (await ownerBalance).denom;


       const recipientBalance = client.getBalance(recipient, "umed");
       document.getElementById("recipientAmount").innerHTML = (await recipientBalance).amount + (await recipientBalance).denom;
    })();

    return false;
}