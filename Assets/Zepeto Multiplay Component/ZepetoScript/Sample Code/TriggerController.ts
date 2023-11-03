import { Collider, Transform } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from '../Managers/GameManager';
import { ERROR, Tags, TriggerType } from '../Managers/TypeManager';
import UIManager from '../Managers/UIManager';

export default class TriggerController extends ZepetoScriptBehaviour {

    /* Properties */
    @SerializeField() private _triggerType: TriggerType = TriggerType.NONE;
    @SerializeField() private _scriptTarget: Transform;
    public get triggerType() { return this._triggerType; }
    public get scriptTarget() { return this._scriptTarget; }
    private isUIActivate_Once: boolean = false;


    /* Touch Collider */
    OnTriggerEnter(collider: Collider) {
        if(this.Trigger(collider)) this.SwitchingTriggerEnter();
    }
    OnTriggerExit(collider: Collider) {
        if(this.Trigger(collider)) this.SwitchingTriggerExit();
    }
    private Trigger(collider: Collider) {
        if(!ZepetoPlayers.instance.LocalPlayer) { console.warn(ERROR.NOT_FOUND_LOCAL_PLAYER); return false; }
        if(collider.CompareTag(Tags.LocalPlayer) || collider.CompareTag(Tags.Trigger)) { return true }
    }

    /* Enter */
    private SwitchingTriggerEnter() {
        switch(+this.triggerType) {
            case TriggerType.CameraChange_Inside :
            case TriggerType.CameraChange_Outside :
                break;
                
            case TriggerType.UIActivate_Once :
                if(this.isUIActivate_Once) return;
                this.isUIActivate_Once = this.UIActivate();
                break;

            case TriggerType.UIActivate :
                this.UIActivate();
                break;

            case TriggerType.ObjectActivate :
                this.scriptTarget.gameObject.SetActive(true);
                break;

            case TriggerType.ObjectDeactivate :
                this.scriptTarget.gameObject.SetActive(false);
                break;
        }
    }

    /* Exit */
    private SwitchingTriggerExit() {
        switch(+this.triggerType) {
            case TriggerType.CameraChange_Inside :
                GameManager.instance.ChangeCamOutdoor(false, true);
                break;

            case TriggerType.CameraChange_Outside :
                GameManager.instance.ChangeCamOutdoor(true, true);
                break;
                
            case TriggerType.UIActivate_Once :
                break;

            case TriggerType.UIActivate :
                this.UIDeactivate();
                break;

            case TriggerType.ObjectActivate :
                this.scriptTarget.gameObject.SetActive(false);
                break;

            case TriggerType.ObjectDeactivate :
                break;
        }
    }
    

    /* UI Active */
    private UIActivate() {
        if(UIManager.instance.openUI) return false;
        UIManager.instance.openUI = this.scriptTarget.gameObject;
        return true;
        
    }
    
    private UIDeactivate() {
        UIManager.instance.DeactiveOpenUI_Target(this.scriptTarget.gameObject);
    }
}