import { Camera, Coroutine, GameObject, HumanBodyBones, Mathf, MeshRenderer, Quaternion, Random, Time, Transform, Vector3, WaitForFixedUpdate, WaitForSeconds } from 'UnityEngine';
import { UIZepetoPlayerControl, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { Player } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { UserIdInfoUsers, WorldService, ZepetoWorldMultiplay } from 'ZEPETO.World';
import SyncIndexManager from '../Common/SyncIndexManager';
import DOTWeenSyncHelper from '../DOTween/DOTWeenSyncHelper';
import LookAt from '../Sample Code/LookAt';
import AnimatorSyncHelper from '../Transform/AnimatorSyncHelper';
import TransformSyncHelper from '../Transform/TransformSyncHelper';
import PoseAnimationManager from './PoseAnimationManager';
import ToastManager from './ToastManager';
import { Anim, ButtonType, Callback, CameraOffset, Datas, ERROR, LoadingType, MESSAGE, SendName, TOAST_MESSAGE, XXXState } from './TypeManager';
import { LanguageType } from '../Lang/TranslateManager';
import UIManager from './UIManager';

export default class GameManager extends ZepetoScriptBehaviour {
    
    /* Singleton */
    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        if (this._instance === null) {
            this._instance = GameObject.FindObjectOfType<GameManager>();
            if (this._instance === null) {
                this._instance = new GameObject(GameManager.name).AddComponent<GameManager>();
            }
        }
        return this._instance;
    }


    /* GameManagers Default Properties */
    @Header("GameManager")
    public multiplay: ZepetoWorldMultiplay;
    public room: Room;
    private animatorSyncHelpers: AnimatorSyncHelper[] = [];
    private transformSyncs: TransformSyncHelper[] = [];
    private doTWeenSyncs: DOTWeenSyncHelper[] = [];
    private player: Player;
    private joyCon: UIZepetoPlayerControl;
    private wait: WaitForSeconds = new WaitForSeconds(1);
    private waitFixed: WaitForFixedUpdate = new WaitForFixedUpdate();
    public get waitOneSec() : WaitForSeconds { return this.wait }
    public get waitFixedUpdate() : WaitForFixedUpdate { return this.waitFixed }

    private isOutDoor: boolean = true;
    private isCamTransition: boolean = false;
    private CamTransition: Coroutine;
    private cameraOffset_Indoor: CameraOffset;
    private cameraOffset_Outdoor: CameraOffset;

    
    /* Mangager Field */
    @Header("Other Managers")
    @SerializeField() private _poseAnimationManager: Transform;
    private poseAnimationManager: PoseAnimationManager;
    private toastManager: ToastManager;

    
    @Header("** Developer **")
    @SerializeField() private _editLanguage: boolean = false;
    @SerializeField() private _editLanguageType: LanguageType = LanguageType.None;
    public get editLanguage() : boolean { return this._editLanguage; }
    public get editLanguageType() : LanguageType { return this._editLanguageType; }



    /*** Main Script ***/
    private Awake() {
        if (GameManager._instance !== null && GameManager._instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            GameManager._instance = this;
            GameObject.DontDestroyOnLoad(this.gameObject);
        }
    }

    Start() {
        if(!this.multiplay)
            this.multiplay = GameObject.FindObjectOfType<ZepetoWorldMultiplay>();
        
        this.multiplay.RoomJoined += (room: Room) => {
            this.room = room;
            
            /** PoseAnimation **/
            this.room.AddMessageHandler(MESSAGE.Pose, (message:any) => {
                this.poseAnimationManager.SwitchPoseData(message);
            });
        }

        this.StartCoroutine(this.StartLoading());
        
        /* Remote Start */
        this.toastManager = this.transform.GetComponentInChildren<ToastManager>();
        this.toastManager.RemoteStart();


        this.transformSyncs = GameObject.FindObjectsOfType<TransformSyncHelper>();
        this.transformSyncs.sort();
        for(const trans of this.transformSyncs) {
            SyncIndexManager.SyncIndex++;
            trans.RemoteStart(SyncIndexManager.SyncIndex.toString());
        }
        console.log(`[GameManager] TransformSyncHelper connected`);

        this.doTWeenSyncs = GameObject.FindObjectsOfType<DOTWeenSyncHelper>();
        this.doTWeenSyncs.sort();
        for(const dot of this.doTWeenSyncs) {
            SyncIndexManager.SyncIndex++;
            dot.RemoteStart(SyncIndexManager.SyncIndex.toString());
        }
        console.log(`[GameManager] DOTWeenSyncHelper connected`);
        
        /* Managers */
        // const effectPanelManager = this._effectPanelManager?.GetComponent<EffectPanelManager>();
        // if(effectPanelManager) this.effectPanelManager = effectPanelManager;
        // else this.effectPanelManager = GameObject.FindObjectOfType<EffectPanelManager>();
        // this._effectPanelManager = null;
        // this.effectPanelManager.RemoteStart();
        // console.log(`[GameManager] EffectPanelManager loaded success`);
    }

    /* Start Loading */
    private * StartLoading() {
        const loadingUI = UIManager.instance.GetLoadingImage(LoadingType.Start);
        if(!loadingUI) return;
        let isLoading = true;
        loadingUI.SetActive(true);
        ZepetoPlayers.instance.controllerData.inputAsset.Disable();
        const wait = new WaitForSeconds(2);

        /* Manager Remote Start */
        while (isLoading) {
            yield wait;
            if (this.room != null && this.room.IsConnected) {
                if (ZepetoPlayers.instance.HasPlayer(this.room.SessionId)) {
                    
                    /* Remote Start */
                    UIManager.instance.RemoteStart();
                    console.log(`[GameManager] UIManager loaded success`);

                    const poseAnimationManager = this._poseAnimationManager?.GetComponent<PoseAnimationManager>();
                    if(poseAnimationManager) this.poseAnimationManager = poseAnimationManager;
                    else this.poseAnimationManager = GameObject.FindObjectOfType<PoseAnimationManager>();
                    this._poseAnimationManager = null;
                    this.poseAnimationManager.RemoteStart(this.room.SessionId);
                    console.log(`[GameManager] PoseAnimationManager loaded success`);

                    /* Stop Loading */
                    isLoading = false;
                    loadingUI.SetActive(false);
                    ZepetoPlayers.instance.controllerData.inputAsset.Enable();
                    this.StopCoroutine(this.StartLoading());
                    break;
                }
            }
        }
    }

    /* Raycast Button Start */
    SwitchButtonScript(btn : Transform) {
        let lookAt = btn.GetComponentInChildren<LookAt>();
        if(!lookAt) {
            lookAt = btn.GetComponentInParent<LookAt>();
            console.log(lookAt, lookAt==null);
            if(!lookAt) return;
        }
        const buttonObject = lookAt.transform.parent;
        const buttonType = lookAt.buttonType;
        const target = lookAt.scriptTarget;
        const data = new RoomData();
        switch (+buttonType){
            case ButtonType.UIActivate:
                lookAt.RemoteStopLooking();
                lookAt.UIActivate();
                break;


            case ButtonType.Pose_Chair:
            // case ButtonType.Pose_Camera:
            // case ButtonType.Pose_Camera:
            // case ButtonType.Pose_Camera:
            // case ButtonType.Pose_Camera:
            // case ButtonType.Pose_Camera:
                data.Add(SendName.Name, buttonObject.name);
                data.Add(SendName.Type, +buttonType);
                data.Add(SendName.isPlay, true);
                this.room.Send(MESSAGE.Pose, data.GetObject());
                break;
        

            default :
                console.error(`${ERROR.NOT_SELECTED_TYPE} : ${btn.name} - ${ButtonType[buttonType]}`)
                break;
        }
    }

    /* Player Data Update */
    public PlayerDataUpdate() {
    }
    

















    /** Player **/
    /* Get Local Player */
    public SetLocalPlayer(player:Player) {
        this.player = player;
    }

    /* Character Shadow Visibler */
    public CharacterShadowVisibler(sessionId:string, visible:boolean) {
        const character = ZepetoPlayers.instance.GetPlayer(sessionId).character.transform;
        const shadow = character.GetChild(0).GetChild(2);
        shadow.gameObject.SetActive(visible);
    }

    /* Local Player Controller Set */
    public LocalPlayerControllerSet(isEnable:boolean, isJoyConAlso:boolean = true) {
        if(!this.joyCon) this.joyCon = ZepetoPlayers.instance.gameObject.GetComponentInChildren<UIZepetoPlayerControl>();
        
        /* Controller OFF */
        if(isEnable) {
            if(isJoyConAlso) this.joyCon.gameObject.SetActive(true);
            ZepetoPlayers.instance.controllerData.inputAsset.Enable();

        } else {
            if(isJoyConAlso) this.joyCon.gameObject.SetActive(false);
            ZepetoPlayers.instance.controllerData.inputAsset.Disable();
        }
    }



    /** Camera **/
    /* Camera Activator */
    public MainCamera(active:boolean) {
        const cam = ZepetoPlayers.instance.ZepetoCamera.camera;
        cam.targetDisplay = active ? 0 : 1;
    }

    /* Change Camera Outdoor */
    public ChangeCamOutdoor(isOutDoor:boolean, isTransition:boolean = false) {

        /* Get Camera Data */
        this.InitOffset();

        /* In Door 1~3 */
        /* OutDoor 3~8 [Default] */
        this.isOutDoor = isOutDoor;
        
        /* Transition */
        if(isTransition) {
            if(this.isCamTransition) return;
            if(this.CamTransition) this.StopCoroutine(this.CamTransition);
            this.CamTransition = this.StartCoroutine(this.TransitionCamOutDoor());
            return;
        }

        /* Default */
        const cam = ZepetoPlayers.instance.cameraData;
        const offset = isOutDoor ? this.cameraOffset_Outdoor : this.cameraOffset_Indoor;
        cam.offset = offset.offset;
        cam.maxZoomDistance = offset.maxZoomDistance;
        cam.minZoomDistance = offset.minZoomDistance;
    }

    /* Camera Transition */
    private * TransitionCamOutDoor() {
        if(this.isCamTransition) return;
        this.isCamTransition = true;

        /* Get Camera Data */
        const cam = ZepetoPlayers.instance.cameraData;

        while(true) {
            yield null;
            
            // Lerp
            const targetOffset = this.isOutDoor ? this.cameraOffset_Outdoor : this.cameraOffset_Indoor;
            cam.offset = Vector3.Lerp(cam.offset, targetOffset.offset, Time.deltaTime *2);
            cam.maxZoomDistance = Mathf.Lerp(cam.maxZoomDistance, targetOffset.maxZoomDistance, Time.deltaTime *2);
            cam.minZoomDistance = Mathf.Lerp(cam.minZoomDistance, targetOffset.minZoomDistance, Time.deltaTime *2);

            // Distance
            const point1 = Vector3.Distance(cam.offset, targetOffset.offset);
            const point2 = Mathf.Abs(cam.maxZoomDistance - targetOffset.maxZoomDistance);
            const point3 = Mathf.Abs(cam.minZoomDistance - targetOffset.minZoomDistance);
            const line = 0.00001;

            // Stop
            if(point1 < line && point2 < line && point3 < line) {
                cam.offset = targetOffset.offset;
                cam.maxZoomDistance = targetOffset.maxZoomDistance;
                cam.minZoomDistance = targetOffset.minZoomDistance;
                break;
            }
        }
        this.isCamTransition = false;
    }

    private InitOffset() {
        if(this.cameraOffset_Indoor) return;
        if(this.cameraOffset_Outdoor) return;

        const inOffset = Vector3.zero;
        const outOffset = Vector3.up;
        outOffset.y = 0.5;
        /* Set Init Data */
        this.cameraOffset_Indoor = {
            offset: inOffset,
            maxZoomDistance: 2,
            minZoomDistance: 0.3,
        }
        this.cameraOffset_Outdoor = {
            offset: outOffset,
            maxZoomDistance: 8,
            minZoomDistance: 3,
        }
    }



    /** Local Player Animation **/
    /* Local Player State */
    public SetXXXState(xxxState:XXXState, isPlay:boolean) {
        const animator = ZepetoPlayers.instance.GetPlayer(this.room.SessionId).character.ZepetoAnimator;
        const prevXXXState = animator.GetInteger(Anim.XXXState);

        console.log(`${XXXState[xxxState]}, ${isPlay}`);

        /* Animation Play */
        this.PlayAnimation(xxxState, isPlay);
    }

    /* Local Player Animation */
    private PlayAnimation(xxxState:XXXState, isPlay:boolean) {
        const animator = ZepetoPlayers.instance.GetPlayer(this.room.SessionId).character.ZepetoAnimator;
        
        /* Play Local Animaion */
        if(isPlay)  animator.SetInteger(Anim.XXXState, xxxState);
        else        animator.SetInteger(Anim.XXXState, XXXState.NONE);
    }

    /* Stop Local Animation */
    public PoseAnimationStop(name:string, buttonType:ButtonType) {
        const data = new RoomData();
        data.Add(SendName.Name, name);
        data.Add(SendName.Type, buttonType);
        data.Add(SendName.isPlay, false);
        this.room.Send(MESSAGE.Pose, data.GetObject());
    }

    /* Get Local Player XXX State */
    public get XXXState() {
        const animator = ZepetoPlayers.instance.GetPlayer(this.room.SessionId).character.ZepetoAnimator;
        const currentState = animator.GetInteger(Anim.XXXState);
        return currentState as XXXState;
    }

    /* Unequip Pick Item */
    private Unequip(bone:HumanBodyBones, itemName:string) {
        const data = new RoomData();
        data.Add(SendName.Name, itemName);
        data.Add(SendName.Attach, bone);
        this.room.Send(MESSAGE.Unequip, data.GetObject());
    }

    /* Show Text */
    public Toast(text:string) { this.toastManager.Toast(text); }
    public TextAnimate(text:string, tic?:number, callback?:Callback) { this.toastManager.TextAnimate(text, tic, callback); }
    public TextAnimationOFF() { this.toastManager.TextAnimationOFF(); }
    public TextAnimate_OneSec(text:string, callback?:Callback) { this.toastManager.TextAnimate_OneSec(text, callback); }
    public TextAnimationOFF_OneSec() { this.toastManager.TextAnimationOFF_OneSec(); }
}