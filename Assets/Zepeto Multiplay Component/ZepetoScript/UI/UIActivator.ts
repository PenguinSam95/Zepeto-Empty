import { GameObject, Transform } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LookAt from '../Sample Code/LookAt';
import UIManager from '../Managers/UIManager';
import { UIList, Callback } from '../Managers/TypeManager';

export default class UIActivator extends ZepetoScriptBehaviour {

    /* Default Properties */
    @Header("Default Properties")
    @SerializeField() private frame: Transform;
    @SerializeField() private background: Transform;
    @SerializeField() private closeButton: Button;
    @SerializeField() private yButton: Button;
    @SerializeField() private nButton: Button;
    @SerializeField() private readonly _uiType: UIList = UIList.NONE;
    public get uiType() { return this._uiType }

    /* Set Properties */
    @Header("Set Properties")
    @SerializeField() private yButton_isActiveClose: boolean = false;
    @SerializeField() private nButton_isActiveClose: boolean = false;

    public get UIObject(): GameObject { return this.frame?.gameObject; }
    public get _xButton(): Button { return this.closeButton; }
    public get _yButton(): Button { return this.yButton; }
    public get _nButton(): Button { return this.nButton; }
    public xCallback: Callback = () => {};
    public yCallback: Callback = () => {};
    public nCallback: Callback = () => {};

    public isSilentlyClose : bool  = false;

    Start() {
        /* Init UIs */
        this.SetFrame();
        this.SetDefaultButtons();

        /* Set to UIManager */
        this.SetThisUIType();
    }

    private SetFrame() {
        if(!this.frame) this.frame = this.transform.GetChild(0);
        if(!this.background) this.background = this.frame.GetChild(0);

        /* Default Off */
        this.UIObject.SetActive(false);
    }

    private SetDefaultButtons() {
        this.closeButton?.onClick.AddListener(() => { this.CloseButton() });
        this.yButton?.onClick.AddListener(() => { this.YesButton() });
        this.nButton?.onClick.AddListener(() => { this.NoButton() });
    }

    private CloseUI() {        
        UIManager.instance.DeactiveOpenUI(this.uiType, this.isSilentlyClose);
    }


    private CloseButton() {
        this.xCallback();
        this.CloseUI();
    }


    private YesButton() {
        this.yCallback();
        if(this.yButton_isActiveClose) this.CloseUI();
    }


    private NoButton() {
        this.nCallback();
        if(this.nButton_isActiveClose) this.CloseUI();
    }


    private SetThisUIType() {
        UIManager.instance.UIList = this;
    }
}