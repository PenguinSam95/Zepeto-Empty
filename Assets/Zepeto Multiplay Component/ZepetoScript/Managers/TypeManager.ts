import { TextMeshProUGUI } from "TMPro";
import { Animator, BoxCollider, Camera, Coroutine, GameObject, HumanBodyBones, ParticleSystem, Transform, Vector3 } from "UnityEngine";
import { Image, Slider, Text } from "UnityEngine.UI";
import LookAt from "../Sample Code/LookAt";
import TransformSyncHelper from "../Transform/TransformSyncHelper";

export default class TypeManager {
}

/* Server Connect Message */
export enum MESSAGE {

    SyncPlayer = "SyncPlayer",
    ChairSit = "ChairSit",
    ChairSitDown = "ChairSitDown",
    ChairSitUp = "ChairSitUp",
    Equip = "Equip",
    EquipChange = "EquipChange",
    Unequip = "Unequip",
    SyncObjectAnimation = "SyncObjectAnimation",
    LOG = "Log",
    Visible = "Visible",
    Effect = "Effect",
    Pose = "Pose",
}

/* Server Connect Messages Room Datas Name */
export enum SendName {

    // Default
    isSit = "isSit",
    chairId = "chairId",
    gestureName = "gestureName",
    animationParam = "animationParam",
    cliplength = "cliplength",
    playerAdditionalValue = "playerAdditionalValue",
    id = "id",
    Name = "Name",
    Type = "Type",
    Attach = "Attach",
    isPlay = "isPlay",
}

/* Player Speed Datas Name */
export enum PlayerMove {
    additionalWalkSpeed = "additionalWalkSpeed",
    additionalRunSpeed = "additionalRunSpeed",
    additionalJumpPower = "additionalJumpPower",
}

export interface EquipData {
    key: string;
    sessionId: string;
    itemName: string;
    prevItemName: string;
    bone: number;
    prevBone: number;
}

/* State Data */
export enum XXXState {
    NONE = 0,
    Ride_Slide = 20,
    Hold_RightHand_Upper = 51, Hold_RightHand_Side = 52,

    Swim = 70,
    Pose_Chair = 100,
}



//////////////////////////////////////////////// About Game Manager

/* Sprite World Button */
export enum ButtonType {
    NULL = -1,
    UIActivate = 10,
    EquipHead = 21, EquipRightHand = 22, EquipLeftHand = 23, EquipBody = 24,
    
    Pose_Chair = 100,
}

/* Camera Mode Data */
export enum CameraMode {
    FPS, TPS,
}

/* Camera Mode Data */
export enum EffectType {
    NONE = -1,
    Firework = 1,
}

/* Object Animation Sync */
export interface SyncAnim {
    currentProgress:number;
}

/* Camera */
export interface CameraOffset {
    offset: Vector3,
    maxZoomDistance: number,
    minZoomDistance: number,
}


//////////////////////////////////////////////// About UI Manager

/* Loading UI Data */
export enum LoadingType {
    Start = "UI_Loarding_Start",
    Teleport = "UI_Loarding_Teleport",
    NONE = "",
}


//////////////////////////////////////////////// Others

/* Other String Datas Collection */
export enum Datas {
    // Names
    Cake = "Cake",
    Balloon = "Balloon",
    Balloon_A = "Balloon_A",
    Balloon_B = "Balloon_B",
    Balloon_C = "Balloon_C",

    // World Id
    WorldId_Land = "com.kofice.kwonderland",
    WorldId_Stage = "com.kofice.kwonderlandpop",
    WorldId_Studio = "com.kofice.kwonderdrama",
    WorldId_Awards = "com.kofice.kwonderawards",

    // Transform Point
    SpawnPoint = "SpawnPoint",
    TeleportPoint = "TeleportPoint",

    // Layer
    Button = "Button",              // LAYER 6
    Render_Frame = "Render Frame",  // LAYER 7
    Render_Item = "Render Item",    // LAYER 8

    // Game Message
    READY = "READY",
    START = "START!",
    FINISH = "FINISH",
    TIME_UP = "TIMES'S UP!",
    CLEAR = "GAME CLEAR!",
    GAME_OVER = "GAME OVER",
    Successed = "Successed",
    Failed = "Failed",

    // Picture
    FeedMessage = "제페토 인생샷!",

    // others
    Zero = "0",
    One = "1",
    NULL = "null",
    Empty = "",

}

/* Tags */
export enum Tags {
    SpawnPoint = "SpawnPoint", 
    LocalPlayer = "LocalPlayer",
    Player = "Player",
    Trigger = "Trigger", 
    Loading = "Loading", 
}

/* Animation Clip Name Datas */
export enum Anim {
    State = "State",
    MoveState = "MoveState",
    JumpState = "JumpState",
    LandingState = "LandingState",
    MotionSpeed = "MotionSpeed",
    FallSpeed = "FallSpeed",
    Acceleration = "Acceleration",
    MoveProgress = "MoveProgress",

    XXXState = "XXXState",
    
    // General
    Active = "Active",
    isNPC = "isNPC",
}

/* Default ScreenShot Render Result Toast Data */
export enum TOAST_MESSAGE {
    feedUploading = "Uploading...",
    feedCompleted = "Done",
    feedFailed = "Failed",
    screenShotSaveCompleted = "Saved!"
}

/* Default ScreenShot Render Result Layer Data */
export enum LAYER {
    everything = -1,
    nothing = 0,
    UI = 5,

    Button = 6,
    Render_Frame = 7,
    Render_Item = 8,
    Wall = 10,
    NPC = 20,
    Player = 21,
}

export interface Callback {
    (): void;
    (sessionId: string): boolean;
}
export interface CallbackPlayer<T1, T2 = void> {
    (param: T1): T2;
}


export interface PoseData {
    isHasPoint: boolean,
    buttonName: string,
    targetName: string,
    location: Transform,
    lookAt: LookAt,
    buttonObject: GameObject,
}

export interface PhotoZoneData {
    isHasPoint: boolean,
    name: string,
    location: Transform,
    LookAtButton: LookAtButton,
}

export interface LookAtButton {
    lookAt: LookAt,
    buttonObject: GameObject,
}

export enum TriggerType {
    NONE = -1,
    CameraChange_Inside = 100,
    CameraChange_Outside = 101,
    UIActivate_Once = 120,
    UIActivate = 121,
    ObjectActivate = 130,
    ObjectDeactivate = 140,
}

/* LeaderBoard Datas */
export enum RankData {
    /* LeaderBoard Id */
    
    /* Recycle Datas */
    Rank_Start = 1,
    Rank_End = 10,
    Empty = "",
    Zero = "0",
    Empty_Line = "------",
    Zero_Time = "00:00:00",
}

export interface RankUI {
    panel:GameObject,
    rank:number,
    text_Id:TextMeshProUGUI,
    text_Score:TextMeshProUGUI,
    profile:Image,
}

/* Console Error */
export enum ERROR {
    NOT_ENOUGH = "NOT ENOUGH....",
    NOT_MATCHED = "NOT MATCHED....",
    ALREADY_OPENED = "ALREADY OPENED....",
    NOT_FOUND_ITEM = "NOT FOUND ITEM........",
    ITS_FULL_PLAYERS = "IT'S FULL PLAYERS....",
    NOT_SELECTED_TYPE = "NOT SELECTED TYPE....",
    NOT_FOUND_PLAYER = "NOT FOUND PLAYER........",
    ROOM_DISCONNECTION = "ROOM DISCONNECTION......",
    NOT_FOUND_LOCAL_PLAYER = "NOT FOUND LOCAL PLAYER....",
    MINI_GAME_MANAGER_OVERLAPED = "MINI GAME MANAGER OVERLAPED......",
    NOT_FOUND_ZEPETO_ID_FROM_USER_ID = "NOT FOUND ZEPETO ID FROM USER ID........",


    TRANSLATE_NOT_FOUND = "Please, Attached component of text type!",
}



/*** Format ***/
declare global {
    interface Number {
        toMMSS(): string;
    }
}

Number.prototype.toMMSS = function (): string {
    const sec_num: number = this;
    const hours: number = Math.floor(sec_num / 3600);
    let minutes: number | string = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds: number | string = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes} : ${seconds}`;
};