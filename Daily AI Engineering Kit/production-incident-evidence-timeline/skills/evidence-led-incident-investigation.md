# Skill: Evidence-Led Incident Investigation

## Purpose
Build a traceable incident timeline and determine what is known, inferred, contradicted, and still unknown before proposing a mitigation or root cause.

## When to use
Use for production outages, elevated errors, latency regressions, data inconsistencies, stuck background processing, integration failures, or suspicious behavior involving multiple evidence sources.

## Inputs
- incident trigger and observed user impact
- normalized `incident-timeline.json`
- deployment/configuration/change metadata
- relevant architecture or service map
- logs, metrics, traces, alerts, operator actions, and tickets when available

## Preconditions
- preserve original evidence before editing or filtering it
- timestamps must be explicit; offset-aware timestamps are preferred
- investigation access should be read-only unless a separate approved mitigation step begins

## Process
1. Define the incident window: first known impact, last known healthy evidence, and current status.
2. Separate **observations** from **interpretations**. Every observation must identify its evidence source.
3. Identify affected and unaffected components to establish boundaries.
4. Correlate deploys, config changes, traffic shifts, dependency changes, and operator actions with the impact window.
5. Identify state mutations: writes, queue publications, cache changes, external calls, retries, and background jobs.
6. Mark evidence quality: direct, derived, sampled, delayed, incomplete, or uncertain.
7. Build at most five active hypotheses. Each must explain the observed impact and specify evidence that would disconfirm it.
8. Prioritize hypotheses by explanatory power, timing fit, and ability to test safely—not by familiarity.
9. Test one discriminating question at a time. Prefer checks that separate competing hypotheses.
10. Reject hypotheses contradicted by evidence. Do not preserve them by changing the interpretation of observations.
11. If a mitigation is proposed, state expected effect, blast radius, rollback path, and approval requirement.
12. After mitigation, distinguish recovery evidence from causal evidence; recovery after a change does not by itself prove root cause.
13. Produce an incident report with evidence references, hypotheses, decisions, recovery checks, and unresolved uncertainties.

## Allowed tools
- read-only log/metric/trace queries
- repository search and read-only Git inspection
- deployment/config metadata inspection
- deterministic timeline normalization and report validation scripts
- non-destructive tests in safe environments

## Constraints
- never invent missing timestamps or telemetry
- never claim causality from temporal proximity alone
- never execute production mutation as part of this skill
- preserve contradictory evidence in the report

## Expected output
An `incident-report.json` containing the impact summary, timeline references, hypotheses, selected cause status, mitigation, recovery checks, approvals, and uncertainties.

## Verification
- each causal claim points to evidence IDs
- major alternative hypotheses are explicitly accepted, rejected, or unresolved
- recovery is supported by measurable checks
- report passes `verify-incident-report.py`
- independent Evidence Reviewer returns `pass` or `human-approval-required`

## Failure handling
- evidence source unavailable: retry collection at most twice if failure appears transient, then record the gap
- timestamps conflict: keep originals and record clock uncertainty
- no hypothesis survives testing: mark cause `unconfirmed`; do not fabricate a winner
- same reviewer gap persists after two revisions: stop and escalate

## Stop conditions
Stop when either:
- evidence is sufficient for mitigation and/or verified RCA according to the workflow; or
- required evidence cannot be established safely, the investigation revision budget is exhausted, or a production action requires human approval.
