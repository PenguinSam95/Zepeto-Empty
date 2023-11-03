import { Application, SystemLanguage } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from '../Managers/GameManager';


export enum LanguageType {
    None = -1,
    Kr = 1,
    En = 2,
}

export default class TranslateManager extends ZepetoScriptBehaviour {

    private static nowLanguage:LanguageType = LanguageType.None;
    public static get nowSystemLanguage() : LanguageType {
        /* Backdoor */
        if(Application.isEditor && GameManager.instance.editLanguage) return GameManager.instance.editLanguageType;


        if(this.nowLanguage == LanguageType.None) {
            switch(Application.systemLanguage) {
                
                case SystemLanguage.Korean:
                    this.nowLanguage = LanguageType.Kr;
                    break;
                    
                default : 
                    this.nowLanguage = LanguageType.En;
                    break;
                
            }
        }
        return this.nowLanguage;
    }

}