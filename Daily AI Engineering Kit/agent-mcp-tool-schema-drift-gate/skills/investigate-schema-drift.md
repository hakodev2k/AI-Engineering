# Skill: Investigate MCP Schema Drift
## Purpose
Identify exact contract drift and affected consumers.
## Inputs
Baseline/candidate snapshots, repository, task/incident context.
## Process
1. Validate snapshot origin and comparability.
2. Run the deterministic gate.
3. Group findings by tool/resource/prompt.
4. Search repository for every affected capability name.
5. Trace argument construction for affected tools.
6. Separate confirmed breakage from external-consumer risk.
7. Record facts, hypotheses, evidence, and open questions separately.
8. Hand confirmed findings to Migration Planner.
## Verification
Every confirmed break must have deterministic report evidence or a reproducible runtime validation failure.
## Failure handling
Capture failures retry at most twice if transient. Invalid/incomparable snapshots block.
## Stop conditions
Unknown contract origin, permission failure, or consumer impact requiring human decision.
