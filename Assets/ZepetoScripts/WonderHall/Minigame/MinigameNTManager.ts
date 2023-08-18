import { Collider, GameObject, HumanBodyBones, Mathf, Sprite, Time, Transform, Vector3, WaitForFixedUpdate, WaitForSeconds, WaitForEndOfFrame, WaitWhile } from 'UnityEngine'

import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { HallMGManagerInterface } from './HallMGManagerInterface';
import { RankInfo } from 'ZEPETO.Script.Leaderboard';
import * as UnityEngine from 'UnityEngine';
import UIHallGameControl from './UIHallGameControl';
import UIWonderHallRank from './UIWonderHallRank';
import UIWonderHallZone from './UIWonderHallZone';
import { mgLog } from '../../CommonUtil/mgLog';
import GameManager from '../../../Zepeto Multiplay Component/ZepetoScript/Managers/GameManager';
import { Anim, ERROR, MissionType, WonderState, ZoneType } from '../../../Zepeto Multiplay Component/ZepetoScript/Managers/TypeManager';
import HallRankManager, { LeaderboardID } from './HallRankManager';
import UIHallGameover from './UIHallGameover';
import MinigameJGManager from './MinigameJGManager';
import UIHallBadgePopup from './UIHallBadgePopup';
import UIManager from '../../../Zepeto Multiplay Component/ZepetoScript/Managers/UIManager';


// modify from HorrorZoneManager
export default class MinigameNTManager extends ZepetoScriptBehaviour implements HallMGManagerInterface {

    private static _instance: MinigameNTManager = null;
    public static get instance(): MinigameNTManager {
        if (this._instance === null) {
            this._instance = GameObject.FindObjectOfType<MinigameNTManager>();
            if (this._instance === null) {
                this._instance = new GameObject(MinigameNTManager.name).AddComponent<MinigameNTManager>();
            }
        }
        return this._instance;
    }

    //@Header("MinigameNTManager")
    public uicontrol : UIHallGameControl;
    public uirank : UIWonderHallRank;
    public uiHallGameover : UIHallGameover;
    public uiHallBadgePopup : UIHallBadgePopup;
    public minigameCamera : UnityEngine.Camera;

    public animatorProp : UnityEngine.Animator;
    public particleLeft : UnityEngine.GameObject;
    public particleRight : UnityEngine.GameObject;

    public animLeftCollider: UnityEngine.Animation;
    public animRightCollider: UnityEngine.Animation;



    private _lastgameTime : number = 99999;
    private _lastgameCorrect : number = 0;
    private _lastgameSuccess: bool = false;
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
    


    private _npcOppo: ZepetoCharacter = null;
    public get npcOppo(): ZepetoCharacter
    {
        return this._npcOppo;
    }

    public set npcOppo(value: ZepetoCharacter) {
        this._npcOppo = value;
    }

    private Awake() {
        if (MinigameNTManager._instance !== null && MinigameNTManager._instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            MinigameNTManager._instance = this;
            GameObject.DontDestroyOnLoad(this.gameObject);
        }
    }

    public RemoteStart() : void  {
        // single play 라 아무것도 안함
        // 씬 로딩후 오브젝트할당후 호출됨
        // 게임시작전 추가사항을 여기 추가하면됨.
        this.particleLeft.gameObject.SetActive(false);
        this.particleRight.gameObject.SetActive(false);


        this.uicontrol = UIWonderHallZone.instance.UIGameControl;
        this.uirank = UIWonderHallZone.instance.UIWonderHallRank;
        this.uiHallGameover = UIWonderHallZone.instance.UIHallGameover;
        this.uiHallBadgePopup = UIWonderHallZone.instance.UIHallBadgePopup;        
        
    }

    public onPostMove()
    {
        mgLog.log('MinigameNTManager PostMove  ');        

        this.onEnterSetUI( true );

        this.uicontrol.gameObject.SetActive(true);
        this.uicontrol.minigameManager =  this;
        this.uirank.minigameManager = this;
        this.uiHallGameover.minigameManager = this;
    }


    public GameReady() : void {        

        mgLog.log('MinigameNTManager GameReady  ');        


        //GameManager.instance.LocalPlayerControllerSet(false);
        //this.uicontrol.GameStart();
        this.uicontrol.GameReady();
    }

    onEnterSetUI( isEnter : bool)
    {
        if( isEnter ) {
            mgLog.log('MinigameNTManager onEnterSetUI enter');        

            //ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.GetComponent<AudioListener>().enabled = false;            
            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(false);
            this.minigameCamera.gameObject.SetActive(true);
    
            UIManager.instance.MainButtonPanelVisibler(false);
            UIManager.instance.ScreenShotModuleVisibler(false);
            GameManager.instance.LocalPlayerControllerSet(false);
            //MinigameNTManager.instance.SetWonderState(WonderState.H_Attack, true);    
        }
        else
        {
            mgLog.log('MinigameNTManager onEnterSetUI leave');        

            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(true);
            this.minigameCamera.gameObject.SetActive(false);
    
            UIManager.instance.MainButtonPanelVisibler(true);
            UIManager.instance.ScreenShotModuleVisibler(true);
            GameManager.instance.LocalPlayerControllerSet(true);
            //MinigameNTManager.instance.SetWonderState(WonderState.H_Attack, false);        
        }
    }

    /* Teleport */
    public Teleport(target:Transform) {
        if(!ZepetoPlayers.instance.LocalPlayer) return console.error(ERROR.NOT_FOUND_LOCAL_PLAYER);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        character.Teleport(target.position, target.rotation);
    }

    // 스코어 윈도우
    public onGameClear(resultMs : number ) : void 
    {
        mgLog.log(`MinigameNTManager onResult = ${resultMs}`);
        HallRankManager.SetScore( resultMs, LeaderboardID.LeaderboardID_NT, (rank) => {
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
            GameManager.instance.MissionClear(MissionType.NT);
        }

        //WILL : 뱃지확인후...
        if( this.IsGetBadge == true ) {
            this.uiHallGameover.onOpen();
        } 
        else
        {
            if (MinigameJGManager.instance.IsSuccess == true &&
                MinigameNTManager.instance.IsSuccess == true) {

                MinigameJGManager.instance.IsGetBadge = true;
                MinigameNTManager.instance.IsGetBadge = true;
                GameManager.instance.AddBadge();

                this.uiHallBadgePopup.onShow( () => {
                    this.onGameStop();
                });
            }
            else {
                this.uiHallGameover.onOpen();
            }
    
        }

    }

    

    onResultRank(rankInfo : RankInfo | null) :void
    {
        this.uicontrol.gameObject.SetActive(false);

        if( rankInfo == null) {
            mgLog.error('leaderboard error');
            return;
        }

        this.uirank.onResultRank(rankInfo);
        this.uirank.gameObject.SetActive(true);
    }


    public onCorrect() : void
    {
        mgLog.log( "MinigameNTManager onCorrect");
        //MinigameNTManager.instance.SetWonderState(WonderState.H_Attack, true);    
        //ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator.SetBool("isSit", true);

        //GameManager.instance.SetWonderState(WonderState.HM_hurray, true);    

        this.StartCoroutine(this.AnimateCorrect());
    }

    public onBad() : void
    {
        mgLog.log("MinigameNTManager onBad");
        //MinigameNTManager.instance.SetWonderState(WonderState.H_Damaged, true);
        //GameManager.instance.SetWonderState(WonderState.HM_NT, true);
        this.StartCoroutine(this.AnimateIncorrect());
    }


    public ExitGame() {

        if(ZepetoPlayers.instance.LocalPlayer == null) return;
        GameManager.instance.SendTeleportZone(ZoneType.WonderHallZone_VR);
        this.onEnterSetUI( false );
    }

    *AnimateCorrect()
    {
        this.StartCoroutine(this.AnimateProp( 1.0, 0));
        this.StartCoroutine(this.AnimateCollider());
        //yield this.StartCoroutine(this.NPCAnimateChange( WonderState.HM_NT, 1.0, 0 ));

        this.StartCoroutine( this.AnimateLeftParticle());
        this.StartCoroutine( this.AnimateRightParticle());



        this.StartCoroutine(this.NPCAnimateChange( WonderState.HM_NT, 1.0, 0 ));
        yield this.StartCoroutine(this.AnimateChange( WonderState.HM_hurray, 1.0, 0.2));
    }

    *AnimateIncorrect()
    {
        this.StartCoroutine(this.AnimateProp( 1.0, 0));
        this.StartCoroutine(this.AnimateCollider());     
        
        this.StartCoroutine( this.AnimateLeftParticle());
        //this.StartCoroutine( this.AnimateRightParticle());
        

        yield this.StartCoroutine(this.NPCAnimateChange( WonderState.HM_NT, 1.0));
        yield this.StartCoroutine(this.AnimateChange( WonderState.HM_NT, 1.0));
    }

    *AnimateProp( duration : float  = 1.0, delay : float = 0 )
    {
        yield new WaitForSeconds( delay );
        this.animatorProp.SetInteger("NTState", 100);
        yield new WaitForSeconds( duration );
        this.animatorProp.SetInteger("NTState", 0);
    }

    *AnimateCollider( delay : float = 0 )
    {
        yield new WaitForSeconds( delay );

        this.animLeftCollider.Play();
        this.animRightCollider.Play();

        yield new WaitWhile(() => this.animLeftCollider.isPlaying && this.animRightCollider.isPlaying );
    }

    *AnimateLeftParticle( duration : float  = 1.0, delay : float = 0 )
    {
        yield new WaitForSeconds( delay );        
        
        this.particleLeft.gameObject.SetActive(true);
        
        yield new WaitForSeconds( duration );

        this.particleLeft.gameObject.SetActive(false);        
    }


    *AnimateRightParticle( duration : float  = 1.0, delay : float = 0 )
    {
        yield new WaitForSeconds( delay );        
        
        this.particleRight.gameObject.SetActive(true);
        
        yield new WaitForSeconds( duration );

        this.particleRight.gameObject.SetActive(false);
        
    }




    *AnimateChange( wonderState : WonderState, duration : float  = 1.0, delay : float = 0 )
    {
        yield new WaitForSeconds( delay );
        GameManager.instance.SetWonderState(wonderState, true);    
        yield new WaitForSeconds( duration );
        GameManager.instance.SetWonderState(wonderState, false);
    }

    *NPCAnimateChange( wonderState : WonderState, duration : float  = 1.0, delay : float = 0 )
    {
        yield new WaitForSeconds( delay );
        this.npcOppo.ZepetoAnimator.SetInteger( Anim.WonderState , wonderState );            
        yield new WaitForSeconds( duration);
        this.npcOppo.ZepetoAnimator.SetInteger( Anim.WonderState , WonderState.NONE );            
    }


    //character.ZepetoAnimator.SetInteger( Anim.WonderState , WonderState.HM_hurray );    

    public onGameRetry() :void {
        this.uicontrol.GameReady();        
    }


    public onGameStop() :void {
        this.onGameClear( this._lastgameTime );
    }






}













