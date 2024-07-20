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
uniform sampler2D s_backgroundTexture;


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


// Maps UV coordinates to a sphere's surface
//
vec4 generateSphereSurfaceWithMask(vec2 uv, float radius) {
    float radiusSquared = radius * radius;
    float uvLengthSquared = dot(uv, uv);
    float uvLength = sqrt(uvLengthSquared);
    float mask = step(uvLength, radius);
    vec3 surface = vec3(0.0, 0.0, 0.0);
    if(mask > 0.0)
    {
        surface = vec3(uv / radius, sqrt(radiusSquared - uvLengthSquared));
    }
    else
    {
        surface = vec3(uv / uvLength, uvLength - radius);
    }
    return vec4(surface, mask);
}

vec2 generateSphericalUV(vec3 position, float spin)
{
    float width = sqrt(1.0 - position.y * position.y);
    float generatrixX = position.x / width;
    vec2 generatrix = vec2(generatrixX, position.y);
    vec2 uv = asin(generatrix) / 3.14159 + vec2(0.5 + spin, 0.5);  
    return vec2(uv);
}

mat3 createRotationMatrix(float pitch, float roll) {
    float cosPitch = cos(pitch);
    float sinPitch = sin(pitch);
    float cosRoll = cos(roll);
    float sinRoll = sin(roll);
    return mat3(
        cosRoll, -sinRoll * cosPitch, sinRoll * sinPitch,
        sinRoll, cosRoll * cosPitch, -cosRoll * sinPitch,
        0.0, sinPitch, cosPitch
    );
}

vec4 atmosphere( vec4 sphereSurfaceWithMask, vec3 lightDirection, vec3 atmosphereColor, float haloWidth, float minAtmosphere, float maxAtmosphere, float falloff){
    
    vec3 absorbtion = vec3(2.0, 3.0, 4.0);
    float inverseWidth = 1.0 / haloWidth;
    float fresnelBlend = pow(1.0 - sphereSurfaceWithMask.z, falloff);
    float amount = mix(minAtmosphere, maxAtmosphere, fresnelBlend);
    vec3 normal = sphereSurfaceWithMask.xyz;
    if(sphereSurfaceWithMask.w < 0.5)
    {
        float haloBlend = pow(max(1.0 - sphereSurfaceWithMask.z*inverseWidth, 0.0), 5.0);
        amount = haloBlend * maxAtmosphere;
        normal = vec3(sphereSurfaceWithMask.xy, 0.0);
    }
    float light = max((dot(normal, lightDirection)+0.3)/1.3, 0.0);
    vec3 absorbedLight = vec3( pow(light, absorbtion.x), pow(light, absorbtion.y),pow(light, absorbtion.z) );
    vec3 litAtmosphere =  absorbedLight * atmosphereColor;
    return vec4(litAtmosphere, amount);
}

// Main image rendering function
void main() 
{
    vec2 fragCoord = gl_FragCoord.xy;

    vec2 resolution = vec2(u_canvasWidth, u_canvasHeight);

    float shorterSide = min(resolution.x, resolution.y);
    float aspectRatio = resolution.x / resolution.y;
    vec2 offset = resolution.x > resolution.y ? vec2(aspectRatio, 1.0) * 0.5 : vec2(1.0, 1.0/aspectRatio) * 0.5;
        
    vec2 uv = (fragCoord / shorterSide - offset );
    float minDimension = min(resolution.x, resolution.y);
    float maxDimension = max(resolution.x, resolution.y);
    float maxAspectRatio = maxDimension / minDimension;
    vec2 aspectFactor = resolution.x > resolution.y ? vec2(maxAspectRatio, 1.0) : vec2(1.0, maxAspectRatio);
    
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 0.8));

    /// Jupiter
    ///
    vec4 jupiterSurfaceWithMask = generateSphereSurfaceWithMask(uv + vec2(0.2, 0.15), 0.6);
    float jupiterLight = pow(max(dot(lightDirection, jupiterSurfaceWithMask.xyz), 0.0), 0.8);
    vec4 jupiterAtmosphere = atmosphere( jupiterSurfaceWithMask, lightDirection, vec3(1.0, 0.7, 0.4) * 3.0, 0.2, 0.05, 0.6, 2.0);
    float jupiterMask = clamp(jupiterSurfaceWithMask.w, 0.0, 1.0);
    mat3 jupiterRotationMatrix = createRotationMatrix(-0.2, 0.3);
    vec3 rotatedJupiter = jupiterRotationMatrix * (jupiterSurfaceWithMask.xyz * jupiterMask);
    vec2 jupiterUV = generateSphericalUV(rotatedJupiter, u_time*0.02);
    vec3 jupiterTexture = texture(s_planetTexture, fract((jupiterUV*2.2 + vec2(0.0, 0.8))* aspectFactor)/aspectFactor).xyz;
    jupiterTexture = vec3(pow(jupiterTexture.x, 3.5), pow(jupiterTexture.y, 6.0), pow(jupiterTexture.z, 8.0))*3.5;
    
    /// Io
    ///
    vec4 ioSurfaceWithMask = generateSphereSurfaceWithMask(uv + vec2(-0.32, -0.2), 0.07);
    float ioLight = pow(max(dot(lightDirection, ioSurfaceWithMask.xyz), 0.0), 0.4);
    vec4 ioAtmosphere = atmosphere( ioSurfaceWithMask, lightDirection, vec3(1.0, 0.9, 0.8) * 1.5, 0.06, 0.03, 1.0, 4.0);
    float ioMask = clamp(ioSurfaceWithMask.w, 0.0, 1.0);
    mat3 ioRotationMatrix = createRotationMatrix(0.4, -0.1);
    vec3 rotatedIo = ioRotationMatrix * (ioSurfaceWithMask.xyz * ioMask);
    vec2 ioUV = generateSphericalUV(rotatedIo, -u_time * 0.05);
    vec3 ioTexture = texture(s_planetTextureB, fract((ioUV + vec2(0.0, 0.8))* aspectFactor)/aspectFactor, -10.0).xyz;
    ioTexture = vec3(min(pow(1.0 - ioTexture.x, 5.5)*2.0, 1.0));
    
    /// Stars
    /// 
    vec3 stars = vec3(pow(texture(s_planetTextureA, uv).x, 25.0)) * vec3(1.0, 0.4, 0.3) * 3.0;
    vec2 nebulaUV = QuakeLavaUV(uv, 0.04, 0.06, 13.0, u_time);
    vec3 nebulaTexture = texture(s_backgroundTexture, nebulaUV).xyz;
    float nabulaFade = pow(max(1.0 - uv.y, 0.0), 2.5)*0.5;
    vec3 nebulaTint =  vec3(0.9, 0.3, 0.4);
    vec3 nebula = vec3(pow(nebulaTexture.x, 2.0)) * nabulaFade * nebulaTint;
    stars += nebula;

    
    /// Combining
    ///
    vec3 jupiterWithBackground = mix(stars, jupiterTexture * jupiterLight, jupiterMask);
    vec3 jupiterWithAtmosphere = mix(jupiterWithBackground, jupiterAtmosphere.xyz, jupiterAtmosphere.w);
    vec3 jupiterWithIo = mix(jupiterWithAtmosphere, ioTexture * ioLight, ioMask);
    vec3 jupiterWithIoWithAtmosphere = mix(jupiterWithIo, ioAtmosphere.xyz, ioAtmosphere.w);
    
    
    vec2 overlayUV = fragCoord.xy/ resolution.xy;
    vec3 overlayColor = mix(0.3, 0.9, pow(overlayUV.x, 1.7)) * vec3(1.0, 0.35, 0.1)*1.4;
    vec3 imageWithOverlay = mix(jupiterWithIoWithAtmosphere, overlayColor, pow(1.0 - overlayUV.y*0.5, 5.0)*0.7 + 0.1);


    frag_color = vec4(imageWithOverlay, 1.0);
}