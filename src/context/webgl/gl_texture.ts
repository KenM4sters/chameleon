import { Texture } from "../common/context";
import { Format, InternalFormat, TargetType, TextureProps, Usage, ValueType } from "../../graphics";
import { g_glFormats, g_glInternalFormats, g_glTargetTypes, g_glValueTypes, gl } from "./gl_context";
import { GLSampler } from "./gl_sampler";



class GLTexture extends Texture 
{
    constructor() 
    {
        super();

        this.texture = 0;
        this.target = TargetType.Texture2D;
        this.format = Format.RGBA;
        this.width = 0;
        this.height = 0;
        this.internalFormat = InternalFormat.RGBA32F;
        this.type = ValueType.Float;
        this.nMipMaps = 0;
        this.level = 0;
        this.usage = Usage.ReadWrite;
        this.isCube = false;
    }

    public override create(props: TextureProps): void 
    {
        this.target = props.target;
        this.format = props.format;
        this.width = props.width;
        this.height = props.height;
        this.internalFormat = props.internalFormat;
        this.type = props.type;
        this.nMipMaps = props.nMipMaps;
        this.level = props.level;
        this.usage = props.usage;

        this.sampler = props.sampler as GLSampler;

        const texture = gl.createTexture();

        if(!texture)
        {
            throw new Error("Failed to create texture object!");
        }

        this.texture = texture;

        gl.bindTexture(g_glTargetTypes[this.target], this.texture);
        gl.bindSampler(0, this.sampler.getContextHandle());
        
        if(this.target == TargetType.TextureCube) 
        {
            for(let i = 0; i < 6; i++) 
            {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X + i, this.level, g_glInternalFormats[this.internalFormat], this.width, this.height, 0, g_glFormats[this.format], g_glValueTypes[this.type], null);
            }

            this.isCube = true;
        }
        else 
        {               
            gl.texImage2D(g_glTargetTypes[this.target], this.level, g_glInternalFormats[this.internalFormat], this.width, this.height, 0, g_glFormats[this.format], g_glValueTypes[this.type], null);
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 512, 512, 0, gl.RGBA, gl.FLOAT, null);
        }

        if(this.nMipMaps > 0) 
        {
            gl.generateMipmap(g_glTargetTypes[this.target]);
        }
        
        gl.bindTexture(g_glTargetTypes[this.target], null);
    }

    public override destroy(): void 
    {
        gl.bindTexture(g_glTargetTypes[this.target], null);
        gl.deleteTexture(this.texture);
    }

    public override resize(width: number, height: number): void 
    {
        
    }

    public getContextHandle() : WebGLTexture 
    { 
        return this.texture;
    } 
    
    public isCubeTexture() : boolean { return this.isCube; }
    public getWidth() : number { return this.width; }
    public getHeight() : number { return this.height; }
    public getInternalFormat() : InternalFormat { return this.internalFormat; }
    public getFormat() : Format { return this.format; }
    public getLevel() : number { return this.level; }
    public getType() : ValueType { return this.type; }
    public getTarget() : TargetType { return this.target; }
    public getMipMapCount() : number { return this.height; }
    public getUsage() : Usage { return this.usage; }
    public getSampler() : GLSampler { return this.sampler; }
    

    private texture : WebGLTexture;
    private target : TargetType;
    private format : Format;
    private width : number;
    private height : number;
    private internalFormat : InternalFormat;
    private type : ValueType;
    private nMipMaps : number;
    private level : number;
    private usage : Usage;
    private sampler !: GLSampler;

    private isCube : boolean;
};


export 
{
    GLTexture
}