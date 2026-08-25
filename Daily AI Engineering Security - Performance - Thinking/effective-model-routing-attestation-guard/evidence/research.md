# Research — Effective Model Routing Attestation Guard

## Topic
Effective runtime model and reasoning-effort routing for multi-agent systems.

## Category
Thinking

## Problem
Agent orchestrators can declare one model/reasoning profile for a child or receiving thread while the runtime silently uses another profile. The workflow may still complete, so configuration drift can remain invisible while changing reasoning quality, latency, quota consumption, and verification reliability.

## Why it matters now
Model-aware delegation is increasingly used to separate cheap bounded work from consequential review. Fresh 2026 reports across Codex and Claude Code show both runtime routing drift and observability drift: children inherit the wrong model, cross-thread messages mutate receiver settings, or the UI reports the parent model rather than the effective child model.

## Affected users
Developers using subagents, background agents, agent teams, headless runners, model-tier routing, or cost/quality policies; platform teams that need deterministic execution profiles; reviewers who rely on a stronger model or higher reasoning effort for independent verification.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #40016 (2026-08-21) reports full-history subagent forks silently inheriting another model/quota pool instead of failing closed when routing is incompatible: https://github.com/openai/codex/issues/40016
2. OpenAI Codex issue #34520 (2026-07-21) reports a cross-thread delegation changing the receiving thread from `gpt-5.6-sol/high` to the sender's `gpt-5.6-terra/medium`: https://github.com/openai/codex/issues/34520
3. OpenAI Codex issue #32587 (2026-07-12) reports tool-backed subagents inheriting the parent Sol Ultra profile instead of custom child settings: https://github.com/openai/codex/issues/32587
4. Claude Code issue #83938 (2026-08-04) reports per-agent model overrides being silently ignored for headless workflows in a specific Bedrock configuration: https://github.com/anthropics/claude-code/issues/83938
5. Claude Code issue #86489 (2026-08-13) reports the Agents view showing the parent model instead of the child's actual model, demonstrating that display metadata is not sufficient runtime evidence: https://github.com/anthropics/claude-code/issues/86489
6. OpenAI Developer Community reports from July 2026 describe custom Codex subagent profiles unexpectedly inheriting parent model/effort and draining quota; later Multi-Agent V2 guidance emphasizes checking runtime metadata rather than trusting configuration: https://community.openai.com/t/issue-where-chatgpt-codex-sub-agents-inherit-the-parent-model-instead-of-using-the-model-specified-in-the-agent-configuration/1386539

## Existing approaches
- Declare `model` and reasoning effort in custom agent configuration.
- Pass explicit model/effort overrides when the runtime exposes them.
- Inspect UI labels, logs, session metadata, or child `turn_context` after dispatch.
- Use parent inheritance intentionally for homogeneous workloads.
- Apply cost-aware routing instructions in prompts or agent definitions.

## Remaining limitations
- Configuration is intent, not proof of effective runtime routing.
- UI labels can be sourced from parent/default state and disagree with actual child inference.
- A routing mismatch can be silent and still produce plausible output.
- Model and reasoning effort may drift independently.
- Cross-thread delivery can mutate receiver state after initial validation.
- A verifier that only checks before spawn cannot detect post-spawn or post-message drift.

## Root-cause analysis
1. Multiple routing state sources exist: global config, agent profile, dispatch parameters, inherited thread state, runtime defaults, and UI metadata.
2. Resolution happens at execution time, but many systems validate only declarative configuration.
3. Child/receiver state can be mutated by inheritance, resume, fork, or message-handling paths.
4. Observability surfaces may display requested or parent values instead of provider/runtime-effective values.
5. Cost and quality policy is often advisory instead of enforced as an acceptance contract.

## Interpretation
The recurring engineering gap is not merely incorrect model selection; it is the absence of a portable acceptance step that binds a task's intended execution profile to runtime evidence before trusting the result.

## Improvement opportunity
Introduce a fail-closed routing attestation contract. Record intended model, reasoning effort, provider/service tier and inheritance policy; capture effective runtime evidence immediately after spawn and again before accepting consequential output; reject or quarantine results when required evidence is missing or mismatched.

## Proposed solution
This package supplies a deterministic comparator, enforceable routing rules, a verifier subagent, a pre-dispatch/post-spawn hook contract, and a bounded workflow. It never asks a model to self-report its identity; runtime/provider metadata is the evidence source.

## Goal
Make execution-profile drift observable and prevent unverified child or receiver results from being treated as valid completion evidence.

## Metrics
- routing_attestation_pass_rate
- model_mismatch_count
- reasoning_effort_mismatch_count
- missing_runtime_evidence_count
- forbidden_inheritance_count
- rejected_result_count
- cost/quota variance by task class

## Trigger
Before dispatch, immediately after child/thread creation, after cross-thread handoff or resume, and before accepting high-impact output.

## Inputs
Routing intent JSON plus runtime-observed metadata JSON.

## Outputs
Pass/drift status, field-level evidence, blocking exit code, and an auditable routing attestation record.

## Relevant sources
See the six links above; each is summarized rather than copied. The evidence distinguishes reported behavior from the package's proposed enforcement mechanism.