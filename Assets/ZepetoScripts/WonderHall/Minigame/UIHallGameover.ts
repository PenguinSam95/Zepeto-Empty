import { GameObject } from 'UnityEngine';
import { Button, Toggle } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { mgLog } from '../../CommonUtil/mgLog';
import { HallMGManagerInterface } from './HallMGManagerInterface';
import MinigameJGManager from './MinigameJGManager';
import MinigameNTManager from './MinigameNTManager';

export default class UIHallGameover extends ZepetoScriptBehaviour {

    public toggleNT : Toggle;
    public toggleJG : Toggle;    

    public buttonRetry : Button;
    public buttonStop : Button;    
    public buttonClose : Button;    

    public fullBadge : GameObject;
    public halfBadge : GameObject;

    private _minigameManager: HallMGManagerInterface = null;
    public get minigameManager(): HallMGManagerInterface {
        return this._minigameManager;        
    }

    public set minigameManager(value: HallMGManagerInterface) {
        if( value instanceof MinigameJGManager ) {
            mgLog.log('UIHallGameover set control MinigameJGManager');

        } else if (value instanceof MinigameNTManager){
            mgLog.log('UIHallGameover set control MinigameNTManager');
        }
        this._minigameManager = value;
    }    


    Start() {
        this.buttonRetry?.onClick.AddListener(() => {
            this._minigameManager?.onGameRetry();
            this.gameObject.SetActive(false);
        });

        this.buttonStop?.onClick.AddListener(() => {
            this._minigameManager?.onGameStop();
            this.gameObject.SetActive(false);
        });

        this.buttonClose?.onClick.AddListener(() => {
            this._minigameManager?.onGameStop();
            this.gameObject.SetActive(false);
        });

    }



    public onOpen()
    {
        this.SetValue();
        this.gameObject.SetActive(true);
    }

    
    public SetValue() : void 
    {

        let isSuccessNT = MinigameNTManager.instance.lastgameSuccess;
        let isSuccessJG = MinigameJGManager.instance.lastgameSuccess;

        this.toggleNT.isOn = isSuccessNT;
        this.toggleJG.isOn = isSuccessJG;


        let badgeScore = 0;
        if( isSuccessNT == true) {
            badgeScore += 1;
        }

        if( isSuccessJG == true) {
            badgeScore += 1;
        }

        if( badgeScore == 2 ) {
            this.fullBadge.SetActive(true);
            this.halfBadge.SetActive(false);
        } 
        else if( badgeScore == 1) {
            this.fullBadge.SetActive(false);
            this.halfBadge.SetActive(true);
        }
        else
        {
            this.fullBadge.SetActive(false);
            this.halfBadge.SetActive(false);
        }


    }






}