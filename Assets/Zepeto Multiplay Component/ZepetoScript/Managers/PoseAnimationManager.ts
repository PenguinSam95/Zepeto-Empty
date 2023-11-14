import { GameObject } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LookAt from '../Sample Code/LookAt';
import GameManager from './GameManager';
import { ButtonType, Callback, ERROR, PoseData, XXXState } from './TypeManager';
import UIManager from './UIManager';

export default class PoseAnimationManager extends ZepetoScriptBehaviour {

    /* Properties */
    private _localSessionId: string;
    public get localSessionId(): string { return this._localSessionId; }
    private set localSessionId(value: string) { this._localSessionId = value; }
    private poseDatas: PoseData[] = [];


    /* GameManager */
    public RemoteStart(sessionId: string, callback?: Callback) {
        this.localSessionId = sessionId;

        /* Init */
        this.SetInitPoseZone();
        if(callback != null) callback();
    }

    /* Init Pose Zone */
    private SetInitPoseZone() {
        for(let i=0; i<this.transform.childCount; i++) {
            const zone = this.transform.GetChild(i);
            const buttonGroup = zone.GetChild(0);
            
            for(let i=0; i<buttonGroup.childCount; i++) {
                const lookAt = buttonGroup.GetChild(i).GetChild(0).GetComponent<LookAt>();
                const buttonObject = buttonGroup.GetChild(i).gameObject;
                const data:PoseData = {
                    isHasPoint: true,
                    buttonName: buttonObject.name,
                    targetName: lookAt.scriptTarget.name,
                    location: lookAt.scriptTarget.transform,
                    lookAt: lookAt,
                    buttonObject: buttonObject,
                }
                this.poseDatas.push(data);
            }
        }
    }

    /* Pose Room Handler */
    public SwitchPoseData(message:any) {
        this.PlayPose(message.OwnerSessionId, message.Name, message.isPlay, +message.Type);
    }

    /* Pose */
    private PlayPose(sessionId:string, buttonName:string, isPlay:boolean, buttonType:ButtonType) {
        console.log(`[PlayPose] ${sessionId} ${buttonName} ${isPlay} ${ButtonType[buttonType]}`);

        /* Get pose Data */
        const data = this.GetPoseData(buttonName);
        if(!data) return console.error(ERROR.NOT_FOUND_ITEM);

        /* Character Set */
        const character = ZepetoPlayers.instance.GetPlayer(sessionId).character;
        if(isPlay) character.Teleport(data.location.position, data.location.rotation);

        /* Local */
        if(this.localSessionId == sessionId) {
            this.ButtonsVisibler(!isPlay);
            const xxxState = +buttonType as XXXState;
            GameManager.instance.SetXXXState(xxxState, isPlay);
            if(isPlay) this.StartCoroutine(this.OnMoveChecker(buttonName));

        } else {
            this.ButtonVisibler(data.lookAt, data.buttonObject, !isPlay);
        }
    }

    /* Find Pose Data */
    public GetPoseData(buttonName:string) {
        for(const data of this.poseDatas) {
            if(data.buttonName == buttonName) {
                return data;
            }
        }
        return null;
    }

    /* Player Move Check */
    private * OnMoveChecker(buttonName:string, buttonType:ButtonType = ButtonType.NULL) {
        UIManager.instance.MainButtonPanelVisibler(false);
        const character = ZepetoPlayers.instance.GetPlayer(this.localSessionId).character;
        while(true) {
            if(character.tryJump || character.tryMove) break;
            yield null;
        }
        GameManager.instance.PoseAnimationStop(buttonName, buttonType);
        UIManager.instance.MainButtonPanelVisibler(true);
    }

    /* Button Visibler */
    public ButtonVisibler(lookAt:LookAt, button:GameObject, isVisible:boolean) {
        button.SetActive(isVisible);
        isVisible ? lookAt.RemoteStartLooking() : lookAt.RemoteStopLooking();
    }
    public ButtonsVisibler(isVisible:boolean) {
        for(const data of this.poseDatas) {
            this.ButtonVisibler(data.lookAt, data.buttonObject, isVisible);
        }
    }

}