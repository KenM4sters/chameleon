import { SamplerResource, Texture, UniformResource } from "../common/context";
import { ResourceAccessType, ResourceType, TextureResourceProps, UniformResourceProps, VertexData, WriteFrequency } from "../../graphics";


export class GLUniformResource extends UniformResource 
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

    public update(data: number | string | VertexData): void 
    {
        this.data = data;
    }

    public override getName() : string { return this.name; } 
    public override getType() : ResourceType {return this.type; }
    public override getAccessType() : ResourceAccessType { return this.accessType}
    public override getWriteFrequency() : WriteFrequency { return this.writeFrequency}
    public getData() : number | string | VertexData { return this.data; }
    
    private name : string;
    private type : ResourceType;
    private writeFrequency : WriteFrequency;
    private accessType : ResourceAccessType;
    private data : number | string | VertexData;
}


export class GLSamplerResource extends SamplerResource 
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

    public update(texture: Texture): void 
    {
        
    }

    public override getName() : string { return this.name; } 
    public override getType() : ResourceType {return this.type; }
    public override getAccessType() : ResourceAccessType { return this.accessType}
    public override getWriteFrequency() : WriteFrequency { return this.writeFrequency}
    public getTexture() : Texture { return this.texture; }

    private name : string;
    private type : ResourceType;
    private writeFrequency : WriteFrequency;
    private accessType : ResourceAccessType;
    private texture !: Texture;
}

