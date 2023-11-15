import { Collider, GameObject, SphereCollider, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Callback, ERROR } from '../Managers/TypeManager';
import LookAt from './LookAt';

export default class LookAtTrigger extends ZepetoScriptBehaviour {

    /* Default Properties */
    private lookAt: LookAt;
    private col: SphereCollider;

    Start() {
        this.lookAt = this.transform.parent.GetComponentInChildren<LookAt>();
        this.col = this.transform.GetComponent<SphereCollider>();
    }

    /* Trigger */
    OnTriggerEnter(collider: Collider) { this.OnTrigger(collider, () => { this.lookAt.StartLooking(collider); }); }
    OnTriggerExit(collider: Collider) { this.OnTrigger(collider, () => { this.lookAt.StopLooking(collider); }); }
    private OnTrigger(collider: Collider, callback?: Callback) {
        if(!ZepetoPlayers.instance.LocalPlayer) return console.warn(ERROR.NOT_FOUND_LOCAL_PLAYER);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
        if(collider.gameObject != character) return;

        if(callback != null) callback();
    }

    /* Player is In Trigger? */
    public get isInTrigger(): boolean {
        return this.GetDistanceToLocalPlayer() < this.col.radius;
    }

    /* Get Distance to Local Player */
    public GetDistanceToLocalPlayer() {
        if(!ZepetoPlayers.instance.LocalPlayer) return 1000;
        return Vector3.Distance(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position, this.transform.position);
    }
}