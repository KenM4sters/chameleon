type MouseCallback = (event: MouseEvent) => void;
type ScrollCallback = (event: WheelEvent) => void;
type KeyCallback = (event: KeyboardEvent) => void;
export declare class Input {
    private constructor();
    AddMouseMoveCallback(callback: MouseCallback): void;
    AddMouseUpCallback(callback: MouseCallback): void;
    AddMouseDownCallback(callback: MouseCallback): void;
    AddScrollCallback(callback: ScrollCallback): void;
    AddKeyDownCallback(callback: KeyCallback): void;
    private OnMouseMove;
    private OnMouseUp;
    private OnMouseDown;
    private OnScroll;
    private OnKeyDown;
    static GetInstance(): Input;
    private static instance;
    private mouseMoveCallbacks;
    private mouseDownCallbacks;
    private mouseUpCallbacks;
    private scrollCallbacks;
    private keyDownCallbacks;
}
export {};
