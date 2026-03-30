precision mediump float;

varying vec2 v_uv;

uniform vec4 color;

uniform float inside;
uniform float end;

float atan2(float y, float x) {

    float s = abs(x) > abs(y) ? 1.0 : 0.0;
    float result = mix(3.141 / 2.0 - atan(x, y), atan(y, x), s);

    if (result < 0.0) return 6.282 + result;
    else return result;

}

float loop(float num, float max) {

    if (num < 0.0) num = max + num;
    else num = mod(num, max);

    return num;

}

void main() {

    vec2 uv = v_uv;

    uv.x -= 0.5;
    uv.y -= 0.5;

    float dist = sqrt(dot(uv, uv));

    float angle = loop(atan2(uv.y, uv.x) - 3.14 * 1.5, 6.282);

    gl_FragColor = color * float(dist < 0.5 && dist >= inside && angle < end * 6.282);

}