import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class DeveloperBackDoor extends ZepetoScriptBehaviour {

    @Header("** Developer **")
    @Header("Permission Admin")
    @SerializeField() private useBackDoor: boolean = false;
    // @SerializeField() private upButton: Button;
    
    @Header("Permission Developer")
    @SerializeField() private useDetail: boolean = false;
    @SerializeField() private detailPanel: GameObject;
    // @SerializeField() private NONEstate_Button: Button;


    Start() {    
        // Admin
        if(!this.useBackDoor) { return GameObject.Destroy(this.gameObject) }
        
        // this.upButton.onClick?.AddListener(() => {
        // });


        // Developer
        if(!this.useDetail) { return GameObject.Destroy(this.detailPanel) }
        
        // this.NONEstate_Button.onClick?.AddListener(() => {
        // });
    }

}