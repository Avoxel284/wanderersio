precision mediump float;

varying vec2 v_uv;

uniform float alpha;
uniform float dissolve;

uniform vec4 color;

uniform sampler2D texture;

float mmm(float a, float b) {

  return a - (b * floor(a / b));

}

float rand(vec2 co) {

  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);

}

float atan2(float y, float x) {

  float s = abs(x) > abs(y) ? 1.0 : 0.0;
  float result = mix(3.141 / 2.0 - atan(x, y), atan(y, x), s);

  if (result < 0.0) return 6.282 + result;
  else return result;

}


void main() {

  vec2 uv = v_uv;

  uv.x -= 0.5;
  uv.y -= 0.5;

  float dist = sqrt(dot(uv, uv));

  if (dist < 0.5) {

    float x = atan2(uv.x, uv.y) / 6.282;

    float r = 0.4 + sin(x * 6.28 * 6.0) * 0.03;

    if (dist > r) {

      float repeat = floor(2.0 * 3.1415 * 80.0 / 68.0) * 2.0;

      float y = 1.0 - (dist - r) / (0.5 - r);

      x = mod(repeat * x, 1.0);

      gl_FragColor = color;
      gl_FragColor.a = texture2D(texture, vec2(0.281 + 0.265 * x, 0.039 + 0.058 * y)).a;



    } else if (dist > 0.45 && rand(uv) < (dist - 0.45) / 0.05) {

      gl_FragColor = color;

    } else {

      gl_FragColor = color;

    }


  } else {

    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

  }
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

}