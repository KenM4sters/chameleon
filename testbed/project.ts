
export interface ProjectProps 
{
    divId : string;
    title : string;
    brief : string;
    techStack : string[];
    features : string[];
    date : string;
    github : string;
    status : string;
    mainImage : string;
    codeSnippet1 : string;
    codeSnippet2 : string;
    codeSnippet3 : string;
    motivation : string;
    challenges : string;
    finalThoughts : string;
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
                    <div class="project_description_container">
                        <p class="project_title"> ${this.props.title} </p>
                        <p class="project_brief"> ${this.props.brief} </p>
                    </div>
                    <div class="project_metadata_container">
                        <div class="project_metadata_item">
                            <p class="metadata_item_title"> Features </p>
                            ${this.props.features.map(feature => `<p class="metadata_item_description">${feature}</p>`).join('')}
                        </div>
                        <div class="project_metadata_item">
                            <p class="metadata_item_title"> Tech Stack </p>
                            ${this.props.techStack.map(tech => `<p class="metadata_item_description">${tech}</p>`).join('')}
                        </div>
                        <div class="project_metadata_item">
                            <p class="metadata_item_title"> Date </p>
                            <p class="metadata_item_description"> ${this.props.date} </p>
                        </div>
                        <div class="project_metadata_item">
                            <p class="metadata_item_title"> Source Code </p>
                            <a class="metadata_item_link" href="${this.props.github}" target="_blank">visit repository</a>
                        </div>
                        <div class="project_metadata_item">
                            <p class="metadata_item_title"> Status </p>
                            <p class="metadata_item_description"> ${this.props.status} </p>
                        </div>
                    </div>
                </div>
                <div class="project_image_container">
                    <img class="project_image" src=${this.props.mainImage} />
                </div>
            </div>
            <div class="project_extras_container">
                <div class="project_extras_item">
                    <p class="extras_title"> Motivation </p>
                    <p class="extras_description"> ${this.props.motivation} </p>
                </div>
                <img class="project_extra_image" src=${this.props.mainImage} />
                <div class="project_extras_item">
                    <p class="extras_title"> Challenges </p>
                    <p class="extras_description"> ${this.props.challenges} </p>
                </div>
                <img class="project_extra_image" src=${this.props.mainImage} />
                <div class="project_extras_item">
                    <p class="extras_title"> Final Thoughts </p>
                    <p class="extras_description"> ${this.props.finalThoughts} </p>
                </div>
                <div class-"project_extra_image_collage"> 
                    <div class="project_extra_double_image_container">
                        <img class="project_extra_double_image_final" src=${this.props.mainImage} />
                        <img class="project_extra_double_image_final" src=${this.props.mainImage} />
                    </div>
                    <img class="project_extra_image_final" src=${this.props.mainImage} />
                </div>
                <div class="project_extras_item_next">
                    <button class="next_project_button"> View Next Project </button>
                    <img class="project_extra_image_next" src=${this.props.mainImage} />
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
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "silverback",
        title: "Silverback",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "wgpu",
        title: "WGPU",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "chameleon",
        title: "Chameleon",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "pbr",
        title: "PBR",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "sandbox",
        title: "Sandbox",
        brief : "An OpenGL application that supports 3D model loading through the ASSIMP library and custom terrrain generation.",
        techStack : ["C++", "CMake", "OpenGL"],
        features : ["object-oriented", "terrain generation", "3D model loading", "grass", "billboards"],
        date :  "02/24",
        github : "https://github.com/KenM4sters/sandbox",
        status : "completed",
        mainImage : "testbed/images/sandbox.png",
        codeSnippet1 : "testbed/images/sandbox.png",
        codeSnippet2 : "testbed/images/sandbox.png",
        codeSnippet3 : "testbed/images/sandbox.png",
        motivation : "The primary motivation behind this project was to continue practicing 3D rendering using the OpenGL API, as well as to consolidate my, at the time, newly obtained C++ programming knowledge.",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "vulkanLights",
        title: "Vulkan Lights",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "raytracer",
        title: "Raytracer",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "shmup",
        title: "Shmup",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "bankingApp",
        title: "Banking App",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "gamesList",
        title: "Games List",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "actixWeb",
        title: "Actix Web",
        brief : "An object-oriented rendering framework that supports OpenGL and Vulkan backends with the ambition to support DirectX and Metal in the near future.",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
];