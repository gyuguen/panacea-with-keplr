import {KeplrUtils} from "./classes/keplrUtils";
import {Client} from "./common";
import {PaymentClient} from "./classes/payment/paymentClient";
import {ExecuteResult} from "@cosmjs/cosmwasm-stargate";

let keplrUtils: KeplrUtils;
let paymentClient: PaymentClient;

window.onload = async () => {
    const client: Client = await Client.build();
    keplrUtils = client.keplrUtils;
    paymentClient = client.paymentClient;

    (document.getElementById("payer") as HTMLInputElement).value = await keplrUtils.getSignerAddress();
}

document.getElementById("createContract").onsubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const code = form.get("code").toString();
    const sourceContracts = form.get("sourceContracts").toString();
    const amount = form.get("amount").toString();

    try {
        const result = await paymentClient.instantiate(parseInt(code), sourceContracts.split(","), amount);

        alert("Create contract success.\r\nTx: " + result.transactionHash);
    } catch (err) {
        alert("Create contract failed.\r\n" + err)
    }

}

const refreshContracts = async() => {
    const code = (document.getElementById("searchCode") as HTMLInputElement).value;

    const contractInfos = await paymentClient.getContracts(parseInt(code));
    const contractTbody = document.getElementById("contractsBody");

    contractTbody.innerHTML = "";

    for (let i = 0; i < contractInfos.length; i++) {
        const contractInfo = contractInfos[i];
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.innerText = (i + 1).toString();
        const td1 = document.createElement("td");
        td1.innerText = contractInfo.contract;
        const td2 = document.createElement("td");
        td2.innerText = contractInfo.source_contracts.join(",");
        const td3 = document.createElement("td");
        td3.innerText = contractInfo.payer;
        const td4 = document.createElement("td");
        td4.innerText = contractInfo.amount;

        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        contractTbody.appendChild(tr);
    }
}

document.getElementById("searchContractBtn").onclick = async (e) => {
    await refreshContracts();
}

document.getElementById("depositForm").onsubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const contract = form.get("contract").toString();
    const amount = form.get("amount").toString();

    try {
        const result: ExecuteResult = await paymentClient.deposit(contract, amount);
        alert("Deposit success.\r\nTx: " + result.transactionHash);
        await refreshContracts();
    } catch (err) {
        alert("Deposit failed.\r\n" + err);
    }
}

(document.querySelector("#refundForm input[name='contract']") as HTMLInputElement).onchange = async (e) => {
    const contract = (e.target as HTMLInputElement).value;
    const coin = await paymentClient.getBalance(contract);
    const amount = parseFloat(coin.amount) / 1000000;
    (document.querySelector("#refundForm input[name='amount']") as HTMLInputElement).value = amount.toString();
}

document.getElementById("refundForm").onsubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const contract = form.get("contract").toString();
    try {
        const result = await paymentClient.refund(contract);
        alert("Refund success.\r\nTx: " + result.transactionHash);
        await refreshContracts();
    } catch (err) {
        alert("Refund failed.\r\n" + err);
    }
}