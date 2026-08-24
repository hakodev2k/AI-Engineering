# Research — Auxiliary Inference Context Occupancy Isolation Guard

## Topic
Isolation of parent context occupancy from nested inference usage.
## Category
Performance
## Problem
Auxiliary model calls can reuse the parent transcript but their token usage is not the parent's current context size. Merging these quantities can trigger premature compaction; undercounting can cause context overflow.
## Why it matters now
Server-side advisors and multi-model agent paths are increasingly common, while compaction decisions are latency- and continuity-critical.
## Affected users
Agent users, coding teams, runtime/platform builders and operators of long multi-tool sessions.
## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #53065 (2026-04-25) reports advisor forwarding the full transcript to a second model and summing both usages into top-level fields, triggering premature auto-compaction. https://github.com/anthropics/claude-code/issues/53065
2. Claude Code issue #81620 (2026-07-27) reports advisor turns roughly doubling apparent context and compaction around half the real window, with measured transcripts. https://github.com/anthropics/claude-code/issues/81620
3. Claude Code issue #84738 (2026-08-07) reports rolled-up multi-iteration advisor usage causing auto-compaction hundreds of thousands of tokens early, especially for subagents. https://github.com/anthropics/claude-code/issues/84738
4. oh-my-pi issue #5282 (2026-07-12) reports the inverse failure: advisor context maintenance undercounts provider context and can cause runaway overflow errors. https://github.com/can1357/oh-my-pi/issues/5282
5. Hermes issue #9979 documents the adjacent accounting need to surface auxiliary/delegation tokens separately rather than hiding them. https://github.com/NousResearch/hermes-agent/issues/9979
### Interpretation
One usage scalar cannot safely serve billing, parent occupancy and nested-inference accounting. These are separate dimensions with different consumers.
## Existing approaches
Provider usage fields, local token estimates, context meters, compaction thresholds, child-agent usage telemetry and manual trace analysis.
## Remaining limitations
Top-level totals may roll up iterations; local estimates can undercount provider serialization; child usage may be invisible; compaction code may consume a billing-oriented total without provenance.
## Root-cause analysis
1. Usage fields lack semantic labels/provenance.
2. Parent and nested requests reuse substantial context.
3. Compaction consumes aggregate telemetry instead of a parent-current-prompt measurement.
4. Tests often validate total usage but not occupancy invariants across nested calls.
## Improvement opportunity
Introduce a deterministic invariant: auxiliary usage may increase cost totals but must not change parent prompt occupancy unless the parent transcript itself changes. Compare runtime signals against that invariant in trace tests.
## Proposed solution
A trace checker, enforceable rules, diagnosis skill, post-auxiliary hook, bounded workflow and independent benchmark verifier.
## Metrics
Occupancy error %, spurious compactions/task, overflow errors/task, parent/child tokens, total cost and latency.
## Trigger
After any advisor/helper/subagent inference and before compaction eligibility is recomputed.
## Inputs
JSON trace containing parent occupancy before/after, auxiliary usage and optional parent transcript delta.
## Outputs
Invariant findings and deterministic pass/block status.
## Relevant sources
- https://github.com/anthropics/claude-code/issues/53065
- https://github.com/anthropics/claude-code/issues/81620
- https://github.com/anthropics/claude-code/issues/84738
- https://github.com/can1357/oh-my-pi/issues/5282
- https://github.com/NousResearch/hermes-agent/issues/9979
