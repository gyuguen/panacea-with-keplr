import {KeplrUtils} from "./classes/keplrUtils";
import {NftClient} from "./classes/nft/nftClient";
import {Client} from "./common";
import {AllNftInfo} from "./classes/nft/nft";
import {ExecuteResult} from "@cosmjs/cosmwasm-stargate";

let keplrUtils: KeplrUtils;
let nftClient: NftClient;

// @ts-ignore
const transferModal = new bootstrap.Modal(document.getElementById('transferModal'), {
    keyboard: false
})
// @ts-ignore
const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'), {
    keyboard: false
})

window.onload = async () => {
    const client: Client = await Client.build();
    keplrUtils = client.keplrUtils;
    nftClient = client.nftClient;

    (document.getElementById("owner") as HTMLInputElement).value = await keplrUtils.getSignerAddress();
}

document.getElementById("myNftForm").onsubmit = async (e) => {
    e.preventDefault();
    await refreshNFTs();
}

const refreshNFTs = async () => {
    const form = new FormData(document.getElementById("myNftForm") as HTMLFormElement);
    const contract: string = form.get("contract").toString();
    const owner: string = form.get("owner").toString();

    const nftInfos: AllNftInfo[] = await nftClient.getTokens(contract, owner);
    const nftTbody = document.getElementById("nftBody");

    nftTbody.innerHTML = "";

    for (let i = 0; i < nftInfos.length; i++) {
        const nftInfo: AllNftInfo = nftInfos[i];
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.innerText = (i + 1).toString();
        const td1 = document.createElement("td");
        td1.innerText = nftInfo.tokenId;
        const td2 = document.createElement("td");
        td2.innerText = nftInfo.access.owner;
        const td3 = document.createElement("td");
        td3.innerText = nftInfo.info.name;
        const td4 = document.createElement("td");
        td4.innerText = nftInfo.info.image;
        const td5 = document.createElement("td");
        let tokenPrice = parseFloat(nftInfo.info.price.amount) / 1000000 + "MED";
        td5.innerText = tokenPrice.toString();
        const td6 = document.createElement("td");
        const transferBtn = document.createElement("button");
        transferBtn.innerText = "transfer";
        transferBtn.setAttribute("type", "button");
        transferBtn.setAttribute("data-contract", contract);
        transferBtn.setAttribute("data-token_id", nftInfo.tokenId);
        transferBtn.setAttribute("data-price", tokenPrice.toString());
        transferBtn.classList.add("btn", "btn-secondary", "btn-sm");
        transferBtn.addEventListener("click", openTransferPopup);
        td6.appendChild(transferBtn);

        const paymentBtn = document.createElement("button");
        paymentBtn.innerText = "payment";
        paymentBtn.setAttribute("type", "button");
        paymentBtn.setAttribute("data-contract", contract);
        paymentBtn.setAttribute("data-token_id", nftInfo.tokenId);
        paymentBtn.setAttribute("data-price", tokenPrice.toString());
        paymentBtn.classList.add("btn", "btn-primary", "btn-sm");
        paymentBtn.addEventListener("click", openPaymentPopup);
        td6.appendChild(paymentBtn);

        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        nftTbody.appendChild(tr);
    }

}

const openTransferPopup = async (e: Event) => {
    const contract = (e.target as HTMLButtonElement).dataset.contract;
    const tokenId = (e.target as HTMLButtonElement).dataset.token_id;
    const tokenPrice = (e.target as HTMLButtonElement).dataset.price;
    (document.querySelector("#transferModal input[name='contract']") as HTMLInputElement).value = contract;
    (document.querySelector("#transferModal input[name='tokenId']") as HTMLInputElement).value = tokenId;
    (document.querySelector("#transferModal input[name='price']") as HTMLInputElement).value = tokenPrice;
    transferModal.show();
}

document.getElementById("transferForm").onsubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const contract = (document.getElementById("contract") as HTMLInputElement).value;
    const tokenId = form.get("tokenId").toString();
    const recipient = form.get("recipient").toString();

    try {
        const result: ExecuteResult = await nftClient.transferNFT(contract, tokenId, recipient);
        alert("NFT Transfer success.\r\nTx: " + result.transactionHash);
    } catch (err) {
        alert("Transfer NFT failed.\r\n" + err);
    } finally {
        transferModal.hide();
        await refreshNFTs();
    }

}

const openPaymentPopup = async (e: Event) => {
    const contract = (e.target as HTMLButtonElement).dataset.contract;
    const tokenId = (e.target as HTMLButtonElement).dataset.token_id;
    const tokenPrice = (e.target as HTMLButtonElement).dataset.price;
    (document.querySelector("#paymentForm input[name='contract']") as HTMLInputElement).value = contract;
    (document.querySelector("#paymentForm input[name='tokenId']") as HTMLInputElement).value = tokenId;
    (document.querySelector("#paymentForm input[name='price']") as HTMLInputElement).value = tokenPrice;
    paymentModal.show();
}

document.getElementById("paymentForm").onsubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const contract = form.get("contract").toString();
    const tokenId = form.get("tokenId").toString();
    const recipient = form.get("recipient").toString();

    try {
        const result: ExecuteResult = await nftClient.sendNFT(contract, tokenId, recipient);
        alert("Payment NFT success.\r\nTx: " + result.transactionHash);
    } catch (err) {
        alert("Payment NFT failed.\r\n" + err);
    } finally {
        paymentModal.hide();
        await refreshNFTs();
    }
}