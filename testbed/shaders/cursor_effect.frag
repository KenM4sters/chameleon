#version 300 es
precision highp float;

out vec4 frag_color;

in vec2 v_uv;

uniform sampler2D s_sceneTexture;
uniform float u_canvasWidth;
uniform float u_canvasHeight;
uniform vec2 u_mousePosition;

void main() 
{
    vec2 fragPosition = gl_FragCoord.xy / vec2(u_canvasWidth, u_canvasHeight);

    float texelWidth = 1.0 / u_canvasWidth;
    float texelHeight = 1.0 / u_canvasHeight;

    vec2 mouseCover = vec2(100.0*texelWidth, 100.0*texelHeight);

    vec4 finalColor;

    float radius = 10.0 * texelWidth;

    if(length(fragPosition - u_mousePosition) < radius) 
    {
        finalColor = vec4(0.7, 0.7, 0.8, 1.0);
    }
    else 
    {
        vec3 color = texture(s_sceneTexture, v_uv).rgb;
        finalColor = vec4(color, 1.0);
    }

    frag_color = finalColor;
}