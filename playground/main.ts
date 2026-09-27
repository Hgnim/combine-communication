import { CbCm } from "../src/index";

let cbcm:CbCm;

function sig_click() {
    cbcm.signalConnect(
        JSON.parse(
            (document.getElementById("sigIpt") as HTMLInputElement).value,
        ),
    ).then((sigData) => {
        console.log(sigData, JSON.stringify(sigData));
    });
}
function msg_click() {
    cbcm.sendStr((document.getElementById("msgIpt") as HTMLInputElement).value);
}
function initTarget(isI: boolean) {
    cbcm = new CbCm(isI);
    cbcm.getSignal().then(sig => {
        console.log(sig);
        console.log(JSON.stringify(sig));
    });

    cbcm.emitter.on("connect", () => {
        console.log("connect now");
    });
    cbcm.emitter.on("getData", (data) => {
        console.log("msg:", data.msgData);
    });
}

(window as any).sig_click = sig_click;
(window as any).msg_click = msg_click;
(window as any).init_target = initTarget;
