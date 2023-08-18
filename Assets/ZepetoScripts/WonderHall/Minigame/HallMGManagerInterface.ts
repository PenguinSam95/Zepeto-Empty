import { Transform } from "UnityEngine";


export interface HallMGManagerInterface {

    RemoteStart(): void;
    GameReady(): void;
    onGameClear(milisec: number): void;
    Teleport(target: Transform): void;
    onCorrect() : void;
    onBad() : void;
    ExitGame() :void;
    showResult(lastgameTime : number, lastgameCorrect : number, lastgameSuccess : bool ) : void;
    onGameRetry() :void ;
    onGameStop() :void ;


}