import {KeplrUtils} from "./classes/keplrUtils";
import {NftClient} from "./classes/nft/nftClient";
import {Client} from "./common";
import {AllNftInfo, ContractInfo} from "./classes/nft/nft";

let keplrUtils: KeplrUtils;
let nftClient: NftClient;

window.onload = async () => {
    const client: Client = await Client.build();

    keplrUtils = client.keplrUtils;
    nftClient = client.nftClient;

    (document.getElementById("minter") as HTMLInputElement).value = await keplrUtils.getSignerAddress();

}

document.getElementById("createContract").onsubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);

    const code: number = parseInt(form.get("code").toString());
    const name: string = form.get("name").toString();
    const symbol: string = form.get("symbol").toString();

    try {
        const result = await nftClient.instantiate(code, name, symbol);
        alert (result);
    } catch (err) {
        alert("Failed create contract!\r\n" + err);
    }

    document.getElementById("createContractBtn").removeAttribute("disabled");
}

document.getElementById("searchContractBtn").onclick = async (e) => {
    e.preventDefault();
    await refreshContracts();
}

const refreshContracts = async () => {
    const code = (document.getElementById("searchCode") as HTMLInputElement).value;
    if (code.length == 0) {
        alert("Code is empty.");
        return;
    }

    const contractInfos: ContractInfo[] = await nftClient.getContracts(parseInt(code));

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
        td2.innerText = contractInfo.name;
        const td3 = document.createElement("td");
        td3.innerText = contractInfo.symbol;

        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        contractTbody.appendChild(tr);
    }
}

document.getElementById("mintNFTForm").onsubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);

    const contract: string = form.get("contract").toString();
    const owner: string = form.get("owner").toString();
    const name: string = form.get("name").toString();
    const image: string = form.get("image").toString();
    const price: string = form.get("price").toString();

    try {
        const result = await nftClient.mintNFT(contract, owner, name, image, price);
        alert ("Mint NFT Success.\r\nTx: " + result.transactionHash);
        await refreshNFTs();
    } catch (err) {
        alert("Failed mint NFT!\r\n" + err);
    }
}

document.getElementById("searchNftBtn").onclick = async () => {
    await refreshNFTs();
}

const refreshNFTs = async () => {
    const contract = (document.getElementById("searchContract") as HTMLInputElement).value;
    if (contract.length == 0) {
        alert("Contract is empty!");
        return;
    }

    const nftInfos: AllNftInfo[] = await nftClient.getNFTs(contract);
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
        td5.innerText = parseFloat(nftInfo.info.price.amount) / 1000000 + "MED";

        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        nftTbody.appendChild(tr);
    }
}