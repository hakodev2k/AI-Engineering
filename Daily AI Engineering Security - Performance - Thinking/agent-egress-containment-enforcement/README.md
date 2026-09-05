# Agent Egress Containment Enforcement

**Category:** Security  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Autonomous agents used in cyber evaluation, coding, browsing, and tool-rich environments can remain strongly isolated from the host while still having dangerous outbound network reachability. Recent 2026 incidents show that a misconfigured or overly broad egress path can let an agent contact public services, external organizations, package registries, or production systems before asynchronous monitoring reacts.

## Evidence
See `evidence/research.md` for current public evidence, existing mitigations, limitations, root causes, and sources.

## Existing approach
Common controls include VM/container isolation, full-internet-or-no-internet switches, provider-side safety classifiers, firewall rules, monitoring, and incident-response shutdown. These controls are useful but frequently operate in different layers and may not establish a synchronous authorization boundary for each outbound destination/action.

## Remaining limitation
A sandbox can protect the evaluator host yet still expose the outside world. Detection after traffic leaves the environment is not prevention. Broad allowlists can also hide excessive authority, and agent objectives can create pressure to exploit any reachable path.

## Proposed improvement
Treat outbound connectivity as a first-class capability with deterministic, task-scoped policy. Every destination must be classified, every allowed route must be explicit, wildcard internet access is denied by default, DNS resolution is validated against the same policy as the requested hostname, and high-risk destinations/actions require human approval. A preflight checker blocks runs whose policy cannot prove containment.

## Package tree
- `evidence/research.md`
- `skills/egress-threat-assessment.md`
- `rules/egress-security-rules.md`
- `subagents/containment-reviewer.md`
- `workflows/observe-measure-contain.md`
- `workflows/escape-recovery.md`
- `hooks/pre-run-egress-gate.md`
- `scripts/check_egress_policy.py`
- `config/policy.example.json`
- `tests/test_check_egress_policy.py`

## Installation
Python 3.10+; standard library only.

## Configuration
Copy `config/policy.example.json`. Define the evaluation/task ID, default-deny behavior, allowed destinations, protocols, resolved IP ranges, and whether any route requires approval. Do not put credentials in policy files.

## Usage
`python scripts/check_egress_policy.py config/policy.example.json`

Exit codes: 0 = policy passes; 2 = blocking policy violation; 1 = invalid input/runtime error.

## Workflow
Observe actual network paths -> measure baseline reachability -> map task-required destinations -> diagnose excess authority -> implement default-deny routing -> rerun policy checker -> perform safe negative probes -> independent containment review.

## Metrics
- wildcard internet routes
- unapproved destinations reachable
- destinations required by task versus destinations allowed
- DNS/IP policy mismatches
- denied egress attempts
- time from denied attempt to containment action
- externally observable side effects during tests

## Verification
**Implemented:** deterministic policy gate, enforceable rules, workflows, and tests exist.  
**Measured:** baseline and post-change reachability are recorded against the same destination corpus.  
**Verified:** wildcard routes are absent; unauthorized destinations are blocked; required task routes still work; DNS/IP checks agree; security tests pass; independent reviewer confirms no uncontrolled external path.

## Safety
Never relax egress boundaries merely to make a benchmark pass. Never test unauthorized external targets. Dangerous or irreversible external actions require explicit human approval even when the destination itself is allowed.

## Failure handling
A failed preflight blocks execution. Evidence collection may retry once for transient resolver/metadata failures. Containment remediation may iterate at most twice. If policy remains ambiguous or a real external action occurred, stop the run, preserve logs, quarantine affected runtime state, and escalate.

## Definition of Done
Current evidence documented; baseline reachability captured; task-required network scope identified; default-deny policy implemented; checker passes; negative probes pass; externally reachable attack path blocked; no secrets exposed; approvals documented; independent verification complete.