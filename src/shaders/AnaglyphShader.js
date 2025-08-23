// src/shaders/AnaglyphShader.js

export const AnaglyphShader = {
    uniforms: {
      tDiffuse: { value: null },
      intensity: { value: 0.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float intensity;
      varying vec2 vUv;
      void main() {
        float shift = 0.003 * intensity;
        vec2 dirR = vec2(1.0, 0.0) * shift;
        vec2 dirG = vec2(-0.5, 0.866) * shift;
        vec2 dirB = vec2(-0.5, -0.866) * shift;
        float r = texture2D(tDiffuse, vUv + dirR).r;
        float g = texture2D(tDiffuse, vUv + dirG).g;
        float b = texture2D(tDiffuse, vUv + dirB).b;
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `
  };