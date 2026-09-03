# Modality Requirements Analysis

## Purpose
Translate a product or research requirement into an explicit multimodal system scope. This skill prevents teams from adding vision, audio, video, document, or sensor inputs without a clear user value, quality target, operational constraint, or fallback path.

## When to use
Use when designing a new multimodal feature, evaluating whether multiple modalities are necessary, migrating from text-only AI, or reviewing an existing system whose inputs and outputs are poorly defined. Do not use it as a substitute for detailed model benchmarking once the modality scope is already stable.

## Inputs
- User or business requirement
- Representative input examples
- Expected outputs and acceptance criteria
- Latency, throughput, cost, privacy, and deployment constraints
- Known model/provider constraints

## Preconditions
Identify the actual decision or task the system must perform. Separate desired capabilities from implementation preferences such as a particular model vendor or architecture.

## Context to inspect
Inspect current workflows, error tolerance, human review points, data availability, modality quality, device/network limitations, existing APIs, and downstream consumers. Confirm whether missing or corrupted modalities are normal production conditions.

## Core knowledge
Multimodal systems trade richer context for higher data complexity, cost, latency, privacy exposure, and failure surface. Each modality should contribute unique signal. Redundant modalities may improve robustness, but only if fusion and evaluation show measurable gains. Output modality matters as much as input modality: generating text from images has different risks than generating images from text or controlling a physical system.

## Procedure
1. Define the user task and the decision the model enables.
2. List candidate input and output modalities.
3. For each modality, document the unique signal it contributes.
4. Identify whether the task can be solved acceptably with fewer modalities.
5. Define minimum quality for each input modality.
6. Define missing-modality and degraded-modality behavior.
7. Specify target latency, throughput, availability, cost, and privacy constraints.
8. Define expected error classes and their business impact.
9. Identify whether human review or deterministic validation is required.
10. Define offline and online success metrics.
11. Record assumptions that must be validated with data.
12. Produce a modality contract for implementation and evaluation.

## Decision points
- Prefer fewer modalities when added inputs do not improve task accuracy or resilience enough to justify complexity.
- Prefer asynchronous processing for long audio/video when real-time response is unnecessary.
- Prefer device-side preprocessing when privacy or bandwidth dominates, but validate device compute limits.
- Require human review when incorrect multimodal interpretation can create material safety, legal, or financial harm.

## Common failure patterns
- Adding a modality because a model supports it rather than because the task needs it.
- Ignoring missing or low-quality inputs.
- Defining only average accuracy while overlooking catastrophic error classes.
- Assuming all modalities are synchronized and trustworthy.
- Failing to define fallback behavior when one modality is unavailable.

## Verification
Verify that every selected modality has a measurable purpose, each constraint is testable, fallback behavior is specified, and acceptance criteria cover both normal and degraded inputs. A requirement is implemented when scope is documented; it is verified only when representative data confirms the chosen modalities materially support the target task.

## Expected output
A concise multimodal requirements specification containing task definition, modality contract, quality thresholds, constraints, metrics, failure modes, and validation assumptions.

## Stop conditions
Stop and escalate when the core user decision is undefined, representative data is unavailable, regulatory/privacy constraints are unresolved, or stakeholders cannot agree on acceptable error impact.