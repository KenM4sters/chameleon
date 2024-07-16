import { Resource, Texture, UniformBuffer } from "../../graphics";
import { ResourceProps, ResourceType, VertexData } from "../../types";


abstract class GLResource extends Resource 
{
    constructor() 
    {
        super();
    }

    public abstract create(props: ResourceProps): void;

    public abstract destroy(): void;
}

class GLUniformResource extends GLResource 
{
    constructor()
    {
        super();

        this.name = "default_uniform";
        this.type = "Float";
    }

    public override create(props: ResourceProps): void 
    {
        
    }

    public override destroy(): void 
    {
        
    }

    public override update(data: VertexData): void 
    {
        
    }

    public override getName() : string { return this.name; } 
    public override getType() : ResourceType { return this.type; } 
    public getBuffer() : UniformBuffer { return this.uniformBuffer; }

    private name : string;
    private type : ResourceType;
    private uniformBuffer !: UniformBuffer;
}


class GLTextureResource extends GLResource 
{
    constructor()
    {
        super();

        this.name = "default_texture";
        this.type = "Sampler";
    }

    public override create(props: ResourceProps): void 
    {
        
    }

    public override destroy(): void 
    {
        
    }

    public override update(data: VertexData): void 
    {
        
    }

    public override getName() : string { return this.name; } 
    public override getType() : ResourceType { return this.type; } 
    public getBuffer() : Texture { return this.texture; }

    private name : string;
    private type : ResourceType;
    private texture !: Texture;
}


export {GLResource, GLUniformResource, GLTextureResource}