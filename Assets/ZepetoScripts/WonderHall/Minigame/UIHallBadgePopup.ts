import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'


type CloseDelegate = () => void | null;

export default class UIHallBadgePopup extends ZepetoScriptBehaviour {

    public buttonOK : Button;
    public buttonClose : Button;
    private _closeDelegate : CloseDelegate;

    Start() {    
        this.buttonOK?.onClick.AddListener(() => {
            this.onOK();        
        });

        this.buttonClose?.onClick.AddListener(() => {
            this.onOK();        
        });
        
    }

    onOK() : void 
    {
        if(this._closeDelegate != null) {
            this._closeDelegate();
        }        
        this.gameObject.SetActive(false);
    }

    onShow( closeDelegate : CloseDelegate)
    {
        this._closeDelegate = closeDelegate;
        this.gameObject.SetActive(true);
    }

}