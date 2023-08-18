import { Coroutine, GameObject, WaitForSeconds } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class BlinkObject extends ZepetoScriptBehaviour {

    public blinkTarget : GameObject;
    public disalbeTime : float = 0.3;
    public enableTime : float = 0.8;

    private _coroutine : Coroutine = null;

    Start() {    

    }

    OnEnable () {
        this._coroutine = this.StartCoroutine(this.Blink());
    }

    OnDisable () {
        this.StopCoroutine(this._coroutine);
    }


    *Blink() {
        while(true) {
            this.blinkTarget.SetActive(true);
            yield new WaitForSeconds(this.enableTime);
    
            this.blinkTarget.SetActive(false);
            yield new WaitForSeconds(this.disalbeTime);    
        }
    }


}