# Audio Codecs and Processing

## Purpose
Engineer intelligible, low-latency realtime audio across codecs, capture devices, acoustic processing, and variable networks.

## When to use
Use for audio quality regressions, codec policy, echo/noise issues, level problems, or bandwidth adaptation.

## Inputs
SDP, codec settings, audio RTC stats, recordings when authorized, device/platform data, network metrics, and user reports.

## Core knowledge
Opus is common for interactive audio because it adapts across speech/music, bitrate, packetization, and loss. Echo cancellation, noise suppression, automatic gain control, device routing, sample rates, packetization time, jitter buffering, and discontinuous transmission interact with perceived quality and latency.

## Procedure
1. Classify the symptom: silence, clipping, echo, robotic speech, delay, level variation, or dropouts.
2. Separate capture, encode, transport, decode, and playback stages.
3. Confirm negotiated codec and parameters.
4. Inspect levels, packet loss, jitter, concealment, RTT, and jitter-buffer delay.
5. Compare device and OS cohorts.
6. Validate AEC/NS/AGC assumptions and audio route.
7. Reproduce with controlled loss, jitter, and acoustic conditions.
8. Tune one variable at a time and preserve a baseline.
9. Validate subjective and objective outcomes.

## Decision points
Favor speech resilience over fidelity for conversational products; preserve wider bandwidth/stereo where music requirements justify cost. Longer jitter buffers improve resilience but add latency. Aggressive suppression may remove desired content.

## Common failure patterns
Treating every audio defect as network loss; double processing; excessive gain; wrong device route; codec parameter mismatch; optimizing MOS-like metrics while conversational delay worsens.

## Verification
Verify negotiated parameters, capture/playback correctness, impairment tests, latency budget, cohort metrics, and authorized listening or objective quality evaluation.

## Expected output
A bounded audio diagnosis or validated processing/codec policy with quality evidence.

## Stop conditions
Escalate when recording consent is absent, platform audio APIs are defective, or changes affect regulated capture/retention requirements.