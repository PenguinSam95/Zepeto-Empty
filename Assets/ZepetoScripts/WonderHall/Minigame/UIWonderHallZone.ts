import { GameObject, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
//import { mgLog } from '../mgLog';
import UIHallGameControl from './UIHallGameControl';
import UIHallP1Intro from './uihall_p1_intro';
import UIWonderHallRank from './UIWonderHallRank';
import UIHallGameover from './UIHallGameover';
import UIHallBadgePopup from './UIHallBadgePopup';
import { mgLog } from '../../CommonUtil/mgLog';



export default class UIWonderHallZone extends ZepetoScriptBehaviour {
 
    public uiHallIntro : GameObject;
    public uiHallRank : GameObject;
    public uiGameControlObject : GameObject;
    public uiHallGameoverObject : GameObject;
    public uiHallBadgePopupObject : GameObject;

    private _uiHallP1Intro: UIHallP1Intro;
    private _uiWonderHallRank: UIWonderHallRank;
    private _uiGameControl: UIHallGameControl;
    private _uiHallGameover : UIHallGameover;
    private _uiHallBadgePopup : UIHallBadgePopup;

    public get UIHallP1Intro(): UIHallP1Intro {
        return this._uiHallP1Intro;
    }

    public get UIWonderHallRank(): UIWonderHallRank {
        return this._uiWonderHallRank;
    }

    public get UIGameControl(): UIHallGameControl {
        return this._uiGameControl;
    }

    public get UIHallGameover(): UIHallGameover {
        return this._uiHallGameover;
    }

    public get UIHallBadgePopup(): UIHallBadgePopup {
        return this._uiHallBadgePopup;
    }



    
    private static _instance: UIWonderHallZone = null;
    public static get instance(): UIWonderHallZone {
        if (this._instance === null) {
            this._instance = GameObject.FindObjectOfType<UIWonderHallZone>();
            if (this._instance === null) {
                this._instance = new GameObject(UIWonderHallZone.name).AddComponent<UIWonderHallZone>();
            }
        }
        return this._instance;
    }


    private Awake() {
        if (UIWonderHallZone._instance !== null && UIWonderHallZone._instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            UIWonderHallZone._instance = this;            
        }
    }


    Start() {

        mgLog.log('......UIWonderHallZone start...');
        


        this._uiHallP1Intro = this.uiHallRank?.GetComponent<UIHallP1Intro>();
        this._uiHallP1Intro?.gameObject.SetActive(false);

        this._uiWonderHallRank = this.uiHallRank?.GetComponent<UIWonderHallRank>();
        this._uiWonderHallRank?.gameObject.SetActive(false);

        this._uiGameControl = this.uiGameControlObject?.GetComponent<UIHallGameControl>();
        this._uiGameControl?.gameObject.SetActive(false);

        this._uiHallGameover = this.uiHallGameoverObject?.GetComponent<UIHallGameover>();
        this._uiHallGameover?.gameObject.SetActive(false);

        this._uiHallBadgePopup = this.uiHallBadgePopupObject?.GetComponent<UIHallBadgePopup>();
        this._uiHallBadgePopup?.gameObject.SetActive(false);

        

    }

}



























