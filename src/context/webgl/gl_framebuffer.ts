import { FrameBuffer, Texture } from "../common/context";
import { Attachment, Format, FrameBufferAttachment, FrameBufferProps, SamplerFilterMode, ValueType } from "../../graphics";
import { g_glAttachments, g_glFormats, g_glTargetTypes, g_glValueTypes, gl } from "./gl_context";
import { GLTexture } from "./gl_texture";


export class GLFrameBuffer extends FrameBuffer 
{
    constructor() 
    {
        super();

        this.fbo = 0;
        this.attachments = [];
        this.count = 0;
    }

    public override create(props: FrameBufferProps): void 
    {

        this.attachments = props.attachments;

        const fbo = gl.createFramebuffer();

        if(!fbo) 
        {
            throw new Error("Failed to create frame buffer object");
        }

        this.fbo = fbo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

        this.attachments.forEach((attachment : FrameBufferAttachment) => 
        {
            const texture = attachment.texture as GLTexture;            
            gl.framebufferTexture2D(gl.FRAMEBUFFER, g_glAttachments[attachment.attachment], g_glTargetTypes[texture.getTarget()], texture.getContextHandle(), texture.getLevel());

            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) 
            {
                console.error("Framebuffer is not complete");
            } 
            else 
            {
                console.log("Framebuffer is complete");
            }
        });

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    public override drawAttachments() : void 
    {
        let attachments = [];

        for(const itr of this.attachments) 
        {
            if(itr.attachment <= Attachment.Color3)
            {
                attachments.push(g_glAttachments[itr.attachment]);
            }
        }
                
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.drawBuffers(attachments);
    }

    public override readPixels(attachment : Attachment, x : number, y : number, width: number, height : number, format : Format, type : ValueType, buffer : Float32Array) : void 
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.readBuffer(g_glAttachments[attachment]);
        gl.readPixels(x, y, width, height, g_glFormats[format], g_glValueTypes[type], buffer);
    }

    public override blit(
        srcOffsetX : number, srcOffsetY : number, srcWidth : number, srcHeight : 
        number, dstOffsetX : number, dstOffsetY : number, dstWidth : number, dstHeight : number, 
        filter : SamplerFilterMode, texture : Texture
    ) : void 
    {

    }

    public override clear() : void 
    {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }


    public override resize(width: number, height: number): void 
    {
        
    }

    public override destroy(): void 
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
        gl.deleteFramebuffer(this.fbo);    

        this.attachments.forEach((attachment : FrameBufferAttachment) => 
        {
            attachment.texture.destroy();
        })
    }

    public getContextHandle() : WebGLFramebuffer { return this.fbo; }

    private fbo : WebGLFramebuffer;
    private attachments : FrameBufferAttachment[];
    private count : number;
}
