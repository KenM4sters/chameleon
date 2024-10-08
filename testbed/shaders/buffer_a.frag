#version 300 es
precision highp float;

out vec4 frag_color;


uniform float u_time;
uniform float u_canvasWidth;
uniform float u_canvasHeight;
uniform vec2 u_mousePosition;

uniform sampler2D s_planetTexture;

#define TILING 1.0


int wrap_index_x(int index)
{
    return (index % 16 + 16) % 16;
}

int wrap_index_y(int index)
{
    return (index % 16 + 16) % 16;
}

vec3 get_imageA(int idx, sampler2D ich)
{
    return texelFetch(ich, ivec2(idx,0), 0).rgb;
}

vec3 sampleJupiterASmoothstepFilter(vec2 uv, sampler2D ich)
{
    vec2 imageSize = vec2(16, 16);
    int xIndex = int(floor(uv.x * imageSize.x - 0.5));
    int yIndex = int(floor(uv.y * imageSize.y - 0.5));
    vec3 sample00 = get_imageA(wrap_index_y(yIndex) * 16 + wrap_index_x(xIndex), ich);
    vec3 sample10 = get_imageA(wrap_index_y(yIndex) * 16 + wrap_index_x(xIndex + 1), ich);
    vec3 sample01 = get_imageA(wrap_index_y(yIndex + 1) * 16 + wrap_index_x(xIndex), ich);
    vec3 sample11 = get_imageA(wrap_index_y(yIndex + 1) * 16 + wrap_index_x(xIndex + 1), ich);
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

float simplex_noise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x); 
    vec2 o = vec2(m,1.0-m);
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    
    return dot(n, vec3(70.0));
}

vec3 get_image_b(int idx, sampler2D ich)
{
    return texelFetch(ich, ivec2(idx,1), 0).rgb;
}

vec3 sampleJupiterBSmoothstepFilter(vec2 uv, sampler2D ich)
{
    vec2 imageSize = vec2(16, 16);
    int xIndex = int(floor(uv.x * imageSize.x - 0.5));
    int yIndex = int(floor(uv.y * imageSize.y - 0.5));
    vec3 sample00 = get_image_b(wrap_index_y(yIndex) * 16 + wrap_index_x(xIndex), ich);
    vec3 sample10 = get_image_b(wrap_index_y(yIndex) * 16 + wrap_index_x(xIndex + 1), ich);
    vec3 sample01 = get_image_b(wrap_index_y(yIndex + 1) * 16 + wrap_index_x(xIndex), ich);
    vec3 sample11 = get_image_b(wrap_index_y(yIndex + 1) * 16 + wrap_index_x(xIndex + 1), ich);
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

float SeedFromResolution(vec3 resolution) 
{
    return resolution.x - resolution.y;
}


vec3 sample_jupiter_b(int idx)
{
    const vec3 image[256] = vec3[]
    (
        vec3(0.906,0.780, 0.678),vec3(0.906,0.780, 0.678),vec3(0.906,0.780, 0.678),vec3(0.906,0.780, 0.678),vec3(0.808,0.714, 0.647),vec3(0.808,0.714, 0.647),vec3(0.655,0.510, 0.451),vec3(0.655,0.510, 0.451),vec3(0.796,0.643, 0.557),vec3(0.796,0.643, 0.557),vec3(1.000,0.906, 0.808),vec3(1.000,0.906, 0.808),vec3(1.000,0.937, 0.839),vec3(1.000,0.937, 0.839),vec3(0.804,0.671, 0.580),vec3(0.804,0.671, 0.580),
        vec3(0.733,0.573, 0.471),vec3(0.388,0.157, 0.063),vec3(0.561,0.365, 0.267),vec3(0.561,0.365, 0.267),vec3(0.655,0.510, 0.451),vec3(0.655,0.510, 0.451),vec3(0.655,0.510, 0.451),vec3(0.502,0.310, 0.255),vec3(0.388,0.125, 0.063),vec3(0.592,0.384, 0.310),vec3(0.796,0.643, 0.557),vec3(0.592,0.384, 0.310),vec3(0.804,0.671, 0.580),vec3(0.612,0.404, 0.322),vec3(0.804,0.671, 0.580),vec3(0.804,0.671, 0.580),
        vec3(0.733,0.573, 0.471),vec3(0.561,0.365, 0.267),vec3(0.561,0.365, 0.267),vec3(0.388,0.157, 0.063),vec3(0.353,0.110, 0.063),vec3(0.353,0.110, 0.063),vec3(0.502,0.310, 0.255),vec3(0.808,0.714, 0.647),vec3(0.592,0.384, 0.310),vec3(0.388,0.125, 0.063),vec3(0.592,0.384, 0.310),vec3(0.592,0.384, 0.310),vec3(0.612,0.404, 0.322),vec3(0.420,0.141, 0.063),vec3(0.420,0.141, 0.063),vec3(0.420,0.141, 0.063),
        vec3(0.733,0.573, 0.471),vec3(0.733,0.573, 0.471),vec3(0.733,0.573, 0.471),vec3(0.561,0.365, 0.267),vec3(0.353,0.110, 0.063),vec3(0.655,0.510, 0.451),vec3(0.655,0.510, 0.451),vec3(0.655,0.510, 0.451),vec3(0.796,0.643, 0.557),vec3(0.796,0.643, 0.557),vec3(0.592,0.384, 0.310),vec3(0.796,0.643, 0.557),vec3(0.612,0.404, 0.322),vec3(0.612,0.404, 0.322),vec3(0.612,0.404, 0.322),vec3(0.612,0.404, 0.322),
        vec3(0.710,0.510, 0.420),vec3(0.710,0.510, 0.420),vec3(0.588,0.416, 0.353),vec3(0.588,0.416, 0.353),vec3(0.592,0.451, 0.420),vec3(0.537,0.376, 0.322),vec3(0.537,0.376, 0.322),vec3(0.537,0.376, 0.322),vec3(0.549,0.384, 0.322),vec3(0.549,0.384, 0.322),vec3(0.678,0.502, 0.420),vec3(0.678,0.502, 0.420),vec3(0.667,0.490, 0.431),vec3(0.808,0.604, 0.518),vec3(0.667,0.490, 0.431),vec3(0.667,0.490, 0.431),
        vec3(0.588,0.416, 0.353),vec3(0.471,0.325, 0.286),vec3(0.588,0.416, 0.353),vec3(0.588,0.416, 0.353),vec3(0.592,0.451, 0.420),vec3(0.482,0.302, 0.224),vec3(0.592,0.451, 0.420),vec3(0.482,0.302, 0.224),vec3(0.678,0.502, 0.420),vec3(0.549,0.384, 0.322),vec3(0.678,0.502, 0.420),vec3(0.808,0.620, 0.518),vec3(0.525,0.380, 0.345),vec3(0.525,0.380, 0.345),vec3(0.808,0.604, 0.518),vec3(0.525,0.380, 0.345),
        vec3(0.471,0.325, 0.286),vec3(0.471,0.325, 0.286),vec3(0.710,0.510, 0.420),vec3(0.588,0.416, 0.353),vec3(0.537,0.376, 0.322),vec3(0.592,0.451, 0.420),vec3(0.592,0.451, 0.420),vec3(0.592,0.451, 0.420),vec3(0.678,0.502, 0.420),vec3(0.420,0.271, 0.224),vec3(0.678,0.502, 0.420),vec3(0.420,0.271, 0.224),vec3(0.667,0.490, 0.431),vec3(0.667,0.490, 0.431),vec3(0.667,0.490, 0.431),vec3(0.667,0.490, 0.431),
        vec3(0.588,0.416, 0.353),vec3(0.710,0.510, 0.420),vec3(0.471,0.325, 0.286),vec3(0.353,0.235, 0.224),vec3(0.592,0.451, 0.420),vec3(0.647,0.525, 0.518),vec3(0.647,0.525, 0.518),vec3(0.592,0.451, 0.420),vec3(0.678,0.502, 0.420),vec3(0.420,0.271, 0.224),vec3(0.420,0.271, 0.224),vec3(0.549,0.384, 0.322),vec3(0.388,0.271, 0.259),vec3(0.667,0.490, 0.431),vec3(0.525,0.380, 0.345),vec3(0.388,0.271, 0.259),
        vec3(0.525,0.388, 0.341),vec3(0.525,0.388, 0.341),vec3(0.353,0.204, 0.161),vec3(0.525,0.388, 0.341),vec3(0.569,0.443, 0.408),vec3(0.451,0.302, 0.259),vec3(0.451,0.302, 0.259),vec3(0.686,0.584, 0.557),vec3(0.518,0.380, 0.353),vec3(0.667,0.545, 0.502),vec3(0.518,0.380, 0.353),vec3(0.667,0.545, 0.502),vec3(0.655,0.506, 0.427),vec3(0.655,0.506, 0.427),vec3(0.518,0.333, 0.224),vec3(0.655,0.506, 0.427),
        vec3(0.698,0.576, 0.525),vec3(0.698,0.576, 0.525),vec3(0.698,0.576, 0.525),vec3(0.525,0.388, 0.341),vec3(0.686,0.584, 0.557),vec3(0.808,0.729, 0.710),vec3(0.686,0.584, 0.557),vec3(0.569,0.443, 0.408),vec3(0.667,0.545, 0.502),vec3(0.816,0.710, 0.655),vec3(0.816,0.710, 0.655),vec3(0.816,0.710, 0.655),vec3(0.796,0.682, 0.631),vec3(0.796,0.682, 0.631),vec3(0.796,0.682, 0.631),vec3(0.655,0.506, 0.427),
        vec3(0.698,0.576, 0.525),vec3(0.871,0.765, 0.710),vec3(0.871,0.765, 0.710),vec3(0.698,0.576, 0.525),vec3(0.686,0.584, 0.557),vec3(0.686,0.584, 0.557),vec3(0.808,0.729, 0.710),vec3(0.808,0.729, 0.710),vec3(0.816,0.710, 0.655),vec3(0.816,0.710, 0.655),vec3(0.969,0.875, 0.808),vec3(0.816,0.710, 0.655),vec3(0.796,0.682, 0.631),vec3(0.937,0.859, 0.839),vec3(0.937,0.859, 0.839),vec3(0.937,0.859, 0.839),
        vec3(0.871,0.765, 0.710),vec3(0.871,0.765, 0.710),vec3(0.871,0.765, 0.710),vec3(0.871,0.765, 0.710),vec3(0.686,0.584, 0.557),vec3(0.808,0.729, 0.710),vec3(0.808,0.729, 0.710),vec3(0.686,0.584, 0.557),vec3(0.667,0.545, 0.502),vec3(0.816,0.710, 0.655),vec3(0.969,0.875, 0.808),vec3(0.816,0.710, 0.655),vec3(0.796,0.682, 0.631),vec3(0.796,0.682, 0.631),vec3(0.518,0.333, 0.224),vec3(0.796,0.682, 0.631),
        vec3(0.827,0.686, 0.624),vec3(0.655,0.471, 0.376),vec3(0.655,0.471, 0.376),vec3(0.655,0.471, 0.376),vec3(0.580,0.424, 0.353),vec3(0.580,0.424, 0.353),vec3(0.482,0.286, 0.192),vec3(0.776,0.698, 0.678),vec3(0.667,0.514, 0.439),vec3(0.667,0.514, 0.439),vec3(0.816,0.694, 0.624),vec3(0.518,0.333, 0.259),vec3(0.451,0.235, 0.192),vec3(0.451,0.235, 0.192),vec3(0.631,0.459, 0.396),vec3(0.631,0.459, 0.396),
        vec3(0.827,0.686, 0.624),vec3(0.655,0.471, 0.376),vec3(0.655,0.471, 0.376),vec3(0.655,0.471, 0.376),vec3(0.580,0.424, 0.353),vec3(0.580,0.424, 0.353),vec3(0.580,0.424, 0.353),vec3(0.580,0.424, 0.353),vec3(0.518,0.333, 0.259),vec3(0.816,0.694, 0.624),vec3(0.816,0.694, 0.624),vec3(0.816,0.694, 0.624),vec3(0.451,0.235, 0.192),vec3(0.631,0.459, 0.396),vec3(0.816,0.682, 0.600),vec3(0.816,0.682, 0.600),
        vec3(0.655,0.471, 0.376),vec3(0.482,0.255, 0.129),vec3(0.827,0.686, 0.624),vec3(0.655,0.471, 0.376),vec3(0.482,0.286, 0.192),vec3(0.580,0.424, 0.353),vec3(0.678,0.561, 0.514),vec3(0.580,0.424, 0.353),vec3(0.667,0.514, 0.439),vec3(0.816,0.694, 0.624),vec3(0.667,0.514, 0.439),vec3(0.667,0.514, 0.439),vec3(0.816,0.682, 0.600),vec3(0.816,0.682, 0.600),vec3(0.631,0.459, 0.396),vec3(0.451,0.235, 0.192),
        vec3(0.827,0.686, 0.624),vec3(1.000,0.906, 0.871),vec3(1.000,0.906, 0.871),vec3(0.827,0.686, 0.624),vec3(0.776,0.698, 0.678),vec3(0.776,0.698, 0.678),vec3(0.776,0.698, 0.678),vec3(0.776,0.698, 0.678),vec3(0.816,0.694, 0.624),vec3(0.969,0.875, 0.808),vec3(0.969,0.875, 0.808),vec3(0.969,0.875, 0.808),vec3(1.000,0.906, 0.808),vec3(1.000,0.906, 0.808),vec3(0.816,0.682, 0.600),vec3(1.000,0.906, 0.808)
    );

    return image[idx];
}

vec3 sample_jupiter_a(int idx)
{
    const vec3 image[256] = vec3[]
    (
        vec3(0.969,0.937, 0.871),vec3(0.557,0.384, 0.329),vec3(0.969,0.937, 0.871),vec3(0.353,0.110, 0.063),vec3(0.753,0.643, 0.588),vec3(0.753,0.643, 0.588),vec3(0.753,0.643, 0.588),vec3(0.753,0.643, 0.588),vec3(0.804,0.690, 0.631),vec3(0.969,0.922, 0.871),vec3(0.643,0.463, 0.396),vec3(0.969,0.922, 0.871),vec3(0.353,0.094, 0.031),vec3(0.784,0.655, 0.569),vec3(0.784,0.655, 0.569),vec3(1.000,0.937, 0.839),
        vec3(0.969,0.937, 0.871),vec3(0.557,0.384, 0.329),vec3(0.969,0.937, 0.871),vec3(0.557,0.384, 0.329),vec3(0.937,0.906, 0.839),vec3(0.937,0.906, 0.839),vec3(0.569,0.384, 0.341),vec3(0.753,0.643, 0.588),vec3(0.482,0.235, 0.161),vec3(0.804,0.690, 0.631),vec3(0.482,0.235, 0.161),vec3(0.969,0.922, 0.871),vec3(0.569,0.373, 0.298),vec3(1.000,0.937, 0.839),vec3(0.353,0.094, 0.031),vec3(0.784,0.655, 0.569),
        vec3(0.969,0.937, 0.871),vec3(0.353,0.110, 0.063),vec3(0.761,0.659, 0.600),vec3(0.557,0.384, 0.329),vec3(0.753,0.643, 0.588),vec3(0.388,0.125, 0.094),vec3(0.753,0.643, 0.588),vec3(0.937,0.906, 0.839),vec3(0.482,0.235, 0.161),vec3(0.969,0.922, 0.871),vec3(0.482,0.235, 0.161),vec3(0.969,0.922, 0.871),vec3(0.569,0.373, 0.298),vec3(1.000,0.937, 0.839),vec3(0.784,0.655, 0.569),vec3(0.569,0.373, 0.298),
        vec3(0.969,0.937, 0.871),vec3(0.353,0.110, 0.063),vec3(0.969,0.937, 0.871),vec3(0.557,0.384, 0.329),vec3(0.937,0.906, 0.839),vec3(0.388,0.125, 0.094),vec3(0.569,0.384, 0.341),vec3(0.937,0.906, 0.839),vec3(0.643,0.463, 0.396),vec3(0.804,0.690, 0.631),vec3(0.643,0.463, 0.396),vec3(0.804,0.690, 0.631),vec3(0.353,0.094, 0.031),vec3(0.784,0.655, 0.569),vec3(0.784,0.655, 0.569),vec3(0.569,0.373, 0.298),
        vec3(0.451,0.235, 0.161),vec3(0.612,0.447, 0.384),vec3(0.612,0.447, 0.384),vec3(0.612,0.447, 0.384),vec3(0.290,0.141, 0.129),vec3(0.871,0.667, 0.549),vec3(0.290,0.141, 0.129),vec3(0.871,0.667, 0.549),vec3(0.525,0.306, 0.255),vec3(0.698,0.549, 0.482),vec3(0.698,0.549, 0.482),vec3(0.871,0.796, 0.710),vec3(0.722,0.580, 0.502),vec3(0.906,0.796, 0.710),vec3(0.537,0.369, 0.298),vec3(0.722,0.580, 0.502),
        vec3(0.451,0.235, 0.161),vec3(0.451,0.235, 0.161),vec3(0.451,0.235, 0.161),vec3(0.451,0.235, 0.161),vec3(0.675,0.490, 0.408),vec3(0.675,0.490, 0.408),vec3(0.290,0.141, 0.129),vec3(0.290,0.141, 0.129),vec3(0.353,0.063, 0.031),vec3(0.353,0.063, 0.031),vec3(0.698,0.549, 0.482),vec3(0.525,0.306, 0.255),vec3(0.722,0.580, 0.502),vec3(0.537,0.369, 0.298),vec3(0.353,0.157, 0.094),vec3(0.722,0.580, 0.502),
        vec3(0.612,0.447, 0.384),vec3(0.773,0.659, 0.612),vec3(0.612,0.447, 0.384),vec3(0.773,0.659, 0.612),vec3(0.675,0.490, 0.408),vec3(0.675,0.490, 0.408),vec3(0.871,0.667, 0.549),vec3(0.871,0.667, 0.549),vec3(0.698,0.549, 0.482),vec3(0.871,0.796, 0.710),vec3(0.871,0.796, 0.710),vec3(0.525,0.306, 0.255),vec3(0.722,0.580, 0.502),vec3(0.722,0.580, 0.502),vec3(0.722,0.580, 0.502),vec3(0.537,0.369, 0.298),
        vec3(0.612,0.447, 0.384),vec3(0.937,0.875, 0.839),vec3(0.612,0.447, 0.384),vec3(0.773,0.659, 0.612),vec3(0.482,0.314, 0.267),vec3(0.482,0.314, 0.267),vec3(0.675,0.490, 0.408),vec3(0.675,0.490, 0.408),vec3(0.871,0.796, 0.710),vec3(0.525,0.306, 0.255),vec3(0.871,0.796, 0.710),vec3(0.525,0.306, 0.255),vec3(0.906,0.796, 0.710),vec3(0.353,0.157, 0.094),vec3(0.722,0.580, 0.502),vec3(0.722,0.580, 0.502),
        vec3(0.525,0.388, 0.341),vec3(0.729,0.592, 0.525),vec3(0.322,0.188, 0.161),vec3(0.937,0.796, 0.710),vec3(0.569,0.431, 0.384),vec3(0.353,0.188, 0.161),vec3(1.000,0.922, 0.839),vec3(0.569,0.431, 0.384),vec3(0.871,0.729, 0.612),vec3(0.569,0.424, 0.376),vec3(0.718,0.576, 0.494),vec3(0.871,0.729, 0.612),vec3(0.937,0.827, 0.776),vec3(0.678,0.537, 0.471),vec3(0.678,0.537, 0.471),vec3(0.549,0.396, 0.322),
        vec3(0.525,0.388, 0.341),vec3(0.937,0.796, 0.710),vec3(0.525,0.388, 0.341),vec3(0.937,0.796, 0.710),vec3(0.569,0.431, 0.384),vec3(0.353,0.188, 0.161),vec3(0.353,0.188, 0.161),vec3(0.569,0.431, 0.384),vec3(0.420,0.271, 0.259),vec3(0.569,0.424, 0.376),vec3(0.718,0.576, 0.494),vec3(0.569,0.424, 0.376),vec3(0.678,0.537, 0.471),vec3(0.678,0.537, 0.471),vec3(0.937,0.827, 0.776),vec3(0.678,0.537, 0.471),
        vec3(0.525,0.388, 0.341),vec3(0.525,0.388, 0.341),vec3(0.322,0.188, 0.161),vec3(0.525,0.388, 0.341),vec3(0.353,0.188, 0.161),vec3(0.784,0.675, 0.612),vec3(0.569,0.431, 0.384),vec3(0.569,0.431, 0.384),vec3(0.718,0.576, 0.494),vec3(0.569,0.424, 0.376),vec3(0.569,0.424, 0.376),vec3(0.420,0.271, 0.259),vec3(0.549,0.396, 0.322),vec3(0.549,0.396, 0.322),vec3(0.937,0.827, 0.776),vec3(0.808,0.682, 0.624),
        vec3(0.322,0.188, 0.161),vec3(0.937,0.796, 0.710),vec3(0.322,0.188, 0.161),vec3(0.729,0.592, 0.525),vec3(0.784,0.675, 0.612),vec3(0.784,0.675, 0.612),vec3(0.784,0.675, 0.612),vec3(0.569,0.431, 0.384),vec3(0.718,0.576, 0.494),vec3(0.569,0.424, 0.376),vec3(0.871,0.729, 0.612),vec3(0.718,0.576, 0.494),vec3(0.549,0.396, 0.322),vec3(0.549,0.396, 0.322),vec3(0.808,0.682, 0.624),vec3(0.937,0.827, 0.776),
        vec3(0.847,0.776, 0.722),vec3(1.000,0.984, 0.937),vec3(0.847,0.776, 0.722),vec3(0.847,0.776, 0.722),vec3(0.557,0.396, 0.341),vec3(0.761,0.651, 0.588),vec3(0.761,0.651, 0.588),vec3(0.761,0.651, 0.588),vec3(0.761,0.651, 0.624),vec3(0.761,0.651, 0.624),vec3(0.761,0.651, 0.624),vec3(0.557,0.380, 0.376),vec3(0.804,0.718, 0.655),vec3(0.804,0.718, 0.655),vec3(0.804,0.718, 0.655),vec3(0.804,0.718, 0.655),
        vec3(0.847,0.776, 0.722),vec3(0.847,0.776, 0.722),vec3(0.698,0.569, 0.506),vec3(0.847,0.776, 0.722),vec3(0.969,0.906, 0.839),vec3(0.557,0.396, 0.341),vec3(0.969,0.906, 0.839),vec3(0.969,0.906, 0.839),vec3(0.969,0.922, 0.871),vec3(0.969,0.922, 0.871),vec3(0.969,0.922, 0.871),vec3(0.969,0.922, 0.871),vec3(1.000,0.969, 0.937),vec3(1.000,0.969, 0.937),vec3(0.420,0.220, 0.094),vec3(0.612,0.467, 0.373),
        vec3(0.847,0.776, 0.722),vec3(0.847,0.776, 0.722),vec3(0.847,0.776, 0.722),vec3(1.000,0.984, 0.937),vec3(0.353,0.141, 0.094),vec3(0.353,0.141, 0.094),vec3(0.969,0.906, 0.839),vec3(0.557,0.396, 0.341),vec3(0.761,0.651, 0.624),vec3(0.761,0.651, 0.624),vec3(0.761,0.651, 0.624),vec3(0.761,0.651, 0.624),vec3(1.000,0.969, 0.937),vec3(0.420,0.220, 0.094),vec3(1.000,0.969, 0.937),vec3(0.420,0.220, 0.094),
        vec3(0.549,0.365, 0.290),vec3(0.847,0.776, 0.722),vec3(0.549,0.365, 0.290),vec3(0.847,0.776, 0.722),vec3(0.557,0.396, 0.341),vec3(0.969,0.906, 0.839),vec3(0.969,0.906, 0.839),vec3(0.761,0.651, 0.588),vec3(0.969,0.922, 0.871),vec3(0.353,0.110, 0.129),vec3(0.969,0.922, 0.871),vec3(0.761,0.651, 0.624),vec3(1.000,0.969, 0.937),vec3(0.804,0.718, 0.655),vec3(1.000,0.969, 0.937),vec3(0.420,0.220, 0.094)
    );

    return image[idx];
}

void main()
{

    ivec2 fragCoord = ivec2(gl_FragCoord.xy);
    ivec2 ipx = ivec2(fragCoord);

    frag_color = vec4(0);

    if(ipx.x >= 256)
    {
        return;
    };

    if(ipx.y >= 2)
    {
        return;
    };

    vec4 o = texelFetch(s_planetTexture, ipx, 0);
    frag_color = o;

    if(texelFetch(s_planetTexture, ivec2(0), 0).x > 0.5)
    {
        return;
    }; 
    
    int idx = ipx.x;

    if(ipx.y > 0)
    {
        frag_color.rgb = sample_jupiter_a(idx);
    }
    else 
    {
        frag_color.rgb = sample_jupiter_b(idx);
    };
}