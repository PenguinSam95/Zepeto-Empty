import { Collider, GameObject, SpriteRenderer, Transform, WaitForFixedUpdate, WaitForSeconds } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ButtonType, Callback, ERROR, UIList } from '../Managers/TypeManager';
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
    
    /* Accessable Properties */
    @Header("Main properties")
    @SerializeField() private readonly _buttonType: ButtonType = ButtonType.NULL;
    @SerializeField() private readonly _scriptTarget: Transform;
    public get buttonType() { return this._buttonType; }
    public get scriptTarget() { return this._scriptTarget; }


    @Header("UI properties")
    @SerializeField() private readonly _uiType: UIList = UIList.NONE;
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



    /* Trigger */
    public StopLooking(collider: Collider) { this.onTrigger(collider, () => { this.onStop(); }); }
    public StartLooking(collider: Collider) { this.onTrigger(collider, () => { this.onStart(); }); }
    private onTrigger(collider: Collider, callback?: Callback) {
        if(!ZepetoPlayers.instance.LocalPlayer) return console.warn(ERROR.NOT_FOUND_LOCAL_PLAYER);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
        if(collider.gameObject != character) return;

        if(callback != null) callback();
    }



    /* Remote Trigger Action */
    public RemoteStopLooking() {this.onStop(); }
    public RemoteStartLooking() {
        if(!ZepetoPlayers.instance.LocalPlayer) return;
        this.trigger.isInTrigger ? this.onStart() : this.onStop();
    }



    private onStart() {
        if(this.collider) this.collider.enabled = true;
        if(this.renderer) this.renderer.enabled = true;
        this.StopCoroutine(this.LookAtLocalPlayer());
        this.StartCoroutine(this.LookAtLocalPlayer());
    }
    private onStop() {
        if(this.collider) this.collider.enabled = false;
        if(this.renderer) this.renderer.enabled = false;
        this.StopCoroutine(this.LookAtLocalPlayer());
        this.isLooking = false;
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