import { Camera, GameObject, Input, LayerMask, Mathf, Physics, RaycastHit } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import GameManager from './GameManager';
import { Datas } from './TypeManager';

export default class CameraManager extends ZepetoScriptBehaviour {

    /* Properties */
    private layer_btn : number;
    public multiplay : ZepetoWorldMultiplay;
    private hitValue: GameObject;
    private isRaycasting: boolean = false;
    private isPushed: boolean = false;

    Start() {
        if(!this.multiplay)
            this.multiplay = GameObject.FindObjectOfType<ZepetoWorldMultiplay>();

        this.layer_btn = 1 << LayerMask.NameToLayer(Datas.Button); // Layer 6
        
    }

    /* Raycasting */
    Update() {
        if (this.multiplay.Room != null && this.multiplay.Room.IsConnected) {
            const hasPlayer = ZepetoPlayers.instance.HasPlayer(this.multiplay.Room.SessionId);
            if (hasPlayer) {
                this.Raycasting();
            }
        }
    }

    Raycasting() {
        if(this.isRaycasting) return;
        this.isRaycasting = true;
        // iphone 이슈
        // 아이폰은 왠지는 모르겟지만
        // ButtonUp일때 ButtonDown과 Button를 무시한다
        // 빈 공간에 터치 후에 드래그상태에서 버튼 위에서 ButtonUp을 할 때만 작동된다!!!!
        const ray = ZepetoPlayers.instance.ZepetoCamera.camera.ScreenPointToRay(Input.mousePosition);
        const hitInfo = $ref<RaycastHit>();

        /* Touch Start */
        if(Input.GetMouseButtonDown(0) && this.isPushed == false) {
            if(Physics.SphereCast(ray, 0.5, hitInfo, Mathf.Infinity, this.layer_btn)) {
                this.hitValue = hitInfo.value.transform.gameObject;
                this.isPushed = true;
            } else {
                this.isPushed = false;
                this.hitValue = null;
            }

        /* Touch Drag */
        } else if(Input.GetMouseButton(0) && this.isPushed == true) {
            if(Physics.SphereCast(ray, 0.5, hitInfo, Mathf.Infinity, this.layer_btn)) {
            } else {
                this.isPushed = false;
                this.hitValue = null;
            }
            
        /* Touch End */
        } else if(Input.GetMouseButtonUp(0) && this.isPushed == true) {
            GameManager.instance.SwitchButtonScript(this.hitValue.transform);
            this.isPushed = false;
            this.hitValue = null;
        }
        this.isRaycasting = false;
    }
}