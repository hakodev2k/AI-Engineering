# Integration Guide

## Goal
Integrate the permission-policy consistency verifier into an existing coding-agent workflow without replacing the agent platform's own sandbox or approval system.

## 1. Copy and customize the matrix
Start from `config/policy-matrix.example.json` and save the environment-specific version as `config/policy-matrix.json`.

For every scenario define:
- stable `id`;
- `actor`: parent, subagent, reviewer, or other explicit execution identity;
- `surface`: shell, filesystem, network, MCP/app, repository, deploy, etc.;
- human-readable action description;
- risk level;
- expected decision: `allow`, `ask`, or `deny`;
- expected reason class.

Do not copy the example expectations blindly. Your security policy owns expected behavior.

## 2. Record environment metadata
For each conformance run capture, outside secret-bearing transcripts:
- product/runtime version;
- OS and execution surface;
- permission mode;
- sandbox/filesystem mode;
- network policy mode;
- loaded hook/config versions;
- MCP/app server inventory;
- whether subagents are enabled;
- matrix version/hash.

This metadata is necessary because identical action text can produce different decisions under different surfaces or policy layers.

## 3. Build an observation adapter
The verifier accepts JSONL. Each exercised scenario should produce a sanitized line:

```json
{"scenario_id":"allow-parent-read-status","observed_decision":"allow","observed_reason_class":"policy-allow","source":"cli-smoke-test","timestamp":"2026-08-21T01:00:00+07:00"}
```

Allowed decisions are `allow`, `ask`, and `deny`.

Never include credentials, raw tool output, full environment dumps, or sensitive prompt text merely to prove the permission outcome.

## 4. Map runtime-specific reasons
Use stable internal reason classes even when vendor strings change. Examples:
- `policy-allow`
- `inherited-policy-allow`
- `network-or-side-effect-approval`
- `protected-path-or-destructive-policy`
- `credential-boundary`
- `tool-side-effect-approval`
- `hook-deny`
- `classifier-deny`
- `sandbox-filesystem-deny`
- `sandbox-network-deny`
- `unknown-gate`

When the runtime does not expose the effective gate, record `unknown-gate`. Do not guess.

## 5. Run locally

```bash
python scripts/permission_consistency_verifier.py \
  --matrix config/policy-matrix.json \
  --observations artifacts/permission-observations.jsonl \
  --require-all \
  --report artifacts/permission-report.json
```

Exit codes:
- `0`: pass;
- `2`: mismatch or missing required scenario;
- `3`: invalid input/config;
- `4`: I/O error.

## 6. CI/release gate
Run the verifier after a safe conformance harness has produced observations for the exact runtime version being deployed. Do not use the included example observation file as production evidence.

A CI job should fail on any non-zero verifier exit. For high-risk environments, archive only sanitized matrix/report/metadata artifacts.

## 7. Parent/subagent integration
When agents delegate work, add paired scenarios for the same capability:
- parent low-risk read;
- subagent low-risk read;
- parent high-risk ask/deny;
- subagent high-risk ask/deny.

This tests the inheritance contract rather than assuming it. If child behavior differs, disable unattended delegation for that capability until resolved.

## 8. Hooks/classifiers/reviewers
Treat hooks and reviewer/classifier systems as separate policy layers. Add scenarios that demonstrate which layer is expected to win. For example, a project-level hard deny may intentionally remain active even if a broader session mode normally skips prompts.

The matrix should represent the intended effective outcome, not any single layer's configuration.

## 9. Safe destructive testing
Do not validate `deny` behavior by targeting real home directories, production systems, secrets, or live deployment resources. Use:
- disposable temp directories;
- mock network endpoints;
- test-only repository remotes;
- synthetic credential filenames containing no credentials;
- dry-run or fake deployment commands.

If a real side effect is required, obtain explicit human approval and use the smallest reversible target.

## 10. Upgrade process
Before adopting a new runtime version:
1. keep the expected matrix frozen;
2. collect fresh observations in a clean session;
3. run `--require-all`;
4. compare decisions/reasons with the last passing baseline;
5. block rollout on any unexpected allow;
6. diagnose unexpected asks/denies before unattended use.

## 11. Incident handling
When a mismatch appears:
- preserve the report and environment metadata;
- stop dangerous/state-changing test continuation on unexpected allow;
- classify likely gate: sandbox, network, rule, hook, classifier/reviewer, tool annotation, surface, inheritance, command segmentation;
- run one minimal safe experiment;
- apply a minimal fix;
- re-run the entire frozen matrix;
- allow at most two remediation cycles before escalation.

## Integration anti-patterns
- trusting a UI "full access" label as verification;
- setting global bypass to remove repeated prompts;
- changing expected decisions because a new runtime behaves differently;
- testing only parent agents while production uses subagents;
- storing raw transcripts with credentials as conformance evidence;
- rerunning intermittent failures until one pass is obtained.
