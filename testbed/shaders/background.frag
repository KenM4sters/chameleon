#version 300 es
precision highp float;

layout(location = 0) out vec4 scene_color;
layout(location = 1) out vec4 mesh_id_color;

in vec2 v_uv;
in vec3 v_clipPosition;

uniform sampler2D s_normalMap;
uniform float u_time;
uniform vec2 u_canvasDimensions;
uniform vec2 u_mousePosition;
uniform float u_currentView;

#define LIGHT_INTENSITY 0.01 

#define PI 3.14159265359


// 2D Classic Perlin Noise in GLSL
// Adapted from Stefan Gustavson's implementation

vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P) 
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // Modulo 289 to avoid truncation effects
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;

    vec4 i = permute(permute(ix) + iy);

    vec4 gx = fract(i*(1.0/41.0)) * 2.0 - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;

    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);

    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
                vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;

    vec4 n = vec4(dot(g00, vec2(fx.x, fy.x)), dot(g10, vec2(fx.y, fy.y)),
                  dot(g01, vec2(fx.z, fy.z)), dot(g11, vec2(fx.w, fy.w)));

    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(n.xy, n.zw, fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

float lines(vec2 uv, float offset)
{
    float a = abs(0.5 * sin(uv.y * 5.0) + offset * 0.25);
    return smoothstep(0.0, 0.25 + offset * 0.25, a);
}

mat2 rotate2d(float angle)
{
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float random(vec2 p) 
{
    vec2 k1 = vec2(
            23.14069263277926, // e^pi (Gelfond's constant)
            2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
    );
    return fract(
            cos(dot(p, k1)) * 12345.6789
    );
}

vec3 fadeLine(vec2 uv, vec2 mouse2D, vec3 col1, vec3 col2, vec3 col3)
{
    mouse2D = (mouse2D + 1.0) * 0.5;
    float n1 = cnoise(uv); //(*|/ ) -> scale (+|-) -> offset
    float n2 = cnoise(uv + 0.34 * 20.0);
    float n3 = cnoise(uv * 0.3 + 0.0 * 10.0);
    float nFinal = mix(mix(n1, n2, mouse2D.x), n3, mouse2D.y);
    vec2 baseUv = vec2(nFinal + 2.05 ) * 1.0; // (+|-) -> frequency (*|/ ) -> lines count

    float basePattern = lines(baseUv, 1.0);
    float secondPattern = lines(baseUv, 0.25);

    vec3 baseColor = mix(col1, col2, basePattern);
    vec3 secondBaseColor = mix(baseColor, col3, secondPattern);
    return secondBaseColor;
}


void main()
{
	vec2 mouse_position_clip_space = vec2(u_mousePosition.x * 2.0 - 1.0, u_mousePosition.y * 2.0 - 1.0);
    vec2 uv = v_uv;

    uv += mouse_position_clip_space * 0.1;

    vec3 col1 = fadeLine(uv, mouse_position_clip_space, vec3(0.1, 0.1, 0.25), vec3(0.1, 0.1, 0.25), vec3(0.1, 0.1, 0.25));
    vec3 finalCol = col1;

    vec2 uvRandom = v_uv;
    uvRandom.y *= random(vec2(uvRandom.y, 0.5));
    finalCol.rgb += random(uvRandom) * 0.04;

	scene_color = vec4(finalCol, 1.0);

	mesh_id_color = vec4(100.0);
}