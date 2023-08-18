
import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { LeaderboardAPI, RankInfo, ResetRule, SetScoreResponse } from 'ZEPETO.Script.Leaderboard';
import { Users, WorldService, ZepetoWorldHelper } from 'ZEPETO.World';
import { mgLog } from '../../CommonUtil/mgLog';
//import { mgLog } from '../mgLog';


export enum LeaderboardID {
    // LeaderboardID_JG = '117fa7d9-a6ba-489b-9018-0022b6bdc616',   // TEST
    // LeaderboardID_NT = '9353f139-a423-4c1d-bacb-8ffd0e94d1cc',   // TEST
    LeaderboardID_JG = '0889d68b-eeb0-4dc7-89c2-b18a31f472f2',   // hall_JG
    LeaderboardID_NT = '15ca03d4-bce6-4042-b48b-297dfe681ff4',   // hall_NT
}


export type CallbackResultRank = ( rankInfo : RankInfo | null ) => void;

export default class HallRankManager extends ZepetoScriptBehaviour {   

    private static _instance: HallRankManager = null;
    public static get instance(): HallRankManager {
        if (this._instance === null) {
            this._instance = GameObject.FindObjectOfType<HallRankManager>();
            if (this._instance === null) {
                this._instance = new GameObject(HallRankManager.name).AddComponent<HallRankManager>();
            }
        }
        return this._instance;
    }


    private Awake() {
        if (HallRankManager._instance !== null && HallRankManager._instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            HallRankManager._instance = this;            
        }
    }



    public static TestCallLeaderBoard()
    {        
        this.SetScore(2, LeaderboardID.LeaderboardID_JG);
        this.SetScore(3, LeaderboardID.LeaderboardID_NT);        

        LeaderboardAPI.GetAllLeaderboards((result) => {
            if (result.leaderboards) {
                for (let i = 0; i < result.leaderboards.length; ++i) {
                    const leaderboard = result.leaderboards[i];

                    if( leaderboard.name.startsWith ("hall_") ) {
                        mgLog.log(`i: ${i}, id: ${leaderboard.id}, name: ${leaderboard.name}`);
                    }                   
                }
            }
        },
        (error) => { 
            mgLog.error(error);
        });


        this.GetLeaderboardInfo( LeaderboardID.LeaderboardID_JG );
        this.GetUserInfo();
        this.GetUserRank(LeaderboardID.LeaderboardID_JG);
    }


    public static SetScore( score : int, leaderboradID : LeaderboardID, callbackResultRank : CallbackResultRank = null )    
    {        
        LeaderboardAPI.SetScore(leaderboradID, score, 
            (result) => {
                mgLog.log(`SetScore result.isSuccess: ${result.isSuccess}`);

                this.GetUserRank(leaderboradID, callbackResultRank);
            }, 
            (error) => {
                mgLog.error( error );

                if( callbackResultRank!= null) {
                    callbackResultRank(null);
                }
            });
    }


    public static GetLeaderboardInfo(leaderboradID : LeaderboardID)    
    {        
        LeaderboardAPI.GetLeaderboard(leaderboradID, 
            (result) => {                
                mgLog.log(`GetLeaderboardInfo result.isSuccess: ${result.isSuccess}`);

                if (result.leaderboard) {
                    mgLog.log(`id: ${result.leaderboard.id}, name: ${result.leaderboard.name}`);
                }
            }, 
            (error) => {
                mgLog.error(`GetLeaderboardInfo = ${error}`);
            });
    }


    public static GetUserInfo() {
        //let ids: string[] = ["zepeto.metabuzzt", "metalgeni.mbz"];        

        const userId = WorldService.userId;
        let ids: string[] = [userId,];

        mgLog.log(`userId = ${userId}`);    // userId = 6181f0575b43c2d71a38d693'
        
        ZepetoWorldHelper.GetUserInfo(ids, (info: Users[]) => {
            mgLog.log(`GetUserInfo result`);
            for (let i = 0; i < info.length; i++) {
                mgLog.log(`userId : ${info[i].userOid}, name : ${info[i].name}, zepetoId : ${info[i].zepetoId}`);
            }
        }, (error) => {
            mgLog.error(`GetUserInfo = ${error}`);
        });
    }


    public static GetUserRank(leaderboradID : LeaderboardID, callbackResultRank : CallbackResultRank = null ) {

        LeaderboardAPI.GetRangeRank(leaderboradID, 1, 3, ResetRule.week, false, 
            (result ) => {
                mgLog.log(`GetRangeRank result.isSuccess: ${result.isSuccess}`);
                
                /*
                // 로그 확인용
                if (result.rankInfo.myRank) {
                    mgLog.log(`member: ${result.rankInfo.myRank.member}, rank: ${result.rankInfo.myRank.rank}, 
                                score: ${result.rankInfo.myRank.score}, name: ${result.rankInfo.myRank.name}`);
                }
        
                if (result.rankInfo.rankList) {
                    for (let i = 0; i < result.rankInfo.rankList.length; ++i) {
                        //const rank = result.rankInfo.rankList.get_Item(i);
                        const rank = result.rankInfo.rankList[i];
                        console.log(`i: ${i}, member: ${rank.member}, rank: ${rank.rank}, 
                                    score: ${rank.score}, name: ${result.rankInfo.myRank.name}`);
                    }
                }                
                */

                if( callbackResultRank != null)
                    callbackResultRank(result.rankInfo);
            }, 
            (error) => {
                mgLog.error(`GetRangeRank = ${error}`);
                if( callbackResultRank != null)
                    callbackResultRank(null);
            });            

    }

}


