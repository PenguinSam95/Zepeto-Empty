import { GameObject } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Datas } from './TypeManager';
import GameManager from './GameManager';

export default class DeveloperBackDoor extends ZepetoScriptBehaviour {

    @Header("** Developer **")
    @Header("Permission Admin")
    @SerializeField() private useBackDoor: boolean = false;
    @SerializeField() private testButton: Button;
    
    @Header("Permission Developer")
    @SerializeField() private useDetail: boolean = false;
    @SerializeField() private detailPanel: GameObject;
    // @SerializeField() private NONEstate_Button: Button;


    Start() {    
        // Admin
        if(!this.useBackDoor) { return GameObject.Destroy(this.gameObject) }
        
        this.testButton.onClick?.AddListener(() => {
            //
            const num = 50000000;
            console.log(`num.toCount() ${num.toCount()} $`);
            
            const num2 = 50;
            console.log(`num2.toPercent(10, 110) ${num2.toPercent(10, 110)} %`);
            
            GameManager.instance.TextAnimate(Datas.CLEAR, 2000, () => {});

            setTimeout(() => {
                GameManager.instance.EffectAnimation();
            }, 300);
        });


        // Developer
        if(!this.useDetail) { return GameObject.Destroy(this.detailPanel) }
        
        // this.NONEstate_Button.onClick?.AddListener(() => {
        // });
    }

}