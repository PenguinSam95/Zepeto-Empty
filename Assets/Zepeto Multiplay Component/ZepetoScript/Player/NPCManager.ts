import { SpawnInfo, ZepetoCharacter, ZepetoCharacterCreator } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Callback, LAYER, NPC_ID, NPCs } from '../Managers/TypeManager';
import { GameObject, LayerMask, Transform } from 'UnityEngine';
import NPCController from './NPCController';

export default class NPCManager extends ZepetoScriptBehaviour {
    
    /* Singleton */
    private static _instance: NPCManager = null;
    public static get instance(): NPCManager {
        if (this._instance === null) {
            this._instance = GameObject.FindObjectOfType<NPCManager>();
            if (this._instance === null) {
                this._instance = new GameObject(NPCManager.name).AddComponent<NPCManager>();
            }
        }
        return this._instance;
    }

    /* Properties */
    /** NPC Controllers **/
    private npcIds: string[] = [];
    private npcControllers: NPCController[] = [];
    private set npcController(value: NPCController) { this.npcControllers.push(value); }
    public GetNPCs(npcNum: NPCs): NPCController[] {
        const controllers = [];
        for(const item of this.npcControllers) {
            if(item.npcNum == npcNum) controllers.push(item);
        }
        return controllers;
    }



    /*** Main Script ***/
    private Awake() {
        if (NPCManager._instance !== null && NPCManager._instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            NPCManager._instance = this;
            GameObject.DontDestroyOnLoad(this.gameObject);
        }
    }


    /* NPC Controller */
    public SpawnNPC(controller: NPCController, callback?: Callback) {

        /* Set Position */
        const spawnPoint = new SpawnInfo();
        spawnPoint.position = controller.transform.position;
        spawnPoint.rotation = controller.transform.rotation;
        const npcId = this.SwitchingId(controller.npcNum);
        console.log(`[NPCManager] npcId : ${npcId}`);


        ZepetoCharacterCreator.CreateByZepetoId(npcId, spawnPoint, (character: ZepetoCharacter)=> {
            character.transform.SetParent(controller.transform);
            this.SetNPCLayer(character.transform);
            this.npcController = controller;

            if(callback != null) callback();
        });
    }

    /* Number to Id */
    private SwitchingId(npcNum:NPCs) {
        if(!this.npcIds || this.npcIds.length == 0) this.ParseToNPCIds();
        if(npcNum < 0 || npcNum >= this.npcIds.length) return null;
        return this.npcIds[npcNum];
    }

    /* Enum to NPCIds Array */
    private ParseToNPCIds() {
        const values = Object.keys(NPC_ID);
        const keys = values.map(key => NPC_ID[key]);
        keys.splice(keys.length, 1);
        this.npcIds = keys;
    }

    /* Set NPC Layer */
    private SetNPCLayer(transform: Transform) {
        if(!transform) return;

        transform.gameObject.layer = LAYER.NPC;
        for(let i=0; i<transform.childCount; i++) {
            const child = transform.GetChild(i);
            this.SetNPCLayer(child);
        }
    }



    
    
    /* GameManager */
    public RemoteStart(callback?: Callback) {

        
        if(callback != null) callback();
    }
}