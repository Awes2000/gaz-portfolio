"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ACCESS_EVENT, bindRipple } from "@/lib/bus";

/* ============================================================
   RIPPLE BACKGROUND — deep-water caustics via a tiny WebGL
   fragment shader (domain-warped fbm), ported 1:1 from
   js/ripple.js. Monochrome navy/steel, near-invisible at rest,
   a gentle swell follows the cursor. Frame-capped, low-res
   backing store. Reduced-motion / no-WebGL → static CSS
   gradient + grain.
   ============================================================ */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`;
const FRAG = `
precision mediump float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;
uniform float u_str; uniform float u_audio;
float hash(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);
  float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  vec2 p=uv*vec2(u_res.x/u_res.y,1.0)*2.2;
  float t=u_time*0.055;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+2.0*q+vec2(1.7,9.2)+t*0.7),fbm(p+2.0*q+vec2(8.3,2.8)-t*0.6));
  float f=fbm(p+3.0*r);
  vec2 m=vec2(u_mouse.x/u_res.x,u_mouse.y/u_res.y);
  float md=distance(uv,m);
  float swell=u_str*smoothstep(0.40,0.0,md);
  f+=swell*0.40 + u_audio*0.10;
  vec3 navy=vec3(0.039,0.098,0.184);
  vec3 deep=vec3(0.024,0.063,0.125);
  vec3 steel=vec3(0.145,0.205,0.315);
  float shade=smoothstep(0.16,0.98,f);
  vec3 col=mix(navy,steel,shade*0.85);
  col=mix(col,deep,pow(1.0-shade,3.0)*0.5);
  col+=steel*pow(shade,2.5)*0.16*(0.7+swell);
  float d=distance(uv,vec2(0.5,0.46));
  col*=1.0-0.34*d*d;
  gl_FragColor=vec4(col,1.0);
}`;

export function RippleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const staticFallback = () => {
      document.documentElement.classList.add("rm-static");
    };
    if (reduce || !canvas) {
      staticFallback();
      return;
    }

    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      staticFallback();
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      staticFallback();
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      staticFallback();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uStr = gl.getUniformLocation(prog, "u_str");
    const uAudio = gl.getUniformLocation(prog, "u_audio");

    const lowPower = !!navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const SCALE = lowPower ? 0.55 : 0.75; // low-res backing store, CSS stretches it
    let W = 0;
    let H = 0;
    const resize = () => {
      W = Math.max(2, Math.floor(innerWidth * SCALE));
      H = Math.max(2, Math.floor(innerHeight * SCALE));
      canvas.width = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
    };
    resize();
    addEventListener("resize", resize);

    // pointer + state (mouse in backing-store px, y flipped for GL)
    let mx = W / 2, my = H / 2, tmx = mx, tmy = my;
    let str = 0, audio = 0, resolve = 0;

    /* signature "resolve" on gate unlock: the field locks on — three
       converging swells snap to centre, then the shimmer decays out */
    const onAccess = () => {
      resolve = 1;
      const cx = innerWidth / 2;
      const cy = innerHeight / 2;
      [[0.32, 0], [0.18, 140], [0, 300]].forEach(([off, delay]) => {
        setTimeout(() => {
          tmx = (cx + innerWidth * (off as number)) * SCALE;
          tmy = (innerHeight - cy) * SCALE;
          str = 1.0;
        }, delay as number);
      });
    };
    window.addEventListener(ACCESS_EVENT, onAccess);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      tmx = e.clientX * SCALE;
      tmy = (innerHeight - e.clientY) * SCALE;
      str = Math.min(1, str + 0.12);
    };
    const onDown = () => {
      str = 1;
    };
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown);

    const unbind = bindRipple({
      setAudioLevel(v) {
        audio = Math.max(0, Math.min(1, v));
      },
      burst(x, y) {
        if (typeof x === "number" && typeof y === "number") {
          tmx = x * SCALE;
          tmy = (innerHeight - y) * SCALE;
        }
        str = 1.0;
      },
    });

    const FRAME = 1000 / (lowPower ? 30 : 45);
    let last = performance.now(), acc = 0;
    const t0 = last;
    let rafId = 0;
    const draw = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      if (acc < FRAME) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      acc = 0;
      mx += (tmx - mx) * 0.08;
      my += (tmy - my) * 0.08;
      str *= 0.96; // swell decays back to ambient
      /* resolve envelope: a ringing shimmer that settles as access locks in */
      let audioOut = audio;
      if (resolve > 0.01) {
        audioOut = Math.min(1, audio + resolve * (0.3 + 0.3 * Math.sin((1 - resolve) * 24)));
        resolve *= 0.972;
      }
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uStr, str);
      gl.uniform1f(uAudio, audioOut);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    // pause accounting when tab hidden (battery)
    const onVis = () => {
      if (!document.hidden) last = performance.now();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(rafId);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      window.removeEventListener(ACCESS_EVENT, onAccess);
      document.removeEventListener("visibilitychange", onVis);
      unbind();
    };
  }, [reduce]);

  /* depth stack above the water: a vertical luminance scrim grounds
     the HUD and footer, a static monochrome grain gives the surface
     tooth and kills gradient banding. Both are pure CSS, no frames. */
  return (
    <>
      <canvas id="ripple" ref={canvasRef} aria-hidden="true" />
      <div className="bg-scrim" aria-hidden="true" />
      <div className="bg-grain" aria-hidden="true" />
    </>
  );
}
