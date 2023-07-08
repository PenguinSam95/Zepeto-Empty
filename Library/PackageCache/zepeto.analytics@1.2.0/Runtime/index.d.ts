//# signature=ZEPETO.Analytics#6e6ed3691a5533c14d7d891900ff8cc8#0.0.4
// @ts-nocheck
declare module 'ZEPETO.Analytics' {

    import * as System from 'System';
    import * as System_Threading_Tasks from 'System.Threading.Tasks';
    import * as UnityEngine from 'UnityEngine';
        
    
    class ZepetoBaseAnalytics extends System.Object {
        
        public SetDebugMode($debugMode: boolean):void;
        
        public Initialize($settings: ZepetoAnalyticsSettings):void;
        
        public LogEvent($name: string):System_Threading_Tasks.Task;
        
        public LogEvent($name: string, $parameterName: string, $parameterValue: string):System_Threading_Tasks.Task;
        
        public LogEvent($name: string, $parameterName: string, $parameterValue: number):System_Threading_Tasks.Task;
        
        public LogEvent($name: string, $parameterName: string, $parameterValue: boolean):System_Threading_Tasks.Task;
        
        public LogEvent($name: string, $payload: any):System_Threading_Tasks.Task;
        
        public LogEvent<T>($name: string, $payload: T):System_Threading_Tasks.Task;
        
        public SetAnalyticsCollectionEnabled($enabled: boolean):void;
        
        public SendDuration($name: string, $duration: number):System_Threading_Tasks.Task;
        
        public SetUserProperty($name: string, $property: string):void;
        
        public SetUserProperty($name: string, $property: number):void;
        
        public SetUserProperty($name: string, $property: boolean):void;
        
        public SetUserId($userId: string):void;
        
                    
    }
    
    class ZepetoAnalyticsSettings extends System.Object {
        
        public static ClientId: string;
        
        public constructor();
        
                    
    }
    
    class ZepetoGoogleAnalytics extends ZepetoBaseAnalytics {
        
        public constructor();
        
                    
    }
    
    class ZepetoGoogleAnalyticsSettings extends ZepetoAnalyticsSettings {
        
        public apiSecret: string;
        
        public measurementId: string;
        
        public constructor();
        
                    
    }
    
    enum AnalyticsType { GoogleAnalytics = 1 }
    
    class ZepetoAnalyticsComponent extends UnityEngine.MonoBehaviour {
        
        public type: number;
        
        public isDebugMode: boolean;
        
        public googleAnalyticsSetting: ZepetoGoogleAnalyticsSettings;
        
        public constructor();
        
        public Analytics($type: AnalyticsType):ZepetoBaseAnalytics;
        
                    
    }
    
}
declare module 'System' {

        
    
    interface Object {
        
                    
    }
    
    interface Void extends ValueType {
        
                    
    }
    
    interface ValueType extends Object {
        
                    
    }
    
    interface Boolean extends ValueType {
        
                    
    }
    
    interface String extends Object {
        
                    
    }
    
    interface Double extends ValueType {
        
                    
    }
    
    interface Enum extends ValueType {
        
                    
    }
    
    interface Int32 extends ValueType {
        
                    
    }
    
    interface Array extends Object {
        
                    
    }
    
}
declare module 'System.Threading.Tasks' {

    import * as System from 'System';
        
    
    interface Task extends System.Object {
        
                    
    }
    
}
declare module 'UnityEngine' {

    import * as System from 'System';
        
    /**
     * MonoBehaviour is the base class from which every Unity script derives.
     */
    interface MonoBehaviour extends Behaviour {
        
                    
    }
    /**
     * Behaviours are Components that can be enabled or disabled.
     */
    interface Behaviour extends Component {
        
                    
    }
    /**
     * Base class for everything attached to GameObjects.
     */
    interface Component extends Object {
        
                    
    }
    /**
     * Base class for all objects Unity can reference.
     */
    interface Object extends System.Object {
        
                    
    }
    
}

