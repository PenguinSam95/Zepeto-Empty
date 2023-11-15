import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Collider, Object} from 'UnityEngine'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { CallbackPlayer, ERROR } from '../Managers/TypeManager';

export default class AdditionalSpeed extends ZepetoScriptBehaviour {
    //Script that increases the speed when the Zepeto character steps on the trigger.
    
    /* Properties */
    @SerializeField() private additionalRunSpeed:number = 10;
    @SerializeField() private additionalWalkSpeed:number = 10;
    @SerializeField() private additionalJumpPower:number = 10;
    
    OnTriggerEnter(collider: Collider) {
        this.onTrigger(collider, (character) => {
            character.additionalRunSpeed = this.additionalRunSpeed;
            character.additionalWalkSpeed = this.additionalWalkSpeed;
            character.additionalJumpPower = this.additionalJumpPower;
            return true;
        })
    }
    
    OnTriggerExit(collider: Collider) {
        this.onTrigger(collider, (character) => {
            character.additionalRunSpeed = 0;
            character.additionalWalkSpeed = 0;
            character.additionalJumpPower = 0;
            return true;
        })
    }
    
    private onTrigger(collider: Collider, callback?: CallbackPlayer<ZepetoCharacter, boolean>) {
        if(!ZepetoPlayers.instance.LocalPlayer) return console.warn(ERROR.NOT_FOUND_LOCAL_PLAYER);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        if(collider.gameObject != character.gameObject) return;

        if(callback != null) callback(character);
    }
}