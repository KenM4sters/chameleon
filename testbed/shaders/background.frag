#version 300 es
precision highp float;

layout(location = 0) out vec4 scene_color;
layout(location = 1) out vec4 mesh_id_color;

in vec2 v_uv;

uniform float u_time;
uniform vec2 u_canvasDimensions;
uniform vec2 u_mousePosition;

// This helper function returns 1.0 if the current pixel is on a grid line, 0.0 otherwise
float IsGridLine(vec2 fragCoord)
{
	// Define the size we want each grid square in pixels
	vec2 vPixelsPerGridSquare = vec2(48.0, 48.0);
	
	// fragCoord is an input to the shader, it defines the pixel co-ordinate of the current pixel
	vec2 vScreenPixelCoordinate = fragCoord.xy;
	
	// Get a value in the range 0->1 based on where we are in each grid square
	// fract() returns the fractional part of the value and throws away the whole number part
	// This helpfully wraps numbers around in the 0->1 range
	vec2 vGridSquareCoords = fract(vScreenPixelCoordinate / vPixelsPerGridSquare);
	
	// Convert the 0->1 co-ordinates of where we are within the grid square
	// back into pixel co-ordinates within the grid square 
	vec2 vGridSquarePixelCoords = vGridSquareCoords * vPixelsPerGridSquare;

	// step() returns 0.0 if the second parmeter is less than the first, 1.0 otherwise
	// so we get 1.0 if we are on a grid line, 0.0 otherwise
	vec2 vIsGridLine = step(vGridSquarePixelCoords, vec2(1.0));
	
	// Combine the x and y gridlines by taking the maximum of the two values
	float fIsGridLine = max(vIsGridLine.x, vIsGridLine.y);

	// return the result
	return fIsGridLine;
}

// main is the entry point to the shader. 
// Our shader code starts here.
// This code is run for each pixel to determine its colour
void main()
{

    vec2 fragCoord = gl_FragCoord.xy;

	// We are goung to put our final colour here
	// initially we set all the elements to 0 
	vec3 vResult = vec3(0.07);

	// We set the blue component of the result based on the IsGridLine() function
	float res = IsGridLine(fragCoord);
	res *= 0.1;


	float mouseRadius = 0.1;

	float mouseIsOnGridLine = IsGridLine(u_mousePosition * u_canvasDimensions);

	if(res > 0.0) 
	{
    	vResult.rgb = vec3(res);

		vec2 mousePosDir = v_uv - u_mousePosition;
		if(length(mousePosDir) < mouseRadius) 
		{
			vResult.rgb = vec3(0.2);
		}
	}

	// The output to the shader is fragColor. 
	// This is the colour we write to the screen for this pixel
	scene_color = vec4(vResult, 1.0);
	mesh_id_color = vec4(13.0);
}