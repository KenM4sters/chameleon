
export interface ProjectProps 
{
    divId : string;
    title : string;
    brief : string;
    techStack : string;
    features : string;
    date : string;
    github : string;
    status : string;
    mainImage : string;
    codeSnippet1 : string;
    codeSnippet2 : string;
    codeSnippet3 : string;
    motivation : string;
};

export class Project 
{
    constructor(props : ProjectProps) 
    {
        this.props = props;

        this.html = 
        `
        <div class="project_container">
            <div class="project_landing_container">
                <div class="project_details_container">
                    <div class="project_details_description_container">
                        <h6> ${this.props.title} </h6>
                        <p>
                            ${this.props.brief}
                        </p>
                    </div>
                    <div class="project_details_metadata_container">
                        <div class="project_details_metadata_item">
                            <h6> Features </h6>
                            <h6> ${this.props.features} </h6>
                        </div>
                        <div class="project_details_metadata_item">
                            <h6> Tech Stack </h6>
                            <h6> ${this.props.techStack} </h6>
                        </div>
                        <div class="project_details_metadata_item">
                            <h6> Date </h6>
                            <h6> ${this.props.date} </h6>
                        </div>
                        <div class="project_details_metadata_item">
                            <h6> Source Code </h6>
                            <a href="${this.props.github}">github repo</a>
                        </div>
                        <div class="project_details_metadata_item">
                            <h6> Status </h6>
                            <h6> ${this.props.status} </h6>
                        </div>
                    </div>
                </div>
                <div class="project_image_container">
                    <img class="project_image" src=${this.props.mainImage} />
                </div>
            </div>
            <div class="project_extras_container">
                <div class="project_motivation_container">
                    <h6> Motivation </h6>
                    <p1> [plch] </p1>
                    <p1> [plch] </p1>
                    <p1> [plch] </p1>
                    <p1> [plch] </p1>
                </div>
                <div>
                </div>
            </div>
        </div>
        `
    }

    public html : string;
    public props : ProjectProps;
}




export let projects : ProjectProps[] = 
[
    {
        divId: "mammoth",
        title: "Mammoth",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "silverback",
        title: "Silverback",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "wgpu",
        title: "WGPU",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "chameleon",
        title: "Chameleon",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "pbr",
        title: "PBR",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "sandbox",
        title: "Sandbox",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "vulkanLights",
        title: "Vulkan Lights",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "raytracer",
        title: "Raytracer",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "shmup",
        title: "Shmup",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "bankingApp",
        title: "Banking App",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "gamesList",
        title: "Games List",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
    {
        divId: "actixWeb",
        title: "Actix Web",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : "C++, CMake, OpenGL, Vulkan",
        features : "object-oriented, renderer-agnostic",
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "To practice working in a larger codebase"
    },
];