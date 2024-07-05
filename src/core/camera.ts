import * as glm from "gl-matrix";

/**
 * @brief A very small implementation of a PerspectiveCamera, with most of the functionality 
 * besides the core projection and view matrices being left to the user/other modules.
 * A PerspectiveCamera instance should be used in 3D applications where a realistic 
 * perspective transformation is desired (which is in all but a handful of specific 3D applications).
 */
export class PerspectiveCamera 
{
    /**
     * @brief Sets the necessary variables in order to create the projection and lookat matrices 
     * on request.
     * @param pos the position of the camera in 3D space.
     * @param target the vector that the camera is looking at.
     * @param up the up direction relative to the camera ([0, 1, 0] if there's no rotation).
     * @param right the right direction relative to the camera ([1, 0, 0] if there's no rotation).
     * @param near the near clipping plane (any vertices closer to the camera than this will be clipped).
     * @param far the far clipping plane (any vertices further to the camera than this will be clipped).
     * @param zoom the FOV of the camera (a good zoom is usually somewhere between 45 and 90).
     */
    constructor(pos : glm.vec3, target : glm.vec3 = [0.0, 0.0, 0.0], up : glm.vec3 = [0.0, 1.0, 0.0],
        right : glm.vec3 = [1.0, 0.0, 0.0], near : number = 0.1, far : number = 100, zoom = 45) 
    {
        this.position = pos;
        this.target = target;
        this.up = up;
        this.right = right;
        this.near = near;
        this.far = far;
        this.zoom = zoom;
    }
     
    /**
     * @brief Computes and returns a perspective projection matrix.
     * A projection matrix considers the distance along the z axis to the camera and scales
     * vertices further away down, given a desirable effect of perspective.
     * @param width the width of the frustum (probably just the width of the canvas).
     * @param height the height of the frustum (probably just the width of the canvas).
     * @returns 4x4 projection matrix.
     */
    public GetProjectionMatrix(width : number, height : number) : glm.mat4 
    {
        return glm.mat4.perspective(glm.mat4.create(), glm.glMatrix.toRadian(this.zoom) ,width / height, this.near, this.far); 
    }
    
    /**
     * @brief Computes and returns a view matrix. 
     * The view matrix is computed by using the traditional LookAt transformation
     * which considers the the position, target and up vectors of the camera.
     * Bare in mind that the target is the vector that the camera should looking at, and the 
     * up vector is relative to the camera's orientation (simply [0, 1, 0] for non-rotating cameras).
     * @returns 4x4 view matrix. 
     */
    public GetViewMatrix() : glm.mat4 
    {
        return glm.mat4.lookAt(glm.mat4.create(), this.position, this.target, this.up);
    }
    
    public position : glm.vec3;
    public target : glm.vec3;
    public up : glm.vec3;
    public right : glm.vec3;
    public near : number;
    public far : number;
    public zoom : number;
};



/**
 * @brief A very small implementation of an orthographics camera, with most of the functionality 
 * besides the core projection and view matrices being left to the user/other modules.
 * Unlike a PerspectiveCamera, an OrthographicCamera instance will not apply any scaling
 * to vertices based on distance from the camera, giving a strange look to 3D applications,
 * but sometimes a desirable one. Generally speaking, this should the camera of choice for
 * 2D applications. 
*/
export class OrthographicCamera 
{
    /**
     * @brief Sets the necessary variables in order to create the projection and lookat matrices 
     * on request.
     * @param pos the position of the camera in 3D space.
     * @param target the vector that the camera is looking at.
     * @param up the up direction relative to the camera ([0, 1, 0] if there's no rotation).
     * @param right the right direction relative to the camera ([1, 0, 0] if there's no rotation).
     * @param near the near clipping plane (any vertices closer to the camera than this will be clipped).
     * @param far the far clipping plane (any vertices further to the camera than this will be clipped).
     */
    constructor(pos : glm.vec3, target : glm.vec3 = [0.0, 0.0, 0.0], up : glm.vec3 = [0.0, 1.0, 0.0],
        right : glm.vec3 = [1.0, 0.0, 0.0], near : number = 0.1, far : number = 100) 
    {
        this.position = pos;
        this.target = target;
        this.up = up;
        this.right = right;
        this.near = near;
        this.far = far;
    }
    
    /**
     * @brief Computes and returns an orthographic projection matrix.
     * An orthographic projection matrix does not apply any scaling based on distance from the camera,
     * The result is generally undesirable for all but a hadnful of 3D experiences, but very 
     * appropriate for 2D applications.
     * Consider that all clipping planes are specified in world-space, and an intuitive way 
     * to go about it would be to set the left and top to 0, the right to the width of the window
     * and the bottom to the height of the window.
     * @param left The left-most coordinate where vertices will be rendered. 
     * @param right The right-most coordinate where vertices will be rendered. 
     * @param bottom The bottom-most coordinate where vertices will be rendered.
     * @param top The top-most coordinate where vertices will be rendered.
     * @returns 4x4 projection matrix.
     */
    public GetProjectionMatrix(left : number, right : number, bottom : number, top : number) : glm.mat4 
    {
        return glm.mat4.ortho(glm.mat4.create(), left, right, bottom, top, this.near, this.far); 
    }
    
    /**
     * @brief Computes and returns a view matrix. 
     * The view matrix is computed by using the traditional LookAt transformation
     * which considers the the position, target and up vectors of the camera.
     * Bare in mind that the target is the vector that the camera should looking at, and the 
     * up vector is relative to the camera's orientation (simply [0, 1, 0] for non-rotating cameras).
     * @returns 4x4 view matrix. 
     */
    public GetViewMatrix() : glm.mat4 
    {
        return glm.mat4.lookAt(glm.mat4.create(), this.position, this.target, this.up);
    }
    
    public position : glm.vec3;
    public target : glm.vec3;
    public up : glm.vec3;
    public right : glm.vec3;
    public near : number;
    public far : number;
};