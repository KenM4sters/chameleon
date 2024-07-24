import { View } from "./portfolio";

export abstract class StateResponder 
{
    protected constructor() 
    {
        if (StateResponder.instance) 
        {
            return StateResponder.instance;
        }
        
        StateResponder.instance = this;
    }

    protected onViewChange(callback: (view : View) => void) : void 
    {
        this.onViewChangeCallbacks.push(callback);
    }

    protected triggerViewChange(view : View) : void 
    {
        if(view == this.currentView) 
        {
            return;
        }

        this.currentView = view;

        this.onViewChangeCallbacks.forEach(callback => callback(view));
    }

    private static instance : StateResponder | null;

    private onViewChangeCallbacks : ((view : View) => void)[] = [];

    protected currentView : View = "home";
}