import { View } from "./portfolio";


let onViewChangeCallbacks : ((view : View) => void)[] = [];

let currentView : View = "about";

export abstract class StateResponder 
{
    protected constructor() {}

    protected onViewChange(callback: (view : View) => void) : void 
    {
        onViewChangeCallbacks.push(callback);
    }

    protected triggerViewChange(view : View) : void 
    {
        if(view == currentView) 
        {
            return;
        }

        currentView = view;
        
        onViewChangeCallbacks.forEach(callback => callback(view));
    }

    protected getCurrentView() : View { return currentView; }
}