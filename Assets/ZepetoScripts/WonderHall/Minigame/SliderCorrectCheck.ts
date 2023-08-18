import { TextMeshProUGUI } from 'TMPro';
import { BoxCollider2D, CircleCollider2D, Collider2D, GameObject, Mathf, RectTransform, Vector2 } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { mgLog } from '../../CommonUtil/mgLog';
//import { mgLog } from '../mgLog';
import HallRankManager from './HallRankManager';
//import { triggerSizes } from './UIHallGameControl';
//import { mgLog } from '../../../CommonUtil/mgLog';


//const triggerSizes : int[] = [100, 80, 60, 40, 20];

type triggerDelegate = ( isOn : boolean) => void | null;

export default class SliderCorrectCheck extends ZepetoScriptBehaviour {    

    public checkObject : GameObject;    

    public viewImage :  RectTransform;

    public onChanged : triggerDelegate;

    private rectTransform :  RectTransform;
    private boxCollider2D :  BoxCollider2D

    private _triggerSizes: int[];


    private isTriggered : boolean = false;    
    public get IsTriggered() {
        return this.isTriggered;
    }    


    // Start() {
    //     mgLog.log('SliderCorrectCheck Start');
    //     // this.isTriggered = false;
    //     // this.rectTransform = this.gameObject.GetComponent<RectTransform>();        
    //     // this.boxCollider2D = this.gameObject.GetComponent<BoxCollider2D>();
    // }

    // OnEnable() {
    //     mgLog.log('SliderCorrectCheck OnEnable');
    // }

    // OnDisable() {
    //     mgLog.log('SliderCorrectCheck OnDisable');
    // }

    public SetTriggerSizes(triggerSizes: int[]) {
        this._triggerSizes = [...triggerSizes];
    }


    public OnSuccessChange( successCount : int ) : void
    {
        mgLog.log('SliderCorrectCheck OnSuccessChange');

        // from start
        this.isTriggered = false;        
        this.rectTransform = this.gameObject.GetComponent<RectTransform>();                
        this.boxCollider2D = this.gameObject.GetComponent<BoxCollider2D>();


        successCount = Mathf.Clamp( successCount, 0, 4);
        
        this.rectTransform.sizeDelta = new Vector2(this._triggerSizes[successCount], 58);

        // 100    58 
        // 620    436
        this.viewImage.sizeDelta = new Vector2(this._triggerSizes[successCount], 58);

        this.boxCollider2D.size = this.rectTransform.sizeDelta;

    }

    OnTriggerEnter2D(collider: Collider2D) {
        if( this.checkObject == collider.gameObject ) {
            //mgLog.log(`OnTriggerEnter2D. ${this.name}, ${collider.gameObject.name}`);
            this.isTriggered = true;

            if( this.onChanged != null ) {
                this.onChanged( this.isTriggered );
            }
        }
    }

    OnTriggerExit2D(collider: Collider2D) {
        if( this.checkObject == collider.gameObject ) {
            //mgLog.log(`OnTriggerExit2D. ${this.name}, ${collider.gameObject.name}`);

            this.isTriggered = false;

            if( this.onChanged != null ) {
                this.onChanged( this.isTriggered );
            }

        }

    }


    

    // OnTriggerStay2D(collider: Collider2D) {
    //     if( this.checkObject == collider.gameObject ) {
    //         mgLog.log(`OnTriggerStay2D. ${this.name}, ${collider.gameObject.name}`);
    //     }
    // }


}