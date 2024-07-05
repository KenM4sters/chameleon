import { TextureImageData } from 'three/src/textures/types.js';
export default class Assets {
    private constructor();
    LoadAllAssets(callback: () => void): void;
    private UpdateStatus;
    GetTexture(name: string): HTMLImageElement | TextureImageData | undefined;
    static GetInstance(): Assets;
    private static instance;
    private textures;
    private status;
}
