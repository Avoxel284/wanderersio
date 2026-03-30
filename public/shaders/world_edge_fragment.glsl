precision mediump float;

varying vec2 v_uv;

uniform vec4 color;

float rand(vec2 co) {

  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);

}

void main() {

  vec2 uv = v_uv;

  uv.x -= 0.5;
  uv.y -= 0.5;

  float dist = sqrt(dot(uv, uv));

  if(dist > 0.4 && dist < 0.5) {

    float g = (float(dist - 0.4) / 0.1);

    g = floor(g * 4.0) / 4.0; 

    gl_FragColor = color * g;

    return;
    
  }

  gl_FragColor = color * float(dist > 0.5); 

}