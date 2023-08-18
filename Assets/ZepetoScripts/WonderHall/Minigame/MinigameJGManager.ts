import { Collider, GameObject, HumanBodyBones, Mathf, Sprite, Time, Transform, Vector3, WaitForFixedUpdate, WaitForSeconds, WaitForEndOfFrame } from 'UnityEngine'
import { Button, Text, Image } from 'UnityEngine.UI';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { HallMGManagerInterface } from './HallMGManagerInterface';
import { RankInfo } from 'ZEPETO.Script.Leaderboard';
import * as UnityEngine from 'UnityEngine';
import UIHallGameControl from './UIHallGameControl';
import UIWonderHallRank from './UIWonderHallRank';
import UIWonderHallZone from './UIWonderHallZone';
import HallRankManager, { LeaderboardID } from './HallRankManager';
import { mgLog } from '../../CommonUtil/mgLog';
import GameManager from '../../../Zepeto Multiplay Component/ZepetoScript/Managers/GameManager';
import { ERROR, MissionType, WonderState, ZoneType } from '../../../Zepeto Multiplay Component/ZepetoScript/Managers/TypeManager';
import UIHallGameover from './UIHallGameover';
import MinigameNTManager from './MinigameNTManager';
import UIHallBadgePopup from './UIHallBadgePopup';
import UIManager from '../../../Zepeto Multiplay Component/ZepetoScript/Managers/UIManager';


// modify from HorrorZoneManager
export default class MinigameJGManager extends ZepetoScriptBehaviour implements HallMGManagerInterface {

    private static _instance: MinigameJGManager = null;
    public static get instance(): MinigameJGManager {
        if (this._instance === null) {
            this._instance = GameObject.FindObjectOfType<MinigameJGManager>();
            if (this._instance === null) {
                this._instance = new GameObject(MinigameJGManager.name).AddComponent<MinigameJGManager>();
            }
        }
        return this._instance;
    }


    //@Header("MinigameJGManager")
    public uicontrol : UIHallGameControl;
    public uirank : UIWonderHallRank;
    public uiHallGameover : UIHallGameover;
    public uiHallBadgePopup : UIHallBadgePopup;
    public minigameCamera : UnityEngine.Camera;


    public animatorProp : UnityEngine.Animator;
    public particleSuccess : UnityEngine.GameObject;
    public particleFail : UnityEngine.GameObject;


    private _lastgameTime : number = 99999;
    private _lastgameCorrect : number = 0;
    private _lastgameSuccess : bool = false;
    public get lastgameSuccess(): bool {
        return this._lastgameSuccess;
    }
    public set lastgameSuccess(value: bool) {
        this._lastgameSuccess = value;
    }

    private _isSuccess: bool = false;
    public get IsSuccess(): bool {
        return this._isSuccess;
    }

    private _isGetBadge: bool = false;
    public get IsGetBadge(): bool {
        return this._isGetBadge;
    }
    public set IsGetBadge(value: bool) {
        this._isGetBadge = value;
    }


    private Awake() {
        if (MinigameJGManager._instance !== null && MinigameJGManager._instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            MinigameJGManager._instance = this;
            GameObject.DontDestroyOnLoad(this.gameObject);
        }
    }


    public RemoteStart() : void  {
        // single play 라 아무것도 안함
        // 씬 로딩후 오브젝트할당후 호출됨
        // 게임시작전 추가사항을 여기 추가하면됨.

        this.particleSuccess.gameObject.SetActive(false);
        this.particleFail.gameObject.SetActive(false);
        this.animatorProp.gameObject.SetActive(false);


        this.uicontrol = UIWonderHallZone.instance.UIGameControl;
        this.uirank = UIWonderHallZone.instance.UIWonderHallRank;
        this.uiHallGameover = UIWonderHallZone.instance.UIHallGameover;
        this.uiHallBadgePopup = UIWonderHallZone.instance.UIHallBadgePopup;
        
    }


    public onPostMove()
    {
        mgLog.log('MinigameJGManager PostMove  ');        

        this.onEnterSetUI( true );

        this.uicontrol.gameObject.SetActive(true);
        this.uicontrol.minigameManager =  this;
        this.uirank.minigameManager = this;
        this.uiHallGameover.minigameManager = this;

    }


    public GameReady() : void {        
        mgLog.log('MinigameJGManager GameReady  ');        

        // this.onEnterSetUI( true );

        // this.uicontrol.gameObject.SetActive(true);
        // this.uicontrol.minigameManager =  this;
        // this.uirank.minigameManager = this;
        // this.uiHallGameover.minigameManager = this;


        //GameManager.instance.LocalPlayerControllerSet(false);
        
        //this.uicontrol.GameStart();
        this.uicontrol.GameReady();

    }

    onEnterSetUI( isEnter : bool)
    {
        if( isEnter ) {
            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(false);
            this.minigameCamera.gameObject.SetActive(true);
    
            UIManager.instance.MainButtonPanelVisibler(false);
            UIManager.instance.ScreenShotModuleVisibler(false);
            GameManager.instance.LocalPlayerControllerSet(false);
            //GameManager.instance.SetWonderState(WonderState.H_Attack, true);    
        }
        else
        {
            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(true);
            this.minigameCamera.gameObject.SetActive(false);
    
            UIManager.instance.MainButtonPanelVisibler(true);
            UIManager.instance.ScreenShotModuleVisibler(true);
            GameManager.instance.LocalPlayerControllerSet(true);
            //GameManager.instance.SetWonderState(WonderState.H_Attack, false);
        }
    }


    /* Teleport */
    public Teleport(target:Transform) {
        if(!ZepetoPlayers.instance.LocalPlayer) return console.error(ERROR.NOT_FOUND_LOCAL_PLAYER);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        character.Teleport(target.position, target.rotation);
    }

    public onGameClear(resultMs : number ) : void 
    {
        mgLog.log(`MinigameJGManager onResult = ${resultMs}`);
        HallRankManager.SetScore( resultMs, LeaderboardID.LeaderboardID_JG, (rank) => {
            this.onResultRank(rank);
        } );
    }

    public showResult(lastgameTime : number, lastgameCorrect : number, lastgameSuccess : bool ) : void
    {
        this._lastgameTime = lastgameTime;
        this._lastgameCorrect = lastgameCorrect;    
        this._lastgameSuccess = lastgameSuccess;

        if (this._lastgameSuccess == true) {
            this._isSuccess = true;
            GameManager.instance.MissionClear(MissionType.JG);
        }

        //WILL : 뱃지확인후...
        if (this._isGetBadge == true) {
            this.uiHallGameover.onOpen();
        }
        else {
            if (MinigameJGManager.instance.IsSuccess == true &&
                MinigameNTManager.instance.IsSuccess == true) {

                MinigameJGManager.instance.IsGetBadge = true;
                MinigameNTManager.instance.IsGetBadge = true;
                GameManager.instance.AddBadge();
    

                this.uiHallBadgePopup.onShow(() => {
                    this.onGameStop();
                });
            }
            else {
                this.uiHallGameover.onOpen();
            }
        }

    }

    public ResultWindow() : void
    {
        //this.uiHallGameover.SetValue( MinigameNTManager.instance.lastgameSuccess, MinigameJGManager.instance.lastgameSuccess );
        
    }



    //export type CallbackResultRank = ( rankInfo : RankInfo | null ) => void;

    onResultRank(rankInfo : RankInfo | null) :void
    {
        this.uicontrol.gameObject.SetActive(false);

        if( rankInfo == null) {
            mgLog.error('leaderboard error');
            return;
        }

        // mgLog.log(`this.uirank == null --> ${this.uirank == null}`);
        // mgLog.log(`this.uirank = ${this.uirank}`);
        this.uirank.onResultRank(rankInfo);
        this.uirank.gameObject.SetActive(true);
    }


    public onCorrect() : void
    {
        mgLog.log( "MinigameJGManager onCorrect");
        //GameManager.instance.SetWonderState(WonderState.H_Attack, true);    
        //ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator.SetBool("isSit", true);

        //GameManager.instance.SetWonderState(WonderState.HM_JG, true);    
        this.StartCoroutine(this.AnimateChange( WonderState.HM_JG, 1.0));
        this.StartCoroutine(this.AnimateProp(true, 1.5, 0.5 ));
        this.StartCoroutine(this.AnimateParticle(true, 1.6)) ;
        //this.StartCoroutine(this.AnimateParticle(false, 1.6, 0.5)) ;
        this.StartCoroutine(this.AnimateBoomParticle(1.6, 0.5)) ;
        
    }

    public onBad() : void
    {
        mgLog.log("MinigameJGManager onBad");
        //GameManager.instance.SetWonderState(WonderState.HM_JG, true);
        this.StartCoroutine(this.AnimateChange( WonderState.HM_JG, 1.0));

        this.StartCoroutine(this.AnimateProp(false, 1.8, 0.5 ));
        //this.StartCoroutine(this.AnimateParticle(false));

    }



    public ExitGame() {

        if(ZepetoPlayers.instance.LocalPlayer == null) return;
        GameManager.instance.SendTeleportZone(ZoneType.WonderHallZone_VR);

        this.onEnterSetUI( false );
    }

    *AnimateParticle( isSuccess : bool,  duration : float  = 1.0, delay : float = 0 )
    {
        yield new WaitForSeconds( delay );        
        
        isSuccess ? this.particleSuccess.gameObject.SetActive(true) : this.particleFail.gameObject.SetActive(true);
        
        yield new WaitForSeconds( duration );

        isSuccess ? this.particleSuccess.gameObject.SetActive(false) : this.particleFail.gameObject.SetActive(false);
        
    }

    *AnimateBoomParticle( duration : float  = 1.0, delay : float = 0 )
    {
        yield new WaitForSeconds( delay );        
        
        this.particleFail.gameObject.SetActive(true);
        
        yield new WaitForSeconds( duration );

        this.particleFail.gameObject.SetActive(false);
        
    }



    *AnimateChange( wonderState : WonderState, duration : float  = 1.0 )
    {
        GameManager.instance.SetWonderState(wonderState, true);    
        yield new WaitForSeconds( duration);
        GameManager.instance.SetWonderState(wonderState, false);
    }

    *AnimateProp( isSuccess : bool,  duration : float  = 1.0, delay : float = 0 )
    {
        yield new WaitForSeconds( delay );        
        this.animatorProp.gameObject.SetActive(true);
        this.animatorProp.SetInteger("JGState", isSuccess ? 200 : 300);
        
        yield new WaitForSeconds( duration );
        this.animatorProp.SetInteger("JGState", 0);
        this.animatorProp.gameObject.SetActive(false);
    }



    public onGameRetry() :void {
        this.uicontrol.GameReady();
    }


    public onGameStop() :void {
        this.onGameClear( this._lastgameTime );
    }




}
