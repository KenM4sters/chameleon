import { Ref } from "../../types";
import { IFramebuffer } from "../framebuffer";
import { GLRenderer } from "./gl_renderer";
import { GLTexture, GLTexture2D, GLTextureCube } from "./gl_texture";


export interface GLFramebufferBlueprint 
{
    targetTexture : GLTexture;
    attachment : number;
    renderbufferBlueprint : RenderbufferBlueprint | null;
}; 

export interface RenderbufferBlueprint 
{
    width : number;
    height : number;
    format : number;
    attachmentType : number;
};

export class Framebuffer extends IFramebuffer
{
    constructor(createInfo : GLFramebufferBlueprint) 
    {
        super();

        this.gl = GLRenderer.gl;

        // Create native framebuffer id
        //
        const framebufferId = this.gl.createFramebuffer();

        if(!framebufferId) 
        {
            throw new Error("Failed to create framebuffer!");
        }

        this.framebufferId = {val: framebufferId};
        this.renderbufferId = {val: null};
        this.blueprint = createInfo;


        // Create native framebuffer
        //
        const texInfo = createInfo.targetTexture.blueprint;
        this.gl.bindTexture(texInfo.dimension, createInfo.targetTexture.id.val); 
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
        
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, createInfo.attachment, 
            createInfo.targetTexture.blueprint.dimension, 
            createInfo.targetTexture.id.val, 0); 
        
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindTexture(texInfo.dimension, null);
        

        // Check for any errors.
        //
        const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);

        if (status != this.gl.FRAMEBUFFER_COMPLETE) 
        {
            console.error('Framebuffer is not complete: ' + status.toString(16));
        }   


        // Create render buffer if the createInfo contains a renderbufferBlueprint.
        //
        if(createInfo.renderbufferBlueprint) 
        {            
            this.blueprint.renderbufferBlueprint = createInfo.renderbufferBlueprint;
    
            const renderbufferId = this.gl.createRenderbuffer();
    
            if(!renderbufferId) 
            {
                throw new Error("Failed to create framebuffer!");
            }
    
            this.renderbufferId = {val: renderbufferId};
    
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbufferId.val);
    
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, createInfo.renderbufferBlueprint.format, createInfo.renderbufferBlueprint.width, createInfo.renderbufferBlueprint.height);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, createInfo.renderbufferBlueprint.attachmentType, this.gl.RENDERBUFFER, this.renderbufferId.val);
            
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        }
    }

    /**
     * @brief Resizes the renderbuffer if it exists and the texture that's currently set as the 
     * attachment. This can be changed by calling SetAttachment().
     * @param width The new width to resize to.
     * @param height The new height to resize to.
     */
    public Resize(width : number, height : number) : void 
    {
        this.blueprint.targetTexture.Resize(width, height);

        if(this.blueprint.renderbufferBlueprint) 
        {
            this.blueprint.renderbufferBlueprint.width = width;
            this.blueprint.renderbufferBlueprint.height = height;

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbufferId.val);
    
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.blueprint.renderbufferBlueprint.format, this.blueprint.renderbufferBlueprint.width, this.blueprint.renderbufferBlueprint.height);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.blueprint.renderbufferBlueprint.attachmentType, this.gl.RENDERBUFFER, this.renderbufferId.val);
        }
    }

    /**
     * @brief Sets the attachment that this framebuffer will draw to.
     * @note A resize will automatically be triggered when calling this function.
     * @param texture The new texture to draw to.
     * @param attachment The attachment unit that this texture will be attached to.
     * @param level 
     */
    public SetAttachment(texture : GLTexture2D | GLTextureCube, attachment : number, level : number = 0) 
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachment, 
            texture.blueprint.dimension, 
            texture.id.val, level); 

        this.Resize(texture.blueprint.width, texture.blueprint.height);
    }

    /**
     * @brief Sets the attachment that any proceeding draw calls will draw to.
     * @param attachmentUnit An array of units to draw to (usually just an array of one).
     */
    public DrawToAttachment(attachmentUnit : number[]) 
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebufferId.val);
        this.gl.drawBuffers(attachmentUnit);
    }

    /**
     * @brief Deletes the framebuffer, renderbuffer AND the texture that's currently attached.
     */
    public Destroy() : void 
    {
        this.gl.deleteFramebuffer(this.framebufferId.val);
        this.gl.deleteRenderbuffer(this.renderbufferId.val);
        
        if(this.blueprint) 
        {
            this.blueprint.targetTexture.Destroy();
        }
    }

    public readonly blueprint : GLFramebufferBlueprint;
    public readonly framebufferId : Ref<WebGLFramebuffer>;
    public readonly renderbufferId : Ref<WebGLRenderbuffer | null>;

    private gl : WebGL2RenderingContext;
};


