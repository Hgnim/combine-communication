import speer from "simple-peer";
import mitt from "mitt";
import sleep from 'sleep';

export type Events = {
    connect: {};
    getData: { msgData: any };
};
export class CbCm {
    //事件器
    public readonly emitter = mitt<Events>();
    //是否为发起者
    private readonly isInitiator: boolean;

    //核心
    private peer: speer.Instance;
    //信令数据
    private sigData: speer.SignalData | null = null;

    private peerSignal=(data: speer.SignalData) => {//批注：需要传递的函数需要使用赋值式箭头函数，以避免this丢失导致更改变量无法被成功更改
        //console.log(data);
        //console.log(JSON.stringify(data));
        this.sigData = data;
        //console.log(this.sigData)
    }
    private peerConnect=()=> {
        //console.log("connect");
        this.emitter.emit("connect", {});
    }
    private peerData=(data: any) =>{
        //console.log("msg: ", data);
        this.emitter.emit("getData", { msgData: data });
    }

    public constructor(isInitiator: boolean) {
        this.isInitiator = isInitiator;
        this.peer = new speer({
            initiator: isInitiator, //是否为发起者
            trickle: false, //等待ICE收集完成，只触发一次signal事件，用于手动交换信令。（如果为true则会输出多次，不便于手动交换）
        });
        this.peer.on("signal", this.peerSignal);
        this.peer.on("connect", this.peerConnect);
        this.peer.on("data", this.peerData);
    }
    /**
     * 如果是发起者，则通过该函数获取初始信令
     * @returns 返回信令，如果不是发起者则返回null
     */
    public async getSignal(): Promise<speer.SignalData | null> {
        if (this.isInitiator) {
            while (this.sigData == null) {
                await sleep(50);
                //console.log(this.sigData)
            }

            return this.sigData;
        } else return null;
    }
    /**
     * 卸载
     */
    public unload() {
        this.peer.off("connect", this.peerConnect);
        this.peer.off("data", this.peerData);
    }

    /**
     * 通过信令连接目标
     * @param data 信令
     * @returns 返回对方信令，如果当前是发起者则返回null
     */
    public async signalConnect(
        data: speer.SignalData,
    ): Promise<speer.SignalData | null> {
        this.peer.signal(data);

        if (!this.isInitiator && this.sigData == null) {
            while (this.sigData == null) await sleep(50);
            return this.sigData;
        } else return null;
    }

    /**
     * 发送字符串消息
     * @param msg 消息数据
     */
    public sendStr(msg: string) {
        this.peer.send(msg);
    }
}