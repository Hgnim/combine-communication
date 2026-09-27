import speer from "simple-peer";
import mitt from "mitt";
import sleep from 'sleep';

export type Events = {
    connect: {};
    getData: { msgData: any };
};
//事件器
export const emitter = mitt<Events>();

//核心
var peer: speer.Instance;
let sigData: speer.SignalData|null=null;

function peerSignal(data: speer.SignalData) {
    //console.log(data);
    //console.log(JSON.stringify(data));
    sigData = data;
}
function peerConnect() {
    //console.log("connect");
    emitter.emit("connect", {});
}
function peerData(data: any) {
    //console.log("msg: ", data);
    emitter.emit('getData', { msgData: data });
}

export async function init(isInitiator: boolean): Promise<speer.SignalData|null> {
    peer = new speer({
        initiator: isInitiator, //是否为发起者
        trickle: false, //等待ICE收集完成，只触发一次signal事件，用于手动交换信令。（如果为true则会输出多次，不便于手动交换）
    });
    peer.on("signal", peerSignal);
    peer.on("connect", peerConnect);
    peer.on("data", peerData);

    if (isInitiator) {
        while (sigData == null)
            await sleep(50);

        return sigData;
    } else return null;
}
export function unload() {
    peer.off("connect", peerConnect);
    peer.off("data", peerData);
}

export async function signal(data: speer.SignalData): Promise<speer.SignalData|null> {
    peer.signal(data);

    if (sigData == null) {
        while (sigData == null)
            await sleep(50);
        return sigData;
    } else return null;
}

export function send(msg: string) {
    peer.send(msg);
}
