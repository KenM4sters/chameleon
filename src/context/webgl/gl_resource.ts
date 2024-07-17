import { Resource, Texture } from "../common/context";
import { ResourceAccessType, TextureResourceProps, UniformResourceProps, UniformType, VertexData, WriteFrequency } from "../../graphics";


export abstract class GLResource extends Resource 
{
    constructor() 
    {
        super();
    }

    public abstract destroy(): void;
    public abstract getType() : UniformType;
    public abstract getAccessType() : ResourceAccessType;
    public abstract getWriteFrequency() : WriteFrequency;
}

export class GLUniformResource extends GLResource 
{
    constructor()
    {
        super();

        this.name = "default_uniform";
        this.type = "Float";
        this.writeFrequency = WriteFrequency.Dynamic;
        this.accessType = ResourceAccessType.PerDrawCall;
        this.data = 0;
    }

    public create(props: UniformResourceProps): void 
    {
        this.name = props.name;
        this.type = props.type;
        this.writeFrequency = WriteFrequency.Dynamic;
        this.accessType = ResourceAccessType.PerDrawCall;
        this.data = props.data;
    }

    public override destroy(): void 
    {
        
    }

    public update(data: VertexData): void 
    {
        this.data = data;
    }

    public override getName() : string { return this.name; } 
    public override getType() : UniformType {return this.type; }
    public override getAccessType() : ResourceAccessType { return this.accessType}
    public override getWriteFrequency() : WriteFrequency { return this.writeFrequency}
    public getData() : number | string | VertexData { return this.data; }
    
    private name : string;
    private type : UniformType;
    private writeFrequency : WriteFrequency;
    private accessType : ResourceAccessType;
    private data : number | string | VertexData;
}


export class GLTextureResource extends GLResource 
{
    constructor()
    {
        super();

        this.name = "default_texture";
        this.type = "Sampler";
        this.writeFrequency = WriteFrequency.Dynamic;
        this.accessType = ResourceAccessType.PerDrawCall;
    }

    public create(props: TextureResourceProps): void 
    {
        this.name = props.name;
        this.writeFrequency = WriteFrequency.Dynamic;
        this.accessType = ResourceAccessType.PerDrawCall;
        this.texture = props.texture;
    }

    public override destroy(): void 
    {
        
    }

    public update(data: VertexData): void 
    {
        
    }

    public override getName() : string { return this.name; } 
    public override getType() : UniformType {return this.type; }
    public override getAccessType() : ResourceAccessType { return this.accessType}
    public override getWriteFrequency() : WriteFrequency { return this.writeFrequency}
    public getTexture() : Texture { return this.texture; }

    private name : string;
    private type : UniformType;
    private writeFrequency : WriteFrequency;
    private accessType : ResourceAccessType;
    private texture !: Texture;
}

