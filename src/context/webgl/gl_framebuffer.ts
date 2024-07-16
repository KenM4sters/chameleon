import { FrameBuffer } from "../../graphics";
import { Attachment, FrameBufferAttachment, FrameBufferProps } from "../../types";
import { g_glAttachments, gl } from "./gl_context";
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

            if(texture.isTexture()) 
            {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, g_glAttachments[attachment.attachment], texture.getTarget(), texture.getContextHandle() as WebGLTexture, texture.getLevel());
            }
            else 
            {
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, g_glAttachments[attachment.attachment], texture.getTarget(), texture.getContextHandle() as WebGLRenderbuffer);
            }
        })
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

    private fbo : WebGLFramebuffer;
    private attachments : FrameBufferAttachment[];
    private count : number;
}

export 
{
    GLFrameBuffer
}