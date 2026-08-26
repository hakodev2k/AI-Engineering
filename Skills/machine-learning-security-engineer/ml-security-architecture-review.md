# ML Security Architecture Review

## Purpose
Perform a senior-level security review of an ML architecture and produce prioritized, testable engineering decisions before release or major redesign.

## When to use
Use at design milestones, before production launch, after material architecture changes, or when inheriting an ML platform with unclear controls.

## Inputs
Architecture/data-flow diagrams, threat model, requirements, deployment topology, IAM, data classification, model lifecycle, SLOs, and existing security evidence.

## Preconditions
Review current implementation evidence where available; do not assume diagrams are accurate.

## Context to inspect
Inspect collection, training, evaluation, registries, serving, admin paths, third parties, network boundaries, observability, backups, and incident recovery.

## Core knowledge
Architecture review should focus on trust boundaries, irreversible high-impact decisions, blast radius, provenance, and recovery. ML-specific risks must be integrated with conventional application, cloud, data, and supply-chain security rather than reviewed separately.

## Procedure
1. Confirm business goals, protected assets, and risk tier.
2. Validate architecture against actual repositories/configuration where possible.
3. Trace sensitive data and model artifacts end to end.
4. Review identity and authorization at each trust boundary.
5. Review data and artifact integrity/provenance.
6. Assess untrusted input and third-party model/data paths.
7. Review inference abuse, privacy leakage, and resource-exhaustion controls.
8. Review isolation, secrets, network, and runtime hardening.
9. Review security logging, alerting, rollback, and incident recovery.
10. Challenge single points of trust and broad privileges.
11. Rank findings by exploitability, impact, and control gaps.
12. Convert accepted changes into owners, tests, and deadlines.

## Decision points
Prefer simple enforceable boundaries over policy-only controls. Accept complexity only when it reduces material risk. Defer low-risk hardening when it would delay remediation of exploitable high-impact paths.

## Common failure patterns
Checklist compliance without attack paths; reviewing only model behavior; recommendations with no owner/test; assuming private network equals trusted; ignoring recovery; proposing controls that break latency/cost constraints without alternatives.

## Verification
Confirm every critical finding maps to evidence, remediation, or explicit risk acceptance; verify high-risk controls with tests; re-review changed architecture before closure.

## Expected output
A prioritized architecture-security decision record with evidence, remediation owners, verification criteria, and residual risks.

## Stop conditions
Stop when critical diagrams or access evidence are unavailable, a suspected active compromise emerges, or accepting a material residual risk exceeds reviewer authority.