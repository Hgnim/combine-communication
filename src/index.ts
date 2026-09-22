import speer from "simple-peer";

var peer: speer.Instance;

export function init(isInitiator: boolean) {
    peer = new speer({
        initiator: isInitiator,//是否为发起者
        trickle: false,//等待ICE收集完成，只触发一次signal事件，用于手动交换信令。（如果为true则会输出多次，不便于手动交换）
    });
    peer.on('signal', data => { 
        console.log(data);
        console.log(JSON.stringify(data))
    });
    peer.on('connect', (data:any) => {
        console.log("connect: ", data);
    });
    peer.on("data", (data: any) => {
        console.log("msg: ", data);
    });
}

export function signal(data: speer.SignalData) {
    peer.signal(data);
}

export function send(msg: string) {
    peer.send(msg);
}
