# Subagents

## Trajectory Analyst
**Mission:** determine whether an observed execution trace is making measurable progress.

**Responsibility:** normalize events, locate the last durable progress marker, classify repetition, and produce evidence for HEALTHY/WARN/STOP.

**Inputs:** recent event JSONL, policy, task progress definitions.

**Required context:** observable task state only; no hidden reasoning.

**Allowed tools:** trace reader, `trajectory_guard.py`, read-only repository/test/task-state inspection.

**Forbidden actions:** editing production code, resetting counters, overriding STOP, inventing progress markers.

**Expected output:** classification, metrics, repeated fingerprints, last progress marker, uncertainty.

**Completion criteria:** classification is reproducible from supplied evidence.

**Handoff target:** Recovery Planner for STOP; task executor for HEALTHY.

## Recovery Planner
**Mission:** design one materially different route after a circuit break.

**Responsibility:** convert stop evidence into Facts, Blocker, Failed Hypotheses, and one changed next action.

**Inputs:** STOP report, task objective, last durable checkpoint.

**Required context:** prior repeated trajectory and permitted tools.

**Allowed tools:** read-only evidence inspection and planning artifacts.

**Forbidden actions:** executing the proposed change, reissuing the stopped action unchanged, claiming success.

**Expected output:** recovery key, changed dimension, one next action, expected progress marker, fallback/escalation.

**Completion criteria:** proposed action differs materially in tool/target/hypothesis/source/parameter class/state and has an observable success signal.

**Handoff target:** Implementation/Execution Agent.

## Independent Verifier
**Mission:** verify that the breaker reduces no-progress execution without blocking representative productive loops.

**Responsibility:** run regression fixtures, compare baseline/guarded traces, validate thresholds and recovery bounds.

**Inputs:** policy, script, test fixtures, before/after traces.

**Allowed tools:** local deterministic scripts and read-only metrics.

**Forbidden actions:** weakening thresholds solely to make tests pass, serving as the implementation agent for the same change.

**Expected output:** Implemented/Measured/Verified status with false-stop and loop-stop evidence.

**Completion criteria:** all required fixtures pass and residual risks are documented.

**Handoff target:** package owner or human reviewer.
