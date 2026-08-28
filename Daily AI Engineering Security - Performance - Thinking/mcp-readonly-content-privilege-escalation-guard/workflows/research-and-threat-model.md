# Workflow: Research and Threat Model

## Trigger
Add or materially change an MCP content source or coding-agent permission set.

## Goal
Identify privilege amplification paths before deployment.

## Inputs
Server/tool metadata, content origins, agent tool permissions, authentication and approval policy.

## Baseline
Record current trust labels, enabled tools, network/filesystem privileges, and approval behavior.

## Context
Facts, Evidence, Assumptions, Attack paths, Decision, Risks, Verification status.

## Stages
1. Observe source provenance and content flow.
2. Measure downstream agent privilege.
3. Diagnose trust-boundary crossings.
4. Form explicit attack hypotheses.
5. Run deterministic guard against benign and adversarial fixtures.
6. Revise threat model at most twice if evidence contradicts the hypothesis.
7. Hand off to independent security verification.

## Responsible agent
Threat analyst; independent verifier at final stage.

## Tools
Read-only inspection, guard script, sandboxed fixtures.

## Outputs
Threat model, event fixtures, gate decisions, risk register.

## Checkpoints
After privilege inventory, after attack-path mapping, before final verification.

## Metrics
Untrusted crossings, attack-fixture block rate, approval coverage, secrets exposed.

## Retry policy
Maximum 2 threat-model revisions.

## Stop conditions
Any live secret exposure, destructive production path, missing provenance, or exhausted revisions.

## Failure path
Disable the affected integration or privileged binding until remediated.

## Verification
Independent security verifier reproduces the boundary tests.

## Definition of Done
All identified privilege crossings have deterministic controls and no blocking attack path remains.
