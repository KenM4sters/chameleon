import { Ref } from "../../utils";
import { ITexture } from "../texture";
import { GLRenderer } from "./gl_renderer";

export interface GLTextureBlueprint 
{
    dimension : number;
    format : number;  
    width : number;
    height : number;
    nChannels : number;
    type: number;
    data : Float32Array | Uint8Array | Uint16Array | Uint32Array | null;
    samplerInfo : GLTextureSamplerBlueprint
};

export interface GLTextureSamplerBlueprint 
{
    minFilter : number;
    magFilter : number;
    sWrap : number;
    tWrap : number;
    rWrap : number;
};



export abstract class GLTexture extends ITexture
{
    constructor(blueprint : GLTextureBlueprint) 
    {
        super();

        this.blueprint = blueprint;

        this.gl = GLRenderer.gl;

        const texture = this.gl.createTexture();

        if(!texture) 
        {
            throw new Error("Failed to create texture!");
        }

        this.id = {val: texture};
    }

    public Destroy() : void
    {
        this.gl.deleteTexture(this.id.val);
    }

    public readonly blueprint : GLTextureBlueprint;
    public readonly id : Ref<WebGLTexture>;

    protected gl : WebGL2RenderingContext;
};


export class GLTexture2D extends GLTexture
{   
    constructor(blueprint : GLTextureBlueprint) 
    {
        super(blueprint);

        this.gl.bindTexture(this.blueprint.dimension, this.id.val);

        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_MIN_FILTER, this.blueprint.samplerInfo.minFilter);
        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_MAG_FILTER, this.blueprint.samplerInfo.magFilter);
        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_WRAP_S, this.blueprint.samplerInfo.sWrap);
        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_WRAP_T, this.blueprint.samplerInfo.tWrap);

        this.gl.pixelStorei(this.gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this.gl.NONE);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        this.gl.texImage2D(this.blueprint.dimension, 0, this.blueprint.format, this.blueprint.width, this.blueprint.height, 0, this.blueprint.nChannels, this.blueprint.type, this.blueprint.data);
        
        // Check for texture errors
        if (this.gl.getError() !== this.gl.NO_ERROR) 
        {
            console.error("Error with texture binding or creation");
        }

        this.gl.bindTexture(this.blueprint.dimension, null);
    } 

    public override Resize(width: number, height: number): void 
    {
        
        this.gl.bindTexture(this.blueprint.dimension, this.id.val);
        this.gl.texImage2D(this.blueprint.dimension, 0, this.blueprint.format, this.blueprint.width, this.blueprint.height, 0, this.blueprint.nChannels, this.blueprint.type, this.blueprint.data);

        // Check for texture errors
        if (this.gl.getError() !== this.gl.NO_ERROR) 
        {
            console.error("Error with texture binding or creation");
        }
        
        this.gl.bindTexture(this.blueprint.dimension, null);   
    }
};





export class GLTextureCube extends GLTexture 
{
    constructor(blueprint : GLTextureBlueprint) 
    {
        super(blueprint);

        this.gl.bindTexture(this.blueprint.dimension, this.id.val);

        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_MIN_FILTER, this.blueprint.samplerInfo.minFilter);
        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_MAG_FILTER, this.blueprint.samplerInfo.magFilter);
        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_WRAP_S, this.blueprint.samplerInfo.sWrap);
        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_WRAP_T, this.blueprint.samplerInfo.tWrap);
        this.gl.texParameteri(this.blueprint.dimension, this.gl.TEXTURE_WRAP_R, this.blueprint.samplerInfo.rWrap);

        this.gl.pixelStorei(this.gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this.gl.NONE);
        
        for(let i = 0; i < 6; i++) 
        {
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.blueprint.format, this.blueprint.width, this.blueprint.height, 0, this.blueprint.nChannels, this.blueprint.type, this.blueprint.data);

            // Check for texture errors
            if(this.gl.getError() !== this.gl.NO_ERROR) 
            {
                console.error("Error with texture binding or creation");
            }
        }
        
        this.gl.bindTexture(this.blueprint.dimension, null);
    } 

    public override Resize(width: number, height: number): void 
    {
        
        this.blueprint.width = width;
        this.blueprint.height = height;
        
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.id.val);

        for(let i = 0; i < 6; i++) 
        {
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.blueprint.format, this.blueprint.width, this.blueprint.height, 0, this.blueprint.nChannels, this.blueprint.type, this.blueprint.data);

            // Check for texture errors
            if(this.gl.getError() !== this.gl.NO_ERROR) 
            {
                console.error("Error with texture binding or creation");
            }
        }
    }
}

