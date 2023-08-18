import {Collider, Vector3, Quaternion, Object, Transform} from 'UnityEngine';
import {CharacterState, SpawnInfo, ZepetoCharacter, ZepetoPlayers, ZepetoPlayer} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Room} from "ZEPETO.Multiplay";
import {ZepetoWorldMultiplay} from "ZEPETO.World";
import { ERROR, Tags } from '../Managers/TypeManager';

export default class FallChecking extends ZepetoScriptBehaviour {
    //It's a script that responds when the Zepeto character falls.
    @SerializeField() private returnPoint:Transform;
    private OnTriggerEnter(collider: Collider) {
        if(!ZepetoPlayers.instance.LocalPlayer) return console.error(ERROR.NOT_FOUND_LOCAL_PLAYER);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
        if(collider.gameObject != character) return;

        const localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        if(this.returnPoint) localCharacter.Teleport(this.returnPoint.position, this.returnPoint.rotation);
        else localCharacter.Teleport(Vector3.zero, Quaternion.identity);
    }
}