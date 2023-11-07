import { TextMeshProUGUI } from 'TMPro';
import { Animation, Coroutine, GameObject, Transform, WaitForSeconds } from 'UnityEngine';
import { Text } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { TOAST_MESSAGE } from '../Managers/TypeManager';
import GameManager from './GameManager';

export default class ToastManager extends ZepetoScriptBehaviour {
    
    /* Properties */
    @SerializeField() private toastErrorMessage: GameObject;
    @SerializeField() private toastSuccessMessage: GameObject;
    @SerializeField() private animationCanvas: Transform;
    @SerializeField() private textAnimation_Text: TextMeshProUGUI;
    @SerializeField() private textAnimation: Animation;
    @SerializeField() private textAnimation_OneSec_Text: TextMeshProUGUI;
    @SerializeField() private textAnimation_OneSec: Animation;

    /* GameManager */
    public RemoteStart() {
        this.TextAnimationOFF();
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

    public TextAnimate(text:string, tic:number = 1500) {
        this.textAnimation.Stop();
        this.textAnimation.gameObject.SetActive(true);
        this.textAnimation_Text.text = text;
        this.textAnimation.Play();
        
        setTimeout(() => {
            this.TextAnimationOFF();
        }, tic);
    }

    public TextAnimationOFF() {
        this.textAnimation.gameObject.SetActive(false);
        this.textAnimation.Stop();
    }

    public TextAnimate_OneSec(text:string) {
        this.textAnimation_OneSec.Stop();
        this.textAnimation_OneSec.gameObject.SetActive(true);
        this.textAnimation_OneSec_Text.text = text;
        this.textAnimation_OneSec.Play();
        
        setTimeout(() => {
            this.TextAnimationOFF_OneSec();
        }, 1000);
    }

    public TextAnimationOFF_OneSec() {
        this.textAnimation_OneSec.gameObject.SetActive(false);
        this.textAnimation_OneSec.Stop();
    }

}