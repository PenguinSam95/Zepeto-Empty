import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import TranslateManager, { LanguageType } from './TranslateManager';

export default class Localizer extends ZepetoScriptBehaviour {

    /* Properties */
    private isStarted: boolean = false;

    /* Self Start */
    Start() {
        this.onStart();
    }

    /* Remote Start */
    public RemoteStart() {
        this.onStart();
    }

    private onStart() {
        if(this.isStarted) return;
        this.isStarted = true;

        
        switch(+TranslateManager.nowSystemLanguage) {

            case LanguageType.Kr:
                break;

            default : 
                break;
            
        }
    }

}