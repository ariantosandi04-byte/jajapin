import{r as s,j as p}from"./index-DSqPwI5E.js";/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),i=(...t)=>t.filter((e,r,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===r).join(" ").trim();/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var b={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=s.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:a="",children:n,iconNode:d,...l},c)=>s.createElement("svg",{ref:c,...b,width:e,height:e,stroke:t,strokeWidth:o?Number(r)*24/Number(e):r,className:i("lucide",a),...l},[...d.map(([u,f])=>s.createElement(u,f)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=(t,e)=>{const r=s.forwardRef(({className:o,...a},n)=>s.createElement(g,{ref:n,iconNode:e,className:i(`lucide-${m(t)}`,o),...a}));return r.displayName=`${t}`,r},h={default:"bg-primary text-primary-foreground hover:opacity-90",secondary:"bg-secondary text-foreground hover:bg-secondary/80",outline:"border border-border bg-transparent hover:bg-secondary",ghost:"hover:bg-secondary",link:"text-primary underline-offset-4 hover:underline",accent:"bg-accent text-white hover:opacity-90",lime:"bg-brand-lime text-brand-forest-deep hover:opacity-90 font-semibold"},y={default:"h-11 px-6 py-2",sm:"h-9 px-4 text-sm",lg:"h-12 px-8 text-base",icon:"h-10 w-10"},x=s.forwardRef(({className:t="",variant:e="default",size:r="default",children:o,...a},n)=>p.jsx("button",{ref:n,className:`inline-flex items-center justify-center rounded-full font-body font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 ${h[e]} ${y[r]} ${t}`,...a,children:o}));x.displayName="Button";const j={logo:"/assets/logo-jajapin.jpg",hero:"/assets/hero-sawah.png"};export{x as B,w as c,j as s};
