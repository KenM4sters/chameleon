import { FrameBuffer } from "../common/context";
import { FrameBufferAttachment, FrameBufferProps } from "../../graphics";
import { g_glAttachments, g_glTargetTypes, gl } from "./gl_context";
import { GLTexture } from "./gl_texture";



class GLFrameBuffer extends FrameBuffer 
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

export 
{
    GLFrameBuffer
}