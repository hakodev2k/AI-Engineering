# Workflow: Discover → Verify → Install

## Trigger
An agent discovers or proposes installing/enabling a Skill, MCP server, plugin, package, or repository.

## Goal
Allow useful capability discovery without converting attacker-controlled discovery metadata into installation trust.

## Inputs
User goal, candidate metadata, policy, artifact, registry/repository evidence.

## Baseline
Record whether the current flow installs from mutable refs, whether it hashes artifacts, and whether approvals are bound to immutable identity.

## Stages
1. **Observe** — capture user goal and candidate source without executing it.
2. **Measure baseline** — record source, owner, ref type, registry, and artifact availability.
3. **Diagnose trust** — canonicalize source/publisher and identify missing provenance evidence.
4. **Form hypothesis** — candidate is safe enough only if deterministic identity requirements pass; popularity/content is non-authoritative.
5. **Acquire safely** — download/clone into isolated staging without executing hooks/scripts.
6. **Verify** — compute digest and run `scripts/verify_capability.py` with `config/policy.json`.
7. **Decision checkpoint** — deny, request digest-bound human approval, or allow.
8. **Install** — only via sandboxed installer with network/filesystem boundaries preserved.
9. **Measure again** — verify installed ref/digest matches approved evidence.
10. **Independent verification** — Capability Security Verifier confirms audit record and final identity.

## Responsible agent
Discovery agent finds candidates; Capability Security Verifier owns trust decision; installer executes only approved artifacts.

## Tools
Read-only metadata lookup, hashing/static inspection, verifier script, sandboxed installer.

## Outputs
Trust decision, immutable identity, digest, audit evidence, installation result.

## Checkpoints
Before artifact acquisition, before approval, before execution, and after installation identity check.

## Metrics
Immutable-pin coverage, digest-bound approval coverage, malicious-fixture block rate, benign-fixture pass rate, identity mismatch detections.

## Retry policy
Metadata/hash acquisition may retry at most 2 times with backoff. Policy failures do not retry automatically.

## Stop conditions
Deterministic deny; approval refusal/expiry; evidence unavailable after retries; installed artifact mismatch; or verified successful install.

## Failure path
Fail closed, preserve evidence, do not execute the candidate, and escalate ambiguous trust to a human.

## Definition of Done
Evidence documented; immutable identity captured; verifier passed or valid approval obtained; installed digest/ref rechecked; sandbox preserved; independent verification complete; no blocking discrepancy remains.