# animazon.in/ceramica — complete backup

Captured 2026-08-24 over HTTPS from https://animazon.in/ceramica/.
This supersedes the earlier partial backup (index.html + CSS only), which has
been deleted.

## Contents — complete, byte sizes verified against the server listing

| file | bytes |
|---|---|
| index.html | 1,319 |
| favicon.svg | 9,522 |
| icons.svg | 5,031 |
| concrete.png | 805,752 |
| assets/index-BZZfMlBy.css | 3,954 |
| assets/index-B--aQ42u.js | 1,474,740 |
| assets/index-DO8K4CU7.js | 1,474,731 |

`concrete.png` is SHA-256 identical to `public/concrete.png` in this repo.

## Why the earlier attempt failed

The Hostinger MCP file API refuses binaries and truncates large text, and the
Bash tool in this environment has no outbound network. Neither limit applies to
PowerShell's `Invoke-WebRequest`, which is how this was captured. Worth
remembering: "no network" was only ever true of one of the two shells.

## What this site is

A different brand — "ceramica. | A store of grinding media" — sharing the 3D
hero implementation that Platinaa's is derived from. It is the reference render
for the hero's lighting.

## Hero parameters transcribed from assets/index-B--aQ42u.js

    Canvas   shadows; gl {antialias:true, alpha:false, powerPreference:'high-performance'}
             camera {fov:40, near:0.1, far:100}; camera.position(0,11,7.5) lookAt(0,0,0.5)
             no dpr clamp, no toneMapping override
    Env      preset "apartment" -> lebombo_1k.hdr
             background:true, backgroundBlurriness:0.05, backgroundIntensity:0.35,
             environmentIntensity:1.5
    Lights   ambient 0.25
             directional [10,22,14] i=3 #FFF8EE castShadow mapSize 2048
                         bias -3e-4 normalBias 0.03, shadow-camera ortho [-10,10,10,-10,0.1,50]
             directional [-12,10,-8] i=0.45 #D0D8EC
             point [0,14,-14] i=0.7 #FFFFFF
             point [4,1,8] i=0.15 #F5EDE0
    Balls    instancedMesh 269, sphereGeometry [1,32,32]
             meshPhysicalMaterial color #FFFFFF, roughness 0.05, metalness 0,
             clearcoat 1, clearcoatRoughness 0.02, ior 1.76, specularIntensity 1,
             sheen 0.3, sheenRoughness 0.2, envMapIntensity 1.8, reflectivity 1
    Bowls    latheGeometry; #FAFAFA, roughness 0.08, metalness 0.02, clearcoat 1,
             clearcoatRoughness 0.05, envMapIntensity 1.2, side DoubleSide
    Floor    plane 100x100, concrete.png repeat 8x8, #F0F0F0, roughness 0.9, metalness 0.1
    Shadows  ContactShadows [0,0.005,0] opacity 0.7 scale 35 blur 1.8 far 6 #1E1A14
    Post     EffectComposer > N8AO {aoRadius 1.2, intensity 2.5, halfRes} + ToneMapping {mode 4}
    Bowls    xl cx-6.75 r0.45 n14 | large cx-2.25 r0.35 n30
             med cx2.25 r0.22 n65 | small cx6.75 r0.14 n160   (bowlR 2.1, bowlH 1.0)

Note: ToneMapping mode 4 is UNCHARTED2 in the bundled `postprocessing` enum,
not ACES. Platinaa uses the named ACES_FILMIC constant instead, matching the
renderer default that applies when the composer is not mounted.

## Deploy safety

A backup now exists, so deploying Platinaa into a separate subfolder no longer
risks this site. Do not deploy over /ceramica itself — it is a live site for a
different brand.
