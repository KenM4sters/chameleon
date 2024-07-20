#version 300 es
precision highp float;

out vec4 frag_color;


uniform float u_time;
uniform float u_canvasWidth;
uniform float u_canvasHeight;
uniform vec2 u_mousePosition;
uniform int u_isFirstFrame;

uniform sampler2D s_planetTexture;
uniform sampler2D s_planetTextureA;
uniform sampler2D s_planetTextureB;


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

float SeedFromResolution(vec2 resolution) 
{
    return resolution.x - resolution.y;
}

void main()
{
    bool firstFrame = u_isFirstFrame == 0;

    vec2 fragCoord = gl_FragCoord.xy;

    vec2 resolution = vec2(u_canvasWidth, u_canvasHeight);
    
    float oldTextureSeed = texture(s_planetTextureB,vec2(0.0, 0.0)).w;
    float newTextureSeed = SeedFromResolution(resolution);
    bool resolutionChange = oldTextureSeed != newTextureSeed;

    
    float shorterSide = min(resolution.x, resolution.y);
    float aspectRatio = resolution.x / resolution.y;
    vec2 uv = fract(fragCoord / shorterSide - vec2(0.5,  0.5)); 
    
    float sourceNoise = texture(s_planetTextureA, uv + vec2(-0.03, 0.0) * u_time, -1000.0).x;
    float sourceMask = clamp(((sourceNoise - 0.5) * 10.0) + 0.5, 0.0, 1.0);
    
    vec2 dotsUV = QuakeLavaUV(uv, 0.01, 4.0, 37.699, u_time);    
    float dotsA = pow(texture(s_planetTextureA, dotsUV * 3.0 + u_time * vec2( -0.1,-0.1), -1000.0).x, 5.5);
    float dotsB = pow(texture(s_planetTextureA,-dotsUV * 5.0 + u_time * vec2( 0.1, 0.1), -1000.0).x, 5.5);
    float dots = max(dotsA, dotsB);
    
    vec2 turbulenceUVA = QuakeLavaUV(uv, 0.005, 2.0, 37.699, u_time);    
    float turbulenceNoiseA = simplexNoise( turbulenceUVA * 6.0 + vec2(u_time * 1.0, 0.0));
    vec2 turbulenceA = vec2( dFdy(turbulenceNoiseA), -dFdx(turbulenceNoiseA));

    vec2 turbulenceUVB = QuakeLavaUV(uv, 0.002, 4.0, 157.079, u_time);    
    float turbulenceNoiseB = texture(s_planetTextureA, turbulenceUVB + u_time * vec2( -0.05, 0.0), -1000.0).x;
    vec2 turbulenceB = vec2( dFdy(turbulenceNoiseB), -dFdx(turbulenceNoiseB));
    
    vec3 jupiterA = sampleJupiterASmoothstepFilter(uv*1.0, s_planetTexture);
    vec3 jupiterB = sampleJupiterBSmoothstepFilter(uv*1.0, s_planetTexture);
    
    vec2 combinedVelocity = turbulenceA * 0.015 + turbulenceB * 0.004 + vec2(sin(uv.y * 40.0)+1.5, 0.0) * 0.0006;
    
    vec3 sourceColor = mix(jupiterA, jupiterB, sourceMask);
    
    if(firstFrame || resolutionChange)
    {
        frag_color = vec4(sourceColor, newTextureSeed);
    }
    else
    {    
        float minDimension = min(resolution.x, resolution.y);
        float maxDimension = max(resolution.x, resolution.y);
        float maxAspectRatio = maxDimension / minDimension;
        vec2 aspectFactor = resolution.x > resolution.y ? vec2(maxAspectRatio, 1.0) : vec2(1.0, maxAspectRatio);
        vec2 previousUV = fract(fragCoord / resolution.xy * aspectFactor)/ aspectFactor;  
        
        vec3 previousFrame = texture(s_planetTextureB, previousUV + combinedVelocity).xyz;
        vec3 previousMixedWithSource = mix(previousFrame, sourceColor, dots * 0.04);

        frag_color = vec4(previousMixedWithSource, newTextureSeed);
    }
}