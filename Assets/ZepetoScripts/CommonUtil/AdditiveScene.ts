import { Camera, GameObject, Transform, Vector3, WaitForSeconds, WaitUntil } from 'UnityEngine';
import { LoadSceneMode, SceneManager } from 'UnityEngine.SceneManagement';
import { ZepetoPlayers, ZepetoCharacter, ZepetoCamera } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
// import GameManager from '../../Zepeto Multiplay Component/ZepetoScript/Managers/GameManager';
// import HallSceneManager from '../WonderHall/WonderHall/Minigame/HallSceneManager';
// import MinigameJGManager from '../WonderHall/WonderHall/Minigame/MinigameJGManager';
// import MinigameNTManager from '../WonderHall/WonderHall/Minigame/MinigameNTManager';
import { mgLog } from './mgLog';

export default class AdditiveScene extends ZepetoScriptBehaviour {
	public AdditiveSceneName: string;
	public SceneIndex: number;

	//public SpawnPosition : Vector3;
	//private CamParent: Transform;

	private static _instance: AdditiveScene = null;
	public static get instance(): AdditiveScene {
		if (this._instance === null) {
			this._instance = GameObject.FindObjectOfType<AdditiveScene>();
			if (this._instance === null) {
				this._instance = new GameObject(AdditiveScene.name).AddComponent<AdditiveScene>();
			}
		}
		return this._instance;
	}

	private Awake() {
		if (AdditiveScene._instance !== null && AdditiveScene._instance !== this) {
			GameObject.Destroy(this.gameObject);
		} else {
			AdditiveScene._instance = this;
			GameObject.DontDestroyOnLoad(this.gameObject);
		}
	}

	Start() {
		//InterActonScene.Index = -10;
		SceneManager.LoadSceneAsync(this.AdditiveSceneName, LoadSceneMode.Additive).add_completed(() => {
			mgLog.log(`completeAsync`);
			// HallSceneManager.instance.TestLog();

			// if (KWLocalPlayer.client != null)
			// {
			// 	KWLocalPlayer.client.nowScene = this.SceneIndex;
			// 	// if (KWLocalPlayer.localPlayerData != null) {
			// 	//     this.InitAllSetting();
			// 	// }
			// }
			// this.StartCoroutine(this.InitAllSetting());


			this.StartCoroutine(this.InitMG());



		});
	}

	/*
	* InitAllSetting()
	{
		console.log(`[AdditiveSceneInit]`);

		yield new WaitUntil(() =>
		{
			if (KWLocalPlayer.client != null && ZepetoPlayers.instance.LocalPlayer != null)
			{
				return true;
			}
			return false;
		});

		InteractionButton.ButtonObject.gameObject.SetActive(false);

		KWLocalPlayer.client.RequestEffect(0, true);
		ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator.SetBool(`isHold`, KWLocalPlayer.localPlayerData.HoldValue);

		if (this.AdditiveSceneName == "K_Land_Program")
		{
			if (KWLocalPlayer.localPlayerData.IsFirst)
			{
				ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position = new Vector3(0, 1, 62);
				ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localEulerAngles = new Vector3(0, 180, 0);
				ZepetoPlayers.instance.LocalPlayer.zepetoCamera.cameraParent.transform.localEulerAngles = new Vector3(-18, 180, 0);
				KWLocalPlayer.localPlayerData.IsFirst = false;
				return;
			}
			else
			{
				ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position = new Vector3(2, 1, -12);
				ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localEulerAngles = new Vector3(0, 0, 0);
				ZepetoPlayers.instance.LocalPlayer.zepetoCamera.cameraParent.transform.localEulerAngles = new Vector3(-18, 0, 0);
				return;
			}
		}
		if (this.AdditiveSceneName == "K_Hall_Program")
		{
			ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position = new Vector3(7, -13, 0.85);
			ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localEulerAngles = new Vector3(0, -90, 0);
			ZepetoPlayers.instance.LocalPlayer.zepetoCamera.cameraParent.transform.localEulerAngles = new Vector3(10, -90, 0);
		}

	}
	*/

	*InitMG() {
		yield new WaitForSeconds(5); // 씬 분리로 임시코드임		
		//mgLog.log(`completeAsync InitMG`);
		//HallSceneManager.instance.TestLog();

		// GameManager.instance.zoneMoveManager.wonderHallZone_GameNT = HallSceneManager.instance.teleportNT;
		// GameManager.instance.zoneMoveManager.wonderHallZone_GameJG = HallSceneManager.instance.teleportJG;


		// const minigameJGManager = HallSceneManager.instance.minigameJGManagerObject.GetComponent<MinigameJGManager>();
		// GameManager.instance.minigameJGManager = minigameJGManager;
		// minigameJGManager.RemoteStart();


		// const minigameNTManager = HallSceneManager.instance.minigameNTManagerObject.GetComponent<MinigameNTManager>();
		// GameManager.instance.minigameNTManager = minigameNTManager;
		// minigameNTManager.RemoteStart();


		//mgLog.log('completeAsync minigameJGManager, minigameNTManager inited');


	}


}
