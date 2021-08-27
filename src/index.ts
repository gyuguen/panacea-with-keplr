import {KeplrUtils} from "./classes/keplrUtils";
import {BankClient} from "./classes/bank/sendClient";
import {Client} from "./common";

let keplrUtils: KeplrUtils;
let bankClient: BankClient;

window.onload = async () => {
    const client: Client = await Client.build();
    keplrUtils = client.keplrUtils;
    bankClient = client.bankClient;

    (document.getElementById("sender") as HTMLInputElement).value = await keplrUtils.getSignerAddress();

    await refresh();
}

document.getElementById("recipient").onchange = async (e) => {
    await refresh();
}

document.getElementById("send").onclick = async (e) => {
    e.preventDefault();

    document.getElementById("loading").style.display = "block";

    const recipient = (document.getElementById("recipient") as HTMLInputElement).value;
    const amount = (document.getElementById("amount") as HTMLInputElement).value;
    if (amount.length == 0) {
        alert("Send amount is empty!");
        document.getElementById("loading").style.display = "none";
        return;
    }
    const result = await bankClient.sendToken(recipient, amount);
    console.log(result);
    document.getElementById("loading").style.display = "none";
    await refresh();
}

const refresh = async () => {
    try {
        const sender: string = await keplrUtils.getSignerAddress();
        (document.getElementById("senderAmount") as HTMLInputElement).value = await bankClient.getBalance(sender);

        const recipient = (document.getElementById("recipient") as HTMLInputElement).value;
        if (recipient.length != 0) {
            (document.getElementById("recipientAmount") as HTMLInputElement).value = await bankClient.getBalance(recipient);
        }
    } catch (e) {
        alert("Failed get amount!\r\n" + e);
    }
}