import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import HallRankManager from './HallRankManager';

export default class UIHallTest extends ZepetoScriptBehaviour {
    // public colNames : Text[];
    // public colValues : Text[];

    public buttonRefresh : Button;

    Start() {    

        this.buttonRefresh.onClick.AddListener( () => {
            HallRankManager.TestCallLeaderBoard();
        } );

    }







}