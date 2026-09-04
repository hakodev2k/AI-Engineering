# Policy Simulation Rules

## Purpose
Use non-enforcing evaluation to measure the real impact of proposed policy behavior before it changes protected systems.

## Scope
Applies to dry runs, shadow decisions, historical replay, proposed-policy comparison, and impact analysis.

## MUST
- High-impact policy changes MUST be simulated against representative inputs before broad enforcement when simulation is technically feasible.
- Simulation MUST compare current and proposed decisions and identify newly allowed, newly denied, and indeterminate cases.
- Historical replay data MUST preserve required decision context or clearly document missing dimensions.
- Simulation results used for approval MUST identify policy versions, input population, timeframe, and known sampling limitations.
- Sensitive replay data MUST retain its original access and handling protections.

## MUST NOT
- Simulation confidence MUST NOT be treated as proof that unrepresented cases are safe.
- Shadow evaluation MUST NOT alter the authoritative enforcement result.
- Sampled results MUST NOT be presented as complete coverage without evidence.

## SHOULD
- Policy changes SHOULD define expected decision deltas before simulation.
- High-volume systems SHOULD use stratified samples covering important tenants, resource types, actions, and edge cases.

## Exceptions
Skipping simulation requires reason, alternative evidence, blast-radius analysis, rollback readiness, and approval for high-risk policy changes.

## Verification
Review replay configuration, input representativeness, decision-delta reports, sampling methodology, data controls, and expected-versus-observed outcomes before enforcement.