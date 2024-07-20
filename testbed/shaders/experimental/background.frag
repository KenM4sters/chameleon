#version 300 es
precision highp float;

out vec4 frag_color;

uniform float u_time;
uniform float u_canvasWidth;
uniform float u_canvasHeight;
uniform vec2 u_mousePosition;

// This helper function returns 1.0 if the current pixel is on a grid line, 0.0 otherwise
float IsGridLine(vec2 fragCoord)
{
	// Define the size we want each grid square in pixels
	vec2 vPixelsPerGridSquare = vec2(64.0, 64.0);
	
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
	vec3 vResult = vec3(0.0);

	// We set the blue component of the result based on the IsGridLine() function
	float res = IsGridLine(fragCoord);
	res *= 0.1;
	if(res > 0.0) 
	{
    	vResult.rgb = vec3(res);
	}

	// The output to the shader is fragColor. 
	// This is the colour we write to the screen for this pixel
	frag_color = vec4(vResult, 1.0);
}