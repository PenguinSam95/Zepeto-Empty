import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIActivator from './UIActivator';

export default class SampleUI extends ZepetoScriptBehaviour {

    Start() {
        const activator = this.transform.GetComponent<UIActivator>();

        activator.xCallback = () => {
            console.log(`activator.xCallback`);
        }

        activator.yCallback = () => {
            console.log(`activator.yCallback`);
        }

        activator.nCallback = () => {
            console.log(`activator.nCallback`);
        }

        activator._xButton?.onClick.AddListener(() => { console.log(`activator._xButton`); });
        activator._yButton?.onClick.AddListener(() => { console.log(`activator._yButton`); });
        activator._nButton?.onClick.AddListener(() => { console.log(`activator._nButton`); });
    }

}