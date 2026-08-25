# Effective Model Routing Attestation Guard

## Topic
Effective runtime model/reasoning-profile verification for multi-agent and cross-thread workflows.

## Category
Thinking

## Problem
A child agent or receiving thread can silently run with a model, reasoning effort, provider tier, or inherited state different from what the orchestrator intended. Plausible output is not proof that the intended execution profile was honored.

## Evidence
Current public evidence and source links are documented in `evidence/research.md`, including fresh Codex and Claude Code reports of wrong inheritance, cross-thread model-state leakage, ignored overrides, and misleading model displays.

## Existing approach
Agent profiles, dispatch overrides, inheritance rules, UI labels, and post-hoc log inspection.

## Existing limitations
Configuration describes intent but does not prove effective routing; UI/model self-reports can be wrong; drift can occur after spawn via resume or cross-thread handoff.

## Proposed improvement
Freeze task-specific routing intent, collect host-controlled effective runtime metadata, compare deterministically, and fail closed before accepting routing-sensitive output.

## Architecture
```text
config/policy.example.json
        |
        v
pre-dispatch intent ----> runtime dispatch
                              |
                              v
                     observed metadata
                              |
                              v
scripts/model_route_guard.py
        |
        +--> pass -> independent/result verification
        +--> drift -> bounded diagnosis + redispatch or escalation
```

## Package tree
```text
README.md
evidence/research.md
config/policy.example.json
skills/routing-attestation.md
rules/model-routing-contract.md
subagents/routing-verifier.md
workflows/attest-and-enforce.md
hooks/pre-dispatch-and-post-spawn.md
scripts/model_route_guard.py
tests/test_model_route_guard.py
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy this directory into the consuming repository or control-plane project.

## Configuration
Use `config/policy.example.json` as the intent shape. Keep only fields that are acceptance-critical, but always include `task_id`, `model`, and `reasoning_effort`. Set `allow_inherit=false` when explicit routing is required.

## Usage
```sh
python scripts/model_route_guard.py \
  --intent .routing/intent.json \
  --observed .routing/observed.json \
  --output .routing/attestation.json
```
Exit codes: `0` pass, `2` routing drift, `3` invalid/unreadable evidence.

The observed record should be produced by a host-controlled source such as provider request metadata, child session metadata, or `turn_context`, for example:

```json
{
  "task_id": "security-review-42",
  "model": "gpt-5.6-luna",
  "reasoning_effort": "low",
  "provider": "openai",
  "service_tier": "flex",
  "sandbox_mode": "read-only",
  "resolution": "explicit",
  "source": "turn_context"
}
```

## Workflow
Follow `workflows/attest-and-enforce.md`: Observe → freeze intent → dispatch → measure → diagnose → correct → measure again → verify. Retries are capped at two corrective redispatches.

## Metrics
Routing-attestation pass rate, model mismatch count, reasoning-effort mismatch count, missing runtime evidence, forbidden inheritance, rejected result count, and cost/quota variance by task class.

## Verification
Run:
```sh
python -m unittest discover -s tests -v
```
The package's deterministic unit suite covers exact match, model/effort mismatch, missing runtime evidence, and forbidden inheritance. An integration rollout should additionally dispatch a canary whose child profile intentionally differs from the parent and confirm runtime metadata.

## Safety
This guard does not change sandbox permissions or authorize tool use. It must never treat a stronger model as automatically safe, weaken security boundaries for routing convenience, or use model self-identification as evidence.

## Failure handling
Detection: script exit `2`/`3`. Evidence: preserve intent, observed metadata, attestation. Retry: maximum two after a diagnosed routing correction. Fallback: only a predeclared policy profile. Escalation: human approval for consequential downgrade. Stop: persistent drift or missing trustworthy evidence.

## Definition of Done
- **Implemented:** all files in the tree exist and the comparator is executable.
- **Measured:** requested and effective routing fields are captured for the task.
- **Verified:** unit tests pass and routing-sensitive output has a passing runtime attestation.
- No blocking mismatch, missing required evidence, hidden downgrade, or unapproved inheritance remains.

## Customization
Extend `FIELDS` in `scripts/model_route_guard.py` for host-specific routing attributes such as region or endpoint, and add matching tests. Do not add fields that cannot be observed independently at runtime.
