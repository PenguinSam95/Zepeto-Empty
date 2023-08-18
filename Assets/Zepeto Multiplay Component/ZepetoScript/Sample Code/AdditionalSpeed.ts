import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Collider, Object} from 'UnityEngine'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ERROR } from '../Managers/TypeManager';

export default class AdditionalSpeed extends ZepetoScriptBehaviour {
    //Script that increases the speed when the Zepeto character steps on the trigger.
    
    @SerializeField() private additionalRunSpeed:number = 10;
    @SerializeField() private additionalWalkSpeed:number = 10;
    @SerializeField() private additionalJumpPower:number = 10;
    
    private OnTriggerEnter(collider: Collider) {
        if(!ZepetoPlayers.instance.LocalPlayer) return console.error(ERROR.NOT_FOUND_LOCAL_PLAYER);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        if(collider.gameObject != character.gameObject) return;

        character.additionalRunSpeed = this.additionalRunSpeed;
        character.additionalWalkSpeed = this.additionalWalkSpeed;
        character.additionalJumpPower = this.additionalJumpPower;
    }
    
    private OnTriggerExit(collider: Collider) {
        if(!ZepetoPlayers.instance.LocalPlayer) return console.error(ERROR.NOT_FOUND_LOCAL_PLAYER);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        if(collider.gameObject != character.gameObject) return;

        character.additionalRunSpeed = 0;
        character.additionalWalkSpeed = 0;
        character.additionalJumpPower = 0;
    }
}