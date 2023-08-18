import { TextMeshProUGUI } from 'TMPro';
import { Transform } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RankInfo } from 'ZEPETO.Script.Leaderboard';
import { TimeSpan } from '../../CommonUtil/TimeSpan';
import { HallMGManagerInterface } from './HallMGManagerInterface';

// import { HallMGManagerInterface } from '../../../Zepeto Multiplay Component/ZepetoScript/WonderHall/HallMGManagerInterface';
// import { TimeSpan } from '../timeSpan';
//import HallRankManager from './HallRankManager';

export default class UIWonderHallRank extends ZepetoScriptBehaviour {
    // public colNames : Text[];
    // public colValues : Text[];

    public rankDescs : TextMeshProUGUI[];

    @SerializeField() private rankPanel: Transform;
    private rankNames: TextMeshProUGUI[] = [];
    private rankScores: TextMeshProUGUI[] = [];

    public myRank : TextMeshProUGUI;
    public myRecord : TextMeshProUGUI;

    public buttonOK : Button;
    public buttonClose : Button;

    private _rankInfo : RankInfo;


    private _minigameManager: HallMGManagerInterface = null;
    public get minigameManager(): HallMGManagerInterface {
        return this._minigameManager;
    }
    public set minigameManager(value: HallMGManagerInterface) {
        this._minigameManager = value;
    }

    Start() {    
        this.buttonOK.onClick.AddListener( () => {
            this.gameObject.SetActive(false);
            this._minigameManager?.ExitGame();            
        } );

        this.buttonClose.onClick.AddListener( () => {
            this.gameObject.SetActive(false);
            this._minigameManager?.ExitGame();            
        } );
    }

    public onResultRank(rankInfo : RankInfo) :void
    {
        this._rankInfo = rankInfo;

        if(this.rankNames.length == 0 || this.rankScores.length == 0) this.SetRankText();

        // 로그 확인용
        // if (result.rankInfo.myRank) {
        //     mgLog.log(`member: ${result.rankInfo.myRank.member}, rank: ${result.rankInfo.myRank.rank}, 
        //                 score: ${result.rankInfo.myRank.score}, name: ${result.rankInfo.myRank.name}`);
        // }

        // if (result.rankInfo.rankList) {
        //     for (let i = 0; i < result.rankInfo.rankList.length; ++i) {
        //         //const rank = result.rankInfo.rankList.get_Item(i);
        //         const rank = result.rankInfo.rankList[i];
        //         console.log(`i: ${i}, member: ${rank.member}, rank: ${rank.rank}, 
        //                     score: ${rank.score}, name: ${result.rankInfo.myRank.name}`);
        //     }
        // }

        // for( let obj of this.rankDescs ) {
        //     obj.gameObject.SetActive( false );
        // }

        // for( let obj of this.rankNames ) {
        //     obj.text = ' ';
        //     //obj.gameObject.SetActive( false );
        // }
        // for( let obj of this.rankScores ) {
        //     obj.text = ' ';
        //     //obj.gameObject.SetActive( false );
        // }        

        for( let i = 0; i < this._rankInfo.rankList.length ; i++ ) {
            //this.rankDescs[i].gameObject.SetActive( true );

            //this.rankNames[i].gameObject.SetActive( true );
            this.rankNames[i].text = this.ProcessingId(this._rankInfo.rankList[i].name);

            //this.rankScores[i].gameObject.SetActive( true );

            //this.rankScores[i].text = this._rankInfo.rankList[i].score.toString();            

            const tsRemained = TimeSpan.fromMilliseconds(this._rankInfo.rankList[i].score);    
            const sec = tsRemained.seconds.toString().padStart(2, "0");
            const msec = (Math.floor(tsRemained.milliseconds / 10)).toString().padStart(2, "0");
            this.rankScores[i].text = `${sec}:${msec}`;            
            
        }

        this.myRank.text = this.ProcessingId(this._rankInfo.myRank.name);
        //this.myRecord.text = this._rankInfo.myRank.score.toString();    

        const tsRemained = TimeSpan.fromMilliseconds(this._rankInfo.myRank.score);    
        const sec = tsRemained.seconds.toString().padStart(2, "0");
        const msec = (Math.floor(tsRemained.milliseconds / 10)).toString().padStart(2, "0");
        this.myRecord.text = `${sec}:${msec}`;
        
        
    }

    private SetRankText() {
        for(let i=0; i<this.rankPanel.childCount; i++) {
            const panel = this.rankPanel.GetChild(i);
            const id = panel.GetChild(0).GetComponent<TextMeshProUGUI>();
            const score = panel.GetChild(1).GetComponent<TextMeshProUGUI>();
            this.rankNames.push(id);
            this.rankScores.push(score);
        }
    }

    private ProcessingId(beforeId:string): string {
        if(!beforeId) return `***`;
        if(beforeId.length < 8) {
            return beforeId;
        }
        return `${beforeId.slice(0, 6)}***`;
    }


}








