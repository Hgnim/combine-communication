import { init as cbcmInit, signal, send } from "../src/index";

function sig_click() {
    signal(
        JSON.parse(
            (document.getElementById("sigIpt") as HTMLInputElement).value,
        ),
    );
}
function msg_click() {
    send((document.getElementById("msgIpt") as HTMLInputElement).value);
}
function initTarget(isI: boolean) {
    cbcmInit(isI);
}

(window as any).sig_click = sig_click;
(window as any).msg_click = msg_click;
(window as any).init_target = initTarget;
