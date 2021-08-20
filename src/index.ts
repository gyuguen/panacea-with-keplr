import {KeplrUtils} from "./classes/kepler_utils";
import './css/style.css'

window.onload = async () => {
    let keplr = new KeplrUtils("gyuguen-1", "gyuguen", "localhost:26657", "localhost:1317");
    keplr.getOfflineSigner();

    let fromAddress: HTMLInputElement = document.querySelector(".from_address");
    fromAddress.value = "asdf12345asdf";
}