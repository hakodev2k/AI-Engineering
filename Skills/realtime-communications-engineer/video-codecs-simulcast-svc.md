# Video Codecs, Simulcast, and SVC

## Purpose
Select and operate video encoding strategies that balance quality, latency, compatibility, bandwidth, and compute.

## When to use
Use for codec policy, multiparty quality, layer adaptation, CPU pressure, bandwidth regressions, or interoperability changes.

## Inputs
Supported client capabilities, SDP, encoder stats, resolution/fps targets, SFU behavior, network distributions, and device cohorts.

## Core knowledge
Realtime video choices include VP8, VP9, H.264, AV1 and platform-specific capabilities. Simulcast sends multiple encodings; scalable video coding creates dependency layers within an encoding. Keyframes, bitrate allocation, temporal/spatial layers, hardware acceleration, and decoder limits affect quality and resource usage.

## Procedure
1. Define target devices, participant layouts, and latency budget.
2. Inventory codec encode/decode and hardware-acceleration support.
3. Define fallback order and interoperability constraints.
4. Choose simulcast or SVC based on client/SFU support and switching needs.
5. Set resolution, frame-rate, bitrate, and layer boundaries from measured networks.
6. Validate keyframe and layer-switch behavior.
7. Measure sender CPU/GPU, thermal pressure, bandwidth, and receiver decode cost.
8. Test packet loss, bandwidth drops, participant growth, and mixed clients.
9. Roll out by cohort with quality telemetry.

## Decision points
Prefer broad compatibility when reach dominates; newer codecs may reduce bandwidth but increase compute or compatibility risk. Simulcast is operationally straightforward but consumes uplink; SVC can be efficient but requires coherent end-to-end support.

## Common failure patterns
Enabling unsupported profiles; excessive simultaneous encodes; layer thresholds that oscillate; frequent keyframes; ignoring mobile thermal limits; assuming nominal resolution equals rendered quality.

## Verification
Verify negotiation, layer publication/subscription, adaptation stability, decode success, resource consumption, and user-visible freeze/quality metrics across representative devices.

## Expected output
A documented codec/layer policy and measured validation showing acceptable quality and resource trade-offs.

## Stop conditions
Stop when licensing, hardware support, or client compatibility requirements are unresolved.