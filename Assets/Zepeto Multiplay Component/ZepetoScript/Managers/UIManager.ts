import { ArraySchema } from '@colyseus/schema';
import { Animator, GameObject, Mathf, Sprite, Time, Transform, WaitForSeconds } from 'UnityEngine';
import { Button, Image, Slider, Text } from 'UnityEngine.UI';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import SyncIndexManager from '../Common/SyncIndexManager';
import LookAt from '../Sample Code/LookAt';
import GameManager from './GameManager';
import { ERROR, LoadingType, MESSAGE } from './TypeManager';

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
            this.onChangeOpenUI(value);
        } else {
            console.error(ERROR.ALREADY_OPENED);
        }
    }

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
    /* Check Opened UI */
    public DeactiveOpenUI(ui:GameObject) {
        if(this.openUI) this.openUI.SetActive(false);
        if(ui) ui.SetActive(false);
        if(this.openUI == ui) {
            this._openUI = null;
            return true;
        }
        return false;
    } 

    /* Check Opened UI */
    public DeactiveOpenUI_Target(ui:GameObject) {
        if(this.openUI && this.openUI == ui) {
            ui.SetActive(false);
            this._openUI = null;
            return true;
        }
        return false;
    } 
    
    /* Check Opened UI and ButtonObject Reset */
    public DeactiveOpenUI_Buttons(ui:GameObject, ...buttons:LookAt[]) {
        const result = this.DeactiveOpenUI(ui);
        if(result) {
            for(const button of buttons) {
                const buttonObject = button.transform.parent.gameObject;
                buttonObject.SetActive(true);
                button.RemoteStartLooking();
            }
            return true;
        }
        return false;
    }
    
    /* Check Opened UI and ButtonObject Reset */
    public DeactiveOpenUI_ButtonArray(ui:GameObject, buttons:LookAt[]) {
        const result = this.DeactiveOpenUI(ui);
        if(result) {
            for(const button of buttons) {
                const buttonObject = button.transform.parent.gameObject;
                buttonObject.SetActive(true);
                button.RemoteStartLooking();
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
    
    private onChangeOpenUI(openUI:GameObject) {
        this._openUI = openUI;
        this._openUI.SetActive(true);
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