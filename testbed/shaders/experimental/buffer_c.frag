#version 300 es
precision highp float;

out vec4 frag_color;


uniform float u_time;
uniform float u_canvasWidth;
uniform float u_canvasHeight;
uniform vec2 u_mousePosition;

uniform sampler2D s_planetTexture;
uniform sampler2D s_planetTextureA;
uniform sampler2D s_planetTextureB;

#define strength 5.0
#define clampValue 0.02


#define TILING 1.0


int WrapIndexX(int index){
    return (index % 16 + 16) % 16;}

int WrapIndexY(int index){
    return (index % 16 + 16) % 16;}

vec3 get_imageA(int idx, sampler2D ich){
    return texelFetch(ich, ivec2(idx,0), 0).rgb;
}
vec3 sampleJupiterASmoothstepFilter(vec2 uv, sampler2D ich)
{
    vec2 imageSize = vec2(16, 16);
    int xIndex = int(floor(uv.x * imageSize.x - 0.5));
    int yIndex = int(floor(uv.y * imageSize.y - 0.5));
    vec3 sample00 = get_imageA(WrapIndexY(yIndex) * 16 + WrapIndexX(xIndex), ich);
    vec3 sample10 = get_imageA(WrapIndexY(yIndex) * 16 + WrapIndexX(xIndex + 1), ich);
    vec3 sample01 = get_imageA(WrapIndexY(yIndex + 1) * 16 + WrapIndexX(xIndex), ich);
    vec3 sample11 = get_imageA(WrapIndexY(yIndex + 1) * 16 + WrapIndexX(xIndex + 1), ich);
    float xFactor = smoothstep(0.0, 1.0, fract(uv.x * imageSize.x - 0.5));
    float yFactor = smoothstep(0.0, 1.0, fract(uv.y * imageSize.y - 0.5));
    vec3 interpolated = mix(mix(sample00, sample10, xFactor), mix(sample01, sample11, xFactor), yFactor);
    return interpolated;
}

vec2 hash( vec2 p ) 
{
	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float simplexNoise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2  i = floor( p + (p.x+p.y)*K1 );
    vec2  a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x); 
    vec2  o = vec2(m,1.0-m);
    vec2  b = a - o + K2;
	vec2  c = a - 1.0 + 2.0*K2;
    vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
}

vec3 get_imageB(int idx, sampler2D ich){
    return texelFetch(ich, ivec2(idx,1), 0).rgb;
}
vec3 sampleJupiterBSmoothstepFilter(vec2 uv, sampler2D ich)
{
    vec2 imageSize = vec2(16, 16);
    int xIndex = int(floor(uv.x * imageSize.x - 0.5));
    int yIndex = int(floor(uv.y * imageSize.y - 0.5));
    vec3 sample00 = get_imageB(WrapIndexY(yIndex) * 16 + WrapIndexX(xIndex), ich);
    vec3 sample10 = get_imageB(WrapIndexY(yIndex) * 16 + WrapIndexX(xIndex + 1), ich);
    vec3 sample01 = get_imageB(WrapIndexY(yIndex + 1) * 16 + WrapIndexX(xIndex), ich);
    vec3 sample11 = get_imageB(WrapIndexY(yIndex + 1) * 16 + WrapIndexX(xIndex + 1), ich);
    float xFactor = smoothstep(0.0, 1.0, fract(uv.x * imageSize.x - 0.5));
    float yFactor = smoothstep(0.0, 1.0, fract(uv.y * imageSize.y - 0.5));
    vec3 interpolated = mix(mix(sample00, sample10, xFactor), mix(sample01, sample11, xFactor), yFactor);
    return interpolated;
}

vec2 QuakeLavaUV(vec2 coords, float amplitude, float speed, float frequency, float time)
{
    float scaledTime = time * speed;
    vec2 scaledCoords = coords * frequency;
    float x = sin(scaledTime + scaledCoords.x) * amplitude;
    float y = sin(scaledTime + scaledCoords.y) * amplitude;
    return coords + vec2(y, x);
}

float SeedFromResolution(vec3 resolution) {
    return resolution.x - resolution.y;
}

void main()
{
    vec2 fragCoord = gl_FragCoord.xy;

    vec2 resolution = vec2(u_canvasWidth, u_canvasHeight);

    vec2 uv = fragCoord / resolution.xy;
    float xPixelOffset = 1.0 / resolution.x;
    float yPixelOffset = 1.0 / resolution.y;
    vec3 centerSample = texture(s_planetTextureA, uv).xyz;
    vec3 northSample  = texture(s_planetTextureA, uv + vec2( 0.0, yPixelOffset)).xyz;
    vec3 southSample  = texture(s_planetTextureA, uv + vec2( 0.0,-yPixelOffset)).xyz;
    vec3 eastSample   = texture(s_planetTextureA, uv + vec2(  xPixelOffset,  0.0)).xyz;
    vec3 westSample   = texture(s_planetTextureA, uv + vec2( -xPixelOffset, 0.0)).xyz;
    vec3 sharpen = (4.0*centerSample - northSample - southSample - eastSample - westSample) * strength;
    sharpen = clamp(sharpen, -clampValue, clampValue);
    vec3 sharpenedInput = clamp(centerSample + sharpen, 0.0, 1.0);
    frag_color = vec4(sharpenedInput, 1.0);
}