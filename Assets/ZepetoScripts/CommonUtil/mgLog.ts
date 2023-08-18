export class mgLog {    
    private static logDisable: bool = false;
    static log(...data: any[]): void {
        if (this.logDisable == true)
            return;

        data.unshift('<color=cyan>');
        data.push('</color>');                
        
        console.log(data);
    }

    static warn(...data: any[]): void {
        if (this.logDisable == true)
            return;


        data.unshift('<color=lime>');
        data.push('</color>');                
        
        console.warn(data);
    }

    static error(...data: any[]): void {
        if (this.logDisable == true)
            return;


        data.unshift('<color=orange>');
        data.push('</color>');                
    
        console.error(data);
    }
}





