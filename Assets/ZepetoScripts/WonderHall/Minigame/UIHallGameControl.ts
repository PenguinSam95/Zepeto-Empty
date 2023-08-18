import { TextMeshProUGUI } from 'TMPro';
import { GameObject, Mathf, RectTransform, Time, Vector3, WaitForSeconds, Animation, WaitWhile, Coroutine, Color } from 'UnityEngine';
import { Button, Slider, Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import SliderCorrectCheck from './SliderCorrectCheck';
import { HallMGManagerInterface } from './HallMGManagerInterface';
import { TimeSpan } from '../../CommonUtil/TimeSpan';
import { mgLog } from '../../CommonUtil/mgLog';
import MinigameJGManager from './MinigameJGManager';
import MinigameNTManager from './MinigameNTManager';
import LocalizeExternText from '../../../Zepeto Multiplay Component/ZepetoScript/Lang/LocalizeExternText';

type resultDelegate = () => void | null;

export const JGTotalGameTime : int = 30;
export const JGTotalSuccessCount : int= 5;
// 실제
export const JGSliderSpeeds: float[] = [.2, .3, .4, .5, .6];
export const JGTriggerSizes : int[] = [100, 80, 65, 45, 25];
// 테스트용 
// export const JGSliderSpeeds: float[] = [.2, .2, .2, .2, .2];
// export const JGTriggerSizes: int[] = [100, 90, 85, 80, 75];




export const NTTotalGameTime : int= 30;
export const NTTotalSuccessCount : int= 5;
// 실제
export const NTSliderSpeeds: float[] = [.2, .3, .4, .5, .6];
export const NTTriggerSizes : int[] = [100, 80, 65, 45, 25];
// 테스트용 
// export const NTSliderSpeeds: float[] = [.2, .2, .2, .2, .2];
// export const NTTriggerSizes: int[] = [100, 90, 85, 80, 75];

const WaitS1 = new WaitForSeconds(1);
export enum WrapManager {
    JG = 0,
    NT = 1,
}

export default class UIHallGameControl extends ZepetoScriptBehaviour {


    public testStartButton: Button;

    public timerLabel: TextMeshProUGUI;
    public successLabel: TextMeshProUGUI;
    public readyLabel: TextMeshProUGUI;
    public timgDesc: TextMeshProUGUI;
    private localizer: LocalizeExternText;

    public contorlSlider: Slider;
    public buttonTap: Button;
    public readyLabelObject: GameObject;
    
    public readyLabelTransfrom: RectTransform;

    public readyLabelParent: GameObject;
    public readyControl: Animation;

    public sliderCheckObject: GameObject;
    private sliderCorrectCheck: SliderCorrectCheck;


    public kickButtonImage: GameObject;
    public buttonStart : Button;


    public totalCount: int = 5;
    public sliderSpeed: float = 0.5;
    

    private correctCount: int = 0;
    private isGameStart: bool = false;
    private isSliderStop: bool = false;
    private sliderCoroutine: Coroutine = null;
    private resultCoroutine: Coroutine = null;
    private timerCoroutine: Coroutine = null;

    private tsRemained : TimeSpan = null;

    private totalGameTime : int;
    private totalSuccessCount : int;
    private sliderSpeeds: float[]; // test용
    private triggerSizes: int[];    
    private milisec : number = 99999;


    private _minigameManager: HallMGManagerInterface = null;
    public get minigameManager(): HallMGManagerInterface {
        return this._minigameManager;        
    }

    public set minigameManager(value: HallMGManagerInterface) {

        // on post move
        this.contorlSlider.value = 0.25;                
        this.readyLabel.text = '';

        if(!this.localizer) {
            const localizer = this.timgDesc.transform.GetComponent<LocalizeExternText>();
            localizer.RemoteStart();
            this.localizer = localizer;
        }


        if( value instanceof MinigameJGManager ) {

            mgLog.log('set control MinigameJGManager');
            this.totalGameTime = JGTotalGameTime;
            this.totalSuccessCount = JGTotalSuccessCount;
            this.sliderSpeeds = [...JGSliderSpeeds] ;
            this.triggerSizes = [...JGTriggerSizes] ;

            // '타이밍에 맞춰 Kick 버튼을 눌러주세요'
            this.timgDesc.text = this.localizer.textList[1];
            this.wrapManager = WrapManager.JG;    

            this.kickButtonImage.SetActive(true);

        } else if (value instanceof MinigameNTManager){

            mgLog.log('set control MinigameNTManager');
            this.totalGameTime = NTTotalGameTime;
            this.totalSuccessCount = NTTotalSuccessCount;
            this.sliderSpeeds = [...NTSliderSpeeds ];
            this.triggerSizes = [...NTTriggerSizes ];

            
            // '타이밍에 맞춰 Jump 버튼을 눌러주세요'
            this.timgDesc.text = this.localizer.textList[0];
            this.wrapManager = WrapManager.NT;    

            this.kickButtonImage.SetActive(false);
        }

        this._minigameManager = value;
    }


    private wrapManager : WrapManager = WrapManager.JG;

    Start() {
        mgLog.log('UIHallGameControl start');

        this.readyLabel.text = '';
        this.contorlSlider.value = 0.25;

        this.buttonTap.onClick.AddListener(() => {
            this.OnButtonSliderStop();
        });

        this.testStartButton?.onClick.AddListener(() => {
            this.GameStart();
        });        

        this.buttonStart.onClick.AddListener(() => {
            this.buttonStart.gameObject.SetActive(false);
            this.GameStart();
        });
    }

    // OnEnable()
    // {
    //     mgLog.log('UIHallGameControl OnEnable');
    // }

    // OnDisable()
    // {
    //     mgLog.log('UIHallGameControl OnDisable');
    // }


    public InitControl(): void {

        this.isGameStart = false;

        this.sliderCoroutine = null;
        this.resultCoroutine = null;
        
        this.timerLabel.text = '30:00';        
        this.successLabel.text = `0/${this.totalSuccessCount}`;
        this.contorlSlider.value = 0.25;                
        this.readyLabel.text = '';
        this.correctCount = 0;
        

        this.sliderCorrectCheck = this.sliderCheckObject.GetComponent<SliderCorrectCheck>();
        this.sliderCorrectCheck.SetTriggerSizes(this.triggerSizes);
        this.sliderCorrectCheck.OnSuccessChange(0);
        this.OnSuccessChange(0);        
    }

    public GameReady() {
        this.isGameStart = false;        

        this.StopAllCoroutines();
        this.InitControl();

        this.buttonStart.gameObject.SetActive(true);

    }

    public GameStart(): void {
        this.isGameStart = false;

        this.StopAllCoroutines();
        this.InitControl();
        this.StartCoroutine(this.DoRoutineGameProcess());
    }

    *DoRoutineGameProcess() {
        yield this.StartCoroutine(this.DoRoutineReadyLabel());

        this.isGameStart = true;
        this.StartTimeDescrease(null);        
        this.StartSliderMove();
    }


    public OnSuccessChange(successCount: int): void {
        successCount = Mathf.Clamp(successCount, 0, 4);
        this.sliderSpeed = this.sliderSpeeds[successCount];
    }


    public StartReadyLabel() {
        this.StartCoroutine(this.DoRoutineReadyLabel());
    }


    *DoRoutineReadyLabel() {
        // yield this.StartCoroutine(this.DoRoutineCenterLabel('3'));
        // yield this.StartCoroutine(this.DoRoutineCenterLabel('2'));
        // yield this.StartCoroutine(this.DoRoutineCenterLabel('1'));
        yield this.StartCoroutine(this.DoRoutineCenterLabel('START!'));
    }

    *DoRoutineCenterLabel(lebel: string, color: Color = Color.white) {
        this.readyLabel.text = lebel;
        this.readyLabel.color = color;
        this.readyControl.Play();
        yield new WaitWhile(() => this.readyControl.isPlaying);
        this.readyLabel.text = '';
    }


    public Startlabel() {
        this.StartCoroutine(this.DoRoutine());
    }

    *DoRoutine() {

        let minimum = 0.1;
        let maximum = 2.0;
        let t = 0.0;
        let t2 = minimum;

        //mgLog.log('start');
        while (true) {
            yield null;
            t2 = Mathf.Lerp(minimum, maximum, t);
            this.readyLabelTransfrom.localScale = new Vector3(t2, t2, 1);

            //t += 0.5 * Time.deltaTime;
            t += Time.deltaTime;

            if (t > 1.0) {
                t = 0.0;
                break;
            }
        }
        //mgLog.log('end');

    }

    StartSliderMove() {
        if (this.sliderCoroutine != null) {
            this.StopCoroutine(this.sliderCoroutine);
            this.sliderCoroutine = null;
        }
        this.isSliderStop = false;
        this.sliderCoroutine = this.StartCoroutine(this.DoRoutineSlider());
    }


    public OnButtonSliderStop() {
        if (this.isGameStart == false) {
            mgLog.log('not yet started');
            return;
        }

        if( this.isSliderStop == true) {
            mgLog.log('not yet finish score action');
            return;
        }

        // Tap!
        // game logic
        if (this.resultCoroutine != null) {
            this.StopCoroutine(this.resultCoroutine);
            this.resultCoroutine = null;
        }


        this.isSliderStop = true;

        if (this.sliderCorrectCheck.IsTriggered == true) {
            this.resultCoroutine = this.StartCoroutine(this.DoRoutineResultLabel(true));
            this.correctCount++;
            this.successLabel.text = `${this.correctCount}/${this.totalSuccessCount}`;
            this.sliderCorrectCheck.OnSuccessChange(this.correctCount);
            this.OnSuccessChange(this.correctCount);

            this._minigameManager?.onCorrect();

            
            if( this.correctCount >= this.totalSuccessCount ) {
                this.StopCoroutine(this.timerCoroutine);
                this.timerCoroutine = null;

                this.milisec = 1000 * this.totalGameTime - this.tsRemained.totalMilliseconds;

                mgLog.log(`ms = ${this.milisec}`);

                this.onGameover();
                //this.onResult(milisec);

            }
            
        }
        else {
            this._minigameManager?.onBad();
            this.resultCoroutine = this.StartCoroutine(this.DoRoutineResultLabel(false));
        }
        //this.StartCoroutine(this.DoRoutineResetSlider());
    }


    *DoRoutineResultLabel(isSuccess: bool) {

        // let milisec = 1000 * this.totalGameTime - this.tsRemained.totalMilliseconds;
        // if( this.correctCount >= this.totalSuccessCount ) {
        //     this.StopCoroutine(this.timerCoroutine);
        //     this.timerCoroutine = null;

        //     milisec = 1000 * this.totalGameTime - this.tsRemained.totalMilliseconds;
        //     mgLog.log(`----> DoRoutineResultLabel clear --- ms = ${milisec}`);
        //     this.onGameover();
        // }



        if (isSuccess) {
            //yield this.StartCoroutine(this.DoRoutineCenterLabel('GREAT!', Color.green));
            yield this.StartCoroutine(this.DoRoutineCenterLabel('GREAT!'));
        }
        else {
            //yield this.StartCoroutine(this.DoRoutineCenterLabel('MISS', Color.gray));
            yield this.StartCoroutine(this.DoRoutineCenterLabel('MISS'));
            yield WaitS1;
        }


        if( this.correctCount >= this.totalSuccessCount ) {
            // this.StopCoroutine(this.timerCoroutine);
            // this.timerCoroutine = null;

            // let milisec = 1000 * this.totalGameTime - this.tsRemained.totalMilliseconds;
            // mgLog.log(`ms = ${milisec}`);

            // this.onGameover();

            yield WaitS1;
            yield WaitS1;

            this.onResult(this.milisec);

        }
        else
        {
            this.StartCoroutine(this.DoRoutineResetSlider());
        }

        
    }



    *DoRoutineResetSlider() {
        if (this.isGameStart == false) {
            return;
        }

        //const sliderResetWait = new WaitForSeconds(1);
        yield WaitS1;


        if (this.isGameStart == true)
            this.StartSliderMove();
    }

    *DoRoutineSlider() {
        let minimum = 0.0;
        let maximum = 1.0;
        let t = 0.0;
        let t2 = minimum;

        let begin = minimum;
        let end = maximum;

        //mgLog.log('start');
        while (true) {
            yield null;

            if (this.isSliderStop == true) {
                //mgLog.log(`this.contorlSlider.value == ${this.contorlSlider.value}`);
                return;
            }

            t2 = Mathf.Lerp(begin, end, t);
            this.contorlSlider.value = t2;
            t += this.sliderSpeed * Time.deltaTime;

            if (t2 >= 0.95) {
                begin = maximum;
                end = minimum;
                t = 0.05;
            }

            if (t2 <= 0.05) {
                begin = minimum;
                end = maximum;
                t = 0.05;
            }
        }
    }

    public StartTimeDescrease(result: resultDelegate) {
        if( this.timerCoroutine != null ) {
            this.StopCoroutine(this.timerCoroutine);
            this.timerCoroutine = null;
        }

        this.timerCoroutine = this.StartCoroutine(this.DoRoutineTimeDescrease(result));
    }

    *DoRoutineTimeDescrease(result: resultDelegate) {        
        
        let timegap = 0.01;
        this.tsRemained = TimeSpan.fromSeconds(this.totalGameTime);        
        
        const tsTimeGap = TimeSpan.fromMilliseconds(Time.deltaTime *1000);
        const wait = new WaitForSeconds(timegap);

        while (true) {

            const sec = this.tsRemained.seconds.toString().padStart(2, "0");
            const msec = (Math.floor(this.tsRemained.milliseconds / 10)).toString().padStart(2, "0");          
            this.timerLabel.text = `${sec}:${msec}`;

            yield null;

            this.tsRemained = this.tsRemained.subtract(tsTimeGap);
            if (this.tsRemained.totalMilliseconds < 0) {
                break;
            }
        }

        mgLog.log("TIME\'S UP!");
        this.onGameover();
        yield this.StartCoroutine(this.DoRoutineCenterLabel('TIME\'S UP!'));
        this.onResult(1000 * this.totalGameTime);
    }
    onGameover() : void
    {
        //mgLog.log("onGameover");
        this.isSliderStop = true;
        if (this.sliderCoroutine != null) {
            this.StopCoroutine(this.sliderCoroutine);
            this.sliderCoroutine = null;
        }
        this.isGameStart = false;
    }

    onResult(resultMs : number ) : void
    {
        let resultSuccess = false;
        if( this.correctCount >= this.totalSuccessCount) {
            resultSuccess = true;    
        }

        this._minigameManager.showResult( resultMs, this.correctCount, resultSuccess );        

        //mgLog.log(`onResult = ${resultMs}`);
        //this._minigameManager.onGameClear(resultMs);
    }

}



