import { Collider, GameObject, SpriteRenderer, Transform, WaitForFixedUpdate, WaitForSeconds } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ButtonType, UIList } from '../Managers/TypeManager';
import UIManager from '../Managers/UIManager';
import LookAtTrigger from './LookAtTrigger';
import GameManager from '../Managers/GameManager';

export default class LookAt extends ZepetoScriptBehaviour {

    /* Properties */
    private trigger: LookAtTrigger;
    private renderer: SpriteRenderer;
    private collider: Collider;
    private character: GameObject;
    private isLooking: boolean;
    // private playerCam: Transform;
    // private wait: WaitForFixedUpdate;
    
    /* public Properties */
    @Header("Main properties")
    @SerializeField() private _buttonType: ButtonType = ButtonType.NULL;
    @SerializeField() private _scriptTarget: Transform;
    public get buttonType() { return this._buttonType; }
    public get scriptTarget() { return this._scriptTarget; }


    @Header("UI properties")
    @SerializeField() private _uiType: UIList = UIList.NONE;
    public get uiType() { return this._uiType }


    Start() {
        this.renderer = this.GetComponent<SpriteRenderer>();
        if(this.renderer) this.renderer.enabled = false;

        this.collider = this.GetComponent<Collider>();
        if(this.collider) this.collider.enabled = false;

        this.trigger = this.transform.parent.GetChild(1).GetComponent<LookAtTrigger>();


        /* UI Activator */
        this.SetThisUIType();
    }

    /* UI Active */
    public UIActivate() {
        if(UIManager.instance.openUI) return;
        UIManager.instance.ActivateOpenUI(this.uiType);
    }

    public StartLooking(col : Collider) {
        if(ZepetoPlayers.instance.LocalPlayer == null) return;
            
        this.character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
        if(col.gameObject != this.character) return;
        
        if(this.collider) this.collider.enabled = true;
        if(this.renderer) this.renderer.enabled = true;
        this.StartCoroutine(this.LookAtLocalPlayer());
    }
    
    public StopLooking(col : Collider) {
        if(col.gameObject != this.character) return;

        if(this.renderer) this.renderer.enabled = false;
        if(this.collider) this.collider.enabled = false;
        this.isLooking = false;
        this.StopCoroutine(this.LookAtLocalPlayer());
    }

    public RemoteStartLooking() {
        if(ZepetoPlayers.instance.LocalPlayer == null) return;
        
        if(this.trigger.isInTrigger) {
            if(this.collider) this.collider.enabled = true;
            if(this.renderer) this.renderer.enabled = true;
            this.StopCoroutine(this.LookAtLocalPlayer());
            this.StartCoroutine(this.LookAtLocalPlayer());
            
        } else {
            this.RemoteStopLooking();
        }
    }

    public RemoteStopLooking() {
        if(this.renderer) this.renderer.enabled = false;
        if(this.collider) this.collider.enabled = false;
        this.isLooking = false;
        this.StopCoroutine(this.LookAtLocalPlayer());
    }

    /* Locking Script */
    private * LookAtLocalPlayer() {
        /* Set Init */
        const playerCam = ZepetoPlayers.instance.ZepetoCamera.cameraParent.GetChild(0).transform;
        const wait = GameManager.instance.waitFixedUpdate;

        /* Main Script */
        this.transform.LookAt(playerCam.position);
        this.isLooking = true;
        while(this.isLooking) {
            yield wait;
            this.transform.LookAt(playerCam.position);
        }
    }





    /* UI Activator */
    public SetThisUIType() {
        if(this.uiType > 0) {
            UIManager.instance.UILookAt = this;
        }
    }
}