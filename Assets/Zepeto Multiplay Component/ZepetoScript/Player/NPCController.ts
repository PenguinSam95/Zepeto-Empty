import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { NPCType, NPCs } from '../Managers/TypeManager';
import NPCManager from './NPCManager';
import { Quaternion, Vector3 } from 'UnityEngine';

export default class NPCController extends ZepetoScriptBehaviour {

    /* Properties */
    @SerializeField() private _npcNum: NPCs = NPCs.NONE;
    @SerializeField() private _npcType: NPCType = NPCType.Default;
    public get npcNum(): NPCs { return this._npcNum; }
    public get npcType(): NPCType { return this._npcType; }
    private set npcType(value:NPCType) { this._npcType = value; }


    /* Spawn NPC */
    private Start() {
        NPCManager.instance.SpawnNPC(this, () => {
            //
        });
    }

}