
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
                <div class="project_extras_item scroll_trigger_fade_in">
                    <p class="extras_title"> Motivation </p>
                    <p class="extras_description"> ${this.props.motivation} </p>
                </div>
                <img class="project_extra_image scroll_trigger_fade_in" src=${this.props.mainImage} />
                <div class="project_extras_item scroll_trigger_fade_in">
                    <p class="extras_title"> Challenges </p>
                    <p class="extras_description"> ${this.props.challenges} </p>
                </div>
                <img class="project_extra_image scroll_trigger_fade_in" src=${this.props.mainImage} />
                <div class="project_extras_item scroll_trigger_fade_in">
                    <p class="extras_title"> Final Thoughts </p>
                    <p class="extras_description"> ${this.props.finalThoughts} </p>
                </div>
                <div class="project_extra_image_collage scroll_trigger_fade_in"> 
                    <div class="project_extra_double_image_container">
                        <img class="project_extra_double_image_final scroll_trigger_fade_in" src=${this.props.mainImage} />
                        <img class="project_extra_double_image_final scroll_trigger_fade_in" src=${this.props.mainImage} />
                    </div>
                    <img class="project_extra_image_final scroll_trigger_fade_in" src=${this.props.mainImage} />
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
        motivation : "I've always enjoyed exploring different graphics backends and wanted to put together a project that offered a rendering framework that was completely/partially agnostic of the backend. It's been an amazingly satisfying project being able to recognise the similarities between what appear as very different frameworks at first value, and, eventhough I've really enjoyed exploring Rust and WGPU recently, I am looking forward to begin working on the DX12 and Metal backends.",
        challenges : "The biggest challenge with this project was probably starting... Each API has its own quirks that made comming up with a completely agnostic frontend quite hard to imagine. Eventhough I opted for the more simplistic and intuitive OOP approach of extensively using polymorphism to abstract context-specific classes into a single one, other more data-driven approaches exist that potentially offer less of a peformance penalty.",
        finalThoughts : "Designing abstractions over more complicated frameworks to offer an entirely new way of interacting with the same underlying data is a huge passion of mine, so developing this project has been an absolute joy that I very much on continuing for a long time."
    },
    {
        divId: "silverback",
        title: "Silverback",
        brief : "A data-driven Entity-Component-System (ECS) framework with an emphasis on Template-Meta-Programming (TMP) to provide an API that offers a comfortable balance between peformance, flexibilty and simplicity.",
        techStack : ["C++", "CMake"],
        features : ["data-driven", "template-meta-programming"],
        date :  "06/24",
        github : "https://github.com/KenM4sters/Silverback",
        status : "completed",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "Eventhough I generally enjoy Object-Oriented-Programming and often find that it offers the best balance between flexibilty, rapid prototyping and peformance, I do have an underlying inclination to work with a more data-oriented model where possible, and I've often thought organising mesh-related data for game engines strikes as a good candidate for this.",
        challenges : "Comming up with an extremely intuitive API that worked with the, what I found to be at least, quite complex mechanics of the underlying ECS framework was definitely a difficult task. I mostly took insipration from well-renowned frameworks like Flecs and Entt, but putting everything together with my own flair was not easy by any means.",
        finalThoughts : "ECS frameworks are an industry standard for most AAA game engines, so comming up with my own, allbeit tiny, version was definitely something I was going to end up doing. Ultimately, I thank C++'s Templates for being incredibly useful here."
    },
    {
        divId: "wgpu",
        title: "WGPU",
        brief : "",
        techStack : ["C++", "CMake", "OpenGL", "Vulkan"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "07/24",
        github : "https://github.com/KenM4sters/Mammoth2D",
        status : "ongoing",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "I've had experience with a few languages at this point, but the one that I definitely find myself enjoying the most is Rust. Comming from a C++ background, I've always enjoyed working with Systems languages that hand you the reigns on the data that you want to work with, but I've also had a soft spot for web development and the more modern syntax of languages like JS/TS. Rust bridges this gap perfectly.",
        challenges : "From my experience, learning Rust definitely isn't easy, but I've never had an issue appreciating why it operates the way that it does. WGPU definitely also has it's nuances, and I'd be lying if I said that I didn't misses the more robust Vulkan framework, but generally I find that it's great to work with and being able to write rust code in graphics environment is undeniably awesome.",
        finalThoughts : "I've got a long way to go, but it's a great fealing looking back at where I started, and I fully intend on continuing to home my skills as a Rust developer."
    },
    {
        divId: "chameleon",
        title: "Chameleon",
        brief : "Much like Mammoth, the C++ version of this project, Chameleon is an Object-Oriented rendering framework written in Typescript that provides a (slightly) simplified abstraction over WebGL2.0 and WebGPU (WIP), designed to make orgnaizing rendering data much easier, with very minimal peformance cost.",
        techStack : ["Typescript", "Node", "WebGL", "WebGPU"],
        features : ["object-oriented", "renderer-agnostic"],
        date :  "05/24",
        github : "https://github.com/KenM4sters/chameleon",
        status : "ongoing",
        mainImage : "testbed/images/chameleon_marbles.png",
        codeSnippet1 : "testbed/images/chameleon_marbles.png",
        codeSnippet2 : "testbed/images/chameleon_marbles.png",
        codeSnippet3 : "testbed/images/chameleon_marbles.png",
        motivation : "I've always wanted to write a rendering framework that's agnostic of the underlying API, hence the reason for Mammoth, but I also wanted a version of the framework for the web without using emscripten.",
        challenges : "Most of my experience lies with systems langauges like C and C++, and I'd definitely say that my TS and DOM knowledge could use some tutorials.",
        finalThoughts : "I really enjoy being able to combine graphics programming with web development, which ultimately led to me pursuing Rust with it's unparalleled compatability with WASM. "
    },
    {
        divId: "pbr",
        title: "PBR",
        brief : "A small OpenGL application that uses the micro-facet model for Physically-Based rendering, along with 3D model loading and an imGui interface that allows the users to control material data from docked panels.",
        techStack : ["C++", "OpenGL", "imGui", "Assimp"],
        features : ["physically-based rendering", "3d model loading", "user interface", "skybox", "environment shading"],
        date :  "02/24",
        github : "https://github.com/KenM4sters/Reach",
        status : "completed",
        mainImage : "testbed/images/pbr_metal.png",
        codeSnippet1 : "testbed/images/pbr_metal.png",
        codeSnippet2 : "testbed/images/pbr_metal.png",
        codeSnippet3 : "testbed/images/pbr_metal.png",
        motivation : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        challenges : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!",
        finalThoughts : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nemo aut a. Minus reprehenderit soluta expedita, quos reiciendis voluptate iusto. Nostrum eos placeat voluptates officiis odit dolores temporibus laborum culpa!"
    },
    {
        divId: "sandbox",
        title: "Sandbox",
        brief : "An OpenGL application that supports 3D model loading through the ASSIMP library and custom terrrain generation.",
        techStack : ["C++", "OpenGL", "imGui", "Assimp"],
        features : ["object-oriented", "terrain generation", "3D model loading", "skybox", "grass", "billboards"],
        date :  "02/24",
        github : "https://github.com/KenM4sters/sandbox",
        status : "completed",
        mainImage : "testbed/images/sandbox.png",
        codeSnippet1 : "testbed/images/sandbox.png",
        codeSnippet2 : "testbed/images/sandbox.png",
        codeSnippet3 : "testbed/images/sandbox.png",
        motivation : "The primary motivation behind this project was to continue practicing 3D rendering using the OpenGL API, as well as to consolidate my, at the time, newly obtained C++ programming knowledge.",
        challenges : "This was really my first experience using textures for something other than color data, which definitely took a while to get my head around at first.",
        finalThoughts : "Sandbox was my first introduction into modern graphics programming techniques, and even though I've very much moved on from this project, I definitely plan on producing a terrain example with the Mammoth rendering framework."
    },
    {
        divId: "vulkanLights",
        title: "Vulkan Lights",
        brief : "A simple implementation of instanced point lights and 3d model of a star destroyer that the user can fly around with an intuitive camera system",
        techStack : ["C++", "CMake", "Vulkan", "TinyObj"],
        features : ["instancing", "3d model loading", "flight camera"],
        date :  "12/23",
        github : "https://github.com/KenM4sters/vulkan",
        status : "completed",
        mainImage : "testbed/images/vulkan_lights.png",
        codeSnippet1 : "testbed/images/vulkan_lights.png",
        codeSnippet2 : "testbed/images/vulkan_lights.png",
        codeSnippet3 : "testbed/images/vulkan_lights.png",
        motivation : "To begin learning the Vulkan API after a few succesful and very enjoayble OpenGL projects, along with more modern C++ practices",
        challenges : "Learning vulkan was definitely a huge step up from OpenGL, with concepts like swpachains, command buffers, semaphores and fences being completely foreign to me at the time.",
        finalThoughts : "Vulkan is an amazing framewokr that I've come to enjoy and rely on for most of my graphics applications. "
    },
    {
        divId: "raytracer",
        title: "Raytracer",
        brief : "A simple multi-threaded CPU raytracer that computes the path of rays through a scene of planes and spheres to produce a single image with exceptional shading information through path tracing.",
        techStack : ["C++", "imGui"],
        features : ["multi-threading", "bounces", "shadows", "plane intersection", "sphere intersection"],
        date :  "03/24",
        github : "https://github.com/KenM4sters/Raytracer",
        status : "completed",
        mainImage : "testbed/images/raytracer.png",
        codeSnippet1 : "testbed/images/raytracer.png",
        codeSnippet2 : "testbed/images/raytracer.png",
        codeSnippet3 : "testbed/images/raytracer.png",
        motivation : "To explore the realm of raytracing through a very raw implementation on the CPU",
        challenges : "I ended up moving on from this project fairly quickly as I had a keen desire to get to grips with Vulkan at the time, so I didn't encounter that many problems, although this was my first time using the imGui libary, which in actuallity was very straight-forward.",
        finalThoughts : "There's no doubt that raytracing offers the single most realistic shading information, and every effort is being made by vendros like Nvidia to make this very computationally expensive approach more viable in peformance-critical applications like video games, and learning even just a slice of it on the CPU was incredibly interesting."
    },
    {
        divId: "shmup",
        title: "Shmup",
        brief : "A very simple Shoot-em-up written in plain C using the OpenGL API for graphics rendering",
        techStack : ["C", "Make", "OpenGL"],
        features : ["instancing"],
        date :  "10/23",
        github : "https://github.com/KenM4sters/c-game",
        status : "completed",
        mainImage : "testbed/images/shmup.png",
        codeSnippet1 : "testbed/images/shmup.png",
        codeSnippet2 : "testbed/images/shmup.png",
        codeSnippet3 : "testbed/images/shmup.png",
        motivation : "This was one of my vert first programming projects, and my first experience writing with a systems language. It's incredibly simple, but I owe everything that I know today that tiny application that sparked an incredibly profound interest in graphics rendering and systems programming in general.",
        challenges : "Given that this my first project using a systems language, as well as my first time using OpenGL, naming every challened that I encountered would surely be unsuitable here, but organsing my project and working with OpenGL was definitely no walk in the park.",
        finalThoughts : "This project was what got me hooked on graphics programming, and looking back it's crazy to see how far I've come in the short while that I've had with my passion for computer programming."
    },
    {
        divId: "bankingApp",
        title: "Banking App",
        brief : "A full-stack web application that uses a React frontend to make calls to a Java backend that communicates with a PostgreSQL databse to store and modify user data.",
        techStack : ["Typescript", "React", "Java", "Spring", "PostgreSQL"],
        features : ["user authentication"],
        date :  "02/24",
        github : "https://github.com/KenM4sters/BankingApp",
        status : "completed",
        mainImage : "testbed/images/banking_app.png",
        codeSnippet1 : "testbed/images/banking_app.png",
        codeSnippet2 : "testbed/images/banking_app.png",
        codeSnippet3 : "testbed/images/banking_app.png",
        motivation : "To explore the springboot framework in particular and practice integrating it with a React frontend",
        challenges : "I was very new to programming in Java at the time, although I had experience with OOP in C++, so Java's quirks was definitely something that I had to get used to, although IntelliJ made the transition much smoother than I imagined.",
        finalThoughts : "Even though my interests mostly lie with graphics programming, web devlelopment is definitely still a passion of mine and so exploring different frameworks will always be something that I'll take an interest in."
    },
    {
        divId: "gamesList",
        title: "Games List",
        brief : "A full-stack web application that uses a React frontend to make calls to a Java backend that communicates with a PostgreSQL databse to store and modify data about game titles.",
        techStack : ["Typescript", "React", "Java", "Spring", "PostgreSQL"],
        features : ["user authentication"],
        date :  "02/24",
        github : "https://github.com/KenM4sters/GamesList",
        status : "completed",
        mainImage : "testbed/images/games_list.png",
        codeSnippet1 : "testbed/images/games_list.png",
        codeSnippet2 : "testbed/images/games_list.png",
        codeSnippet3 : "testbed/images/games_list.png",
        motivation : "To explore the springboot framework in particular and practice integrating it with a React frontend",
        challenges : "I was very new to programming in Java at the time, although I had experience with OOP in C++, so Java's quirks was definitely something that I had to get used to, although IntelliJ made the transition much smoother than I imagined.",
        finalThoughts : "Even though my interests mostly lie with graphics programming, web devlelopment is definitely still a passion of mine and so exploring different frameworks will always be something that I'll take an interest in."
    },
    {
        divId: "actixWeb",
        title: "Actix Web",
        brief : "A very simple web server written in Rust using the Actix Web framework, which was later used in a fullstack web application to make calls to a PostgreSQL database",
        techStack : ["Rust", "Actix Web"],
        features : ["web-server"],
        date :  "02/24",
        github : "https://github.com/KenM4sters/ActixWeb",
        status : "completed",
        mainImage : "testbed/images/mammoth.png",
        codeSnippet1 : "testbed/images/mammoth.png",
        codeSnippet2 : "testbed/images/mammoth.png",
        codeSnippet3 : "testbed/images/mammoth.png",
        motivation : "I wanted to create a test application to act almost like a sandbox which I'd progressively improve alongside learning from the Rust Tutorial Book.",
        challenges : "Learning Rust for the fist time definitely wasn't easy, especially since my knowledge of systems programming at the time was very hit and miss, but I immediately found a joy in programming in Rust that I knew would eventually catch up to me again.",
        finalThoughts : "I think Rust is a fantastic language that I'll continue to learn for the foreseable future, mostly working with graphics frameworks like WGPU and comming up with my own WASM libraries."
    },
];