precision mediump float;

varying vec2 v_uv;

uniform vec4 color;
uniform float radius;
uniform float border;
uniform float x;
uniform float y;

float rand(vec2 co) {

  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);

}

void main() {

  vec2 uv = v_uv;

  uv.x -= 0.5 + x;
  uv.y -= 0.5 + y;

  float dist = sqrt(dot(uv, uv));

  if(dist > radius - border && dist < radius) {

    float g = (float(dist - radius + border) / border);

    g = floor(g * 4.0) / 4.0; 

    gl_FragColor = color * g;

    return;
    
  }



  gl_FragColor = color * float(dist > radius); 

}