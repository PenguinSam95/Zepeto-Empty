import { TextMeshProUGUI } from 'TMPro';
import { Animation, Coroutine, GameObject, Transform, WaitForSeconds } from 'UnityEngine';
import { Text } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Callback, TOAST_MESSAGE } from '../Managers/TypeManager';
import GameManager from './GameManager';

export default class ToastManager extends ZepetoScriptBehaviour {
    
    /* Properties */
    @SerializeField() private animationCanvas: Transform;
    @SerializeField() private toastErrorMessage: GameObject;
    @SerializeField() private toastSuccessMessage: GameObject;

    @SerializeField() private _effectAnimation: GameObject;
    @SerializeField() private _textAnimation: GameObject;
    @SerializeField() private _textAnimation_OneSec: GameObject;

    private effectAnimation: Animation;
    private textAnimation: Animation;
    private textAnimation_Text: TextMeshProUGUI;
    private textAnimation_OneSec: Animation;
    private textAnimation_OneSec_Text: TextMeshProUGUI;

    /* GameManager */
    public RemoteStart(callback?: Callback) {
        this.InstantiateItems();

        if(callback != null) callback();
    }

    private InstantiateItems() {

        // Instantiate
        const effectAnimation = GameObject.Instantiate<GameObject>(this._effectAnimation, this.animationCanvas);
        const textAnimation = GameObject.Instantiate<GameObject>(this._textAnimation, this.animationCanvas);
        const textAnimation_OneSec = GameObject.Instantiate<GameObject>(this._textAnimation_OneSec, this.animationCanvas);

        // Init
        this.effectAnimation = effectAnimation.GetComponent<Animation>();
        this.textAnimation = textAnimation.GetComponent<Animation>();
        this.textAnimation_Text = textAnimation.GetComponentInChildren<TextMeshProUGUI>();
        this.textAnimation_OneSec = textAnimation_OneSec.GetComponent<Animation>();
        this.textAnimation_OneSec_Text = textAnimation_OneSec.GetComponentInChildren<TextMeshProUGUI>();

        // Off
        this.EffectAnimationOFF();
        this.TextAnimationOFF();
        this.TextAnimationOFF_OneSec();
    }

    /* Toast */
    public Toast(text:string) {
        this.StartCoroutine(this.ShowToastMessage(text));
    }
    
    private * ShowToastMessage(text:string) {
        const wait = GameManager.instance.waitOneSec;
        yield wait;

        // Choice Target
        const isFailed = (text == TOAST_MESSAGE.feedFailed);
        const targetMessgae = isFailed ? this.toastErrorMessage : this.toastSuccessMessage;

        // Instantiate GameObject
        const toastMessage:GameObject = GameObject.Instantiate<GameObject>(targetMessgae);
        toastMessage.transform.SetParent(this.animationCanvas);

        // Set Target Text
        toastMessage.GetComponentInChildren<Text>().text = text;

        // Finish
        GameObject.Destroy(toastMessage, 1);
    }

    public TextAnimate(text:string, tic:number = 1500, callback?: Callback) {
        this.textAnimation?.Stop();
        this.textAnimation?.gameObject.SetActive(true);
        this.textAnimation_Text.text = text;
        this.textAnimation?.Play();
        
        setTimeout(() => {
            this.TextAnimationOFF();
            if(callback != null) callback();
        }, tic);
    }

    public TextAnimationOFF() {
        this.textAnimation?.gameObject.SetActive(false);
        this.textAnimation?.Stop();
    }

    public TextAnimate_OneSec(text:string, callback?: Callback) {
        this.textAnimation_OneSec?.Stop();
        this.textAnimation_OneSec?.gameObject.SetActive(true);
        this.textAnimation_OneSec_Text.text = text;
        this.textAnimation_OneSec?.Play();
        
        setTimeout(() => {
            this.TextAnimationOFF_OneSec();
            if(callback != null) callback();
        }, 1000);
    }

    public TextAnimationOFF_OneSec() {
        this.textAnimation_OneSec?.gameObject.SetActive(false);
        this.textAnimation_OneSec?.Stop();
    }


    /* UI Effect Animation */
    public EffectAnimation() {
        this.effectAnimation?.Stop();
        this.effectAnimation?.gameObject.SetActive(true);
        this.effectAnimation?.Play();
        
        setTimeout(() => {
            this.EffectAnimationOFF();
        }, 1000);
    }

    public EffectAnimationOFF() {
        this.effectAnimation?.gameObject.SetActive(false);
        this.effectAnimation?.Stop();
    }


}