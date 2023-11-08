import { ArraySchema } from '@colyseus/schema';
import { Animator, GameObject, Mathf, Sprite, Time, Transform, WaitForSeconds } from 'UnityEngine';
import { Button, Image, Slider, Text } from 'UnityEngine.UI';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import SyncIndexManager from '../Common/SyncIndexManager';
import LookAt from '../Sample Code/LookAt';
import GameManager from './GameManager';
import { ERROR, LoadingType, MESSAGE, UIList } from './TypeManager';
import UIActivator from '../UI/UIActivator';

export default class UIManager extends ZepetoScriptBehaviour {

    /* Singleton */
    private static _instance: UIManager = null;
    public static get instance(): UIManager {
        if (this._instance === null) {
            this._instance = GameObject.FindObjectOfType<UIManager>();
            if (this._instance === null) {
                this._instance = new GameObject(UIManager.name).AddComponent<UIManager>();
            }
        }
        return this._instance;
    }


    /* UIManagers Default Properties */
    @Header("UI Manager Field")
    @SerializeField() public canvas: GameObject;
    private isLoading: boolean;
    private fadeAnim: Animator;
    public multiplay: ZepetoWorldMultiplay;
    public room: Room;
    private _openUI: GameObject;
    public get openUI(): GameObject { return this._openUI; }
    public set openUI(value: GameObject) {
        if(!this._openUI) {
            this._openUI = value;
            this._openUI.SetActive(true);
        } else {
            console.error(ERROR.ALREADY_OPENED);
        }
    }


    /* UI Activator Automatic */
    @Header("UI Activators")
    private UILists: UIActivator[] = [];
    private UILookAts: LookAt[] = [];


    @Header("All range")
    @SerializeField() private buttonPanel: Transform;
    @SerializeField() private screenShotModule: GameObject;


    private Awake() {
        if (UIManager._instance !== null && UIManager._instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            UIManager._instance = this;
            GameObject.DontDestroyOnLoad(this.gameObject);
        }
    }

    private Start() {
        if(!this.multiplay)
            this.multiplay = GameObject.FindObjectOfType<ZepetoWorldMultiplay>();
        
        this.multiplay.RoomJoined += (room: Room) => {
            this.room = room;
        }
    }

    /* GameManager */
    public RemoteStart() {
    }











    /**** Activities ****/
    /** UI Activator **/
    public set UIList(value:UIActivator) {
        for(const item of this.UILists) { if(item == value) return; }
        this.UILists.push(value);
    }
    public set UILookAt(value:LookAt) { this.UILookAts.push(value); }
    private GetUIActivator(uiType: UIList) : UIActivator {
        for(const item of this.UILists) {
            if(item.uiType == uiType) return item;
        }
        return null;
    }
    private GetUILookAts(uiType: UIList) : LookAt[] {
        const items = [];
        for(const item of this.UILookAts) {
            if(item.uiType == uiType) items.push(item);
        }
        return items;
    }

    /* LookAt Script Activator */
    private LookAtActivator(lookAt:LookAt, active:boolean = true) {
        const buttonObject = lookAt.transform.parent.gameObject;
        buttonObject.SetActive(active);
        active ? lookAt.RemoteStartLooking() : lookAt.RemoteStopLooking();
    }

    /* UI Activate */
    public ActivateOpenUI(uiType: UIList) {
        const activator = this.GetUIActivator(uiType);
        if(activator) {
            this.openUI = activator.UIObject;

            // LookAt Activate
            for(const lookAt of this.UILookAts) {
                this.LookAtActivator(lookAt, false);
            }
            return true;
        }
        return false; 
    }
    
    /* UI Deactivate */
    public DeactiveOpenUI(uiType: UIList) {
        const activator = this.GetUIActivator(uiType);
        if(this.openUI && this.openUI == activator?.UIObject) {
            this.openUI.SetActive(false);
            this._openUI = null;

            // LookAt Deactivate
            for(const lookAt of this.UILookAts) {
                this.LookAtActivator(lookAt)
            }
            return true;
        }
        return false;
    } 

    /* Forced UI Deactivate */
    public ForcedDeactiveOpenUI(uiType: UIList) {
        const activator = this.GetUIActivator(uiType);
        if(this.openUI && this.openUI == activator?.UIObject) {
            this.openUI.SetActive(false);
            this._openUI = null;

            // LookAt Activate
            for(const lookAt of this.UILookAts) {
                this.LookAtActivator(lookAt, false);
            }
            return true;
        }
        return false;
    } 


    /* Main Button Panel */
    public MainButtonPanelVisibler(isVisible:boolean) {
        this.buttonPanel.gameObject.SetActive(isVisible);
    }

    public ScreenShotModuleVisibler(isVisible:boolean) {
        this.screenShotModule.SetActive(isVisible);
    }







    /** Supporter **/
    /* Get Loading Image Object */ 
    public GetLoadingImage(type:LoadingType): GameObject {
        switch(type.toString()) {
            case LoadingType.Start:
                for(let i=(this.canvas.transform.childCount-1); i>=0; i--) {
                    const ui = this.canvas.transform.GetChild(i);
                    if(ui.name == LoadingType.Start) {
                        return ui.gameObject;
                    }
                }
                return null;

            case LoadingType.Teleport:
                for(let i=(this.canvas.transform.childCount-1); i>=0; i--) {
                    const ui = this.canvas.transform.GetChild(i);
                    if(ui.name == LoadingType.Teleport) {
                        return ui.gameObject;
                    }
                }
                return null;

            default :
                return null;
        }
    }

    /* Get Fade Animator */ 
    public GetFadeAnimator(type:LoadingType) {
        switch(type.toString()) {
            case LoadingType.Start:
                return null;

            case LoadingType.Teleport:
                return null;

            // case LoadingType.Fade_Horror:
            //     if(!this.fadeAnim) {
            //         for(let i=(this.canvas.transform.childCount-1); i>=0; i--) {
            //             const ui = this.canvas.transform.GetChild(i);
            //             if(ui.name == LoadingType.Fade_Horror) {
            //                 this.fadeAnim = ui.GetComponent<Animator>();
            //                 i = -1;
            //             }
            //         }
            //     }
            //     return this.fadeAnim;

            default :
                return null;
        }
    }
}