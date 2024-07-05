/**
 * @brief The way the engine works is by taking in a derived instance of this IScript class
 * and calling it's intialize method. The user needs to setup their own class that inherits
 * from this and defines an appropriate instantiation and render loop methods.
 */
export declare abstract class IScript {
    constructor();
    /**
     * @brief This function should be defined within the derived class and should intialize
     * all scene objects.
     */
    abstract Initialize(): void;
    /**
     * @brief This is the main loop function that Dragon will, provided that you've set it
     * with dragon.SetAnimationLoop(). Techincally, you could set it to be any function.
     * dragon.Update() is the only function that must be called within this Loop.
     * @param elapsedTime Time since the start of the application.
     * @param timeStep Time between each frame.
     */
    abstract Loop(elapsedTime: number, timeStep: number): void;
    isReady: boolean;
}
