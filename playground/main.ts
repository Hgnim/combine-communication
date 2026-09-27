import { init as cbcmInit, signal, send, emitter } from "../src/index";

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
    cbcmInit(isI).then(ret => {
        console.log(ret);
        console.log(JSON.stringify(ret));
    });
    emitter.on("signal", (data) => {
        console.log("signal: ", data.sigData,JSON.stringify(data.sigData));
    });
    emitter.on('connect', () => {
        console.log('connect now');
    })
    emitter.on('getData', (data) => {
        console.log('msg:', data.msgData)
    });
}

(window as any).sig_click = sig_click;
(window as any).msg_click = msg_click;
(window as any).init_target = initTarget;
