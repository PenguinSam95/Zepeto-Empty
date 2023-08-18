
import { GameObject, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
//import { mgLog } from '../../../ZepetoScripts/WonderHall/mgLog';

export default class HallSceneManager extends ZepetoScriptBehaviour {

    public teleportNT : Transform; 
    public teleportJG : Transform; 
    
    public minigameJGManagerObject : Transform;
    public minigameNTManagerObject : Transform;

    /* Singleton */
    private static _instance: HallSceneManager = null;
    public static get instance(): HallSceneManager {
        if (this._instance === null) {
            this._instance = GameObject.FindObjectOfType<HallSceneManager>();
            if (this._instance === null) {
                this._instance = new GameObject(HallSceneManager.name).AddComponent<HallSceneManager>();
            }
        }
        return this._instance;
    }


    private Awake() {
        if (HallSceneManager._instance !== null && HallSceneManager._instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            HallSceneManager._instance = this;
            //GameObject.DontDestroyOnLoad(this.gameObject);            
        }
    }


    public TestLog()
    {
        //mgLog.log('test log..');
    }


}