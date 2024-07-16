import { Sampler } from "../../graphics";
import { SamplerAddressMode, SamplerFilterMode, SamplerProps } from "../../types";
import { g_glSamplerAddressModes, g_glSamplerFilterModes, gl } from "./gl_context";


class GLSampler extends Sampler 
{
    constructor() 
    {
        super();

        this.addressModeS = SamplerAddressMode.ClampToEdge;
        this.addressModeT = SamplerAddressMode.ClampToEdge;
        this.addressModeR = SamplerAddressMode.ClampToEdge;
        this.minFilter = SamplerFilterMode.Linear;
        this.magFilter = SamplerFilterMode.Linear;

        this.sampler = 0;

    }

    public override create(props: SamplerProps): void 
    {

        this.addressModeS = props.addressModeS;
        this.addressModeT = props.addressModeT;
        this.addressModeR = props.addressModeR;
        this.minFilter = props.minFilter;
        this.magFilter = props.magFilter;

        let id = gl.createSampler();

        if(!id) 
        {
            throw new Error("Failed to create sampler!");
        }

        this.sampler = id;

        gl.bindSampler(gl.TEXTURE_2D, this.sampler);

        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_S, g_glSamplerAddressModes[this.addressModeS]);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_T, g_glSamplerAddressModes[this.addressModeT]);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_R, g_glSamplerAddressModes[this.addressModeR]);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_MIN_FILTER, g_glSamplerFilterModes[this.minFilter]);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_MAG_FILTER, g_glSamplerFilterModes[this.magFilter]);

        gl.bindSampler(gl.TEXTURE_2D, 0);
    }

    public override update(props: SamplerProps): void 
    {
        this.addressModeS = props.addressModeS;
        this.addressModeT = props.addressModeT;
        this.addressModeR = props.addressModeR;
        this.minFilter = props.minFilter;
        this.magFilter = props.magFilter;

        gl.bindSampler(gl.TEXTURE_2D, this.sampler);

        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_S, g_glSamplerAddressModes[this.addressModeS]);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_T, g_glSamplerAddressModes[this.addressModeT]);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_R, g_glSamplerAddressModes[this.addressModeR]);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_MIN_FILTER, g_glSamplerFilterModes[this.minFilter]);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_MAG_FILTER, g_glSamplerFilterModes[this.magFilter]);
        
        gl.bindSampler(gl.TEXTURE_2D, 0);  
    }

    public override detroy(): void 
    {
        gl.bindSampler(gl.TEXTURE_2D, 0);
        gl.deleteSampler(this.sampler);
    }


    public getContextHandle() : WebGLSampler { return this.sampler; }

    
    private addressModeS : SamplerAddressMode;
    private addressModeT : SamplerAddressMode;
    private addressModeR : SamplerAddressMode;
    private minFilter : SamplerFilterMode;
    private magFilter : SamplerFilterMode;
    private sampler : WebGLSampler;
}


export {
    GLSampler
}