# Permission Ask Policy Canary

**Category:** Security

## Problem
Agent hosts can load and display permission configuration while runtime behavior fails to enforce an `ask` gate on a particular surface or autonomy mode. That creates a silent fail-open: operators believe a destructive action requires confirmation, but the action can execute automatically.

## Evidence
See `evidence/research.md`. Recent Claude Code reports independently describe `permissions.ask` rules not prompting, hook-generated `ask` decisions being auto-approved in the VS Code auto-accept surface, and destructive commands matching explicit `ask` rules executing without confirmation in auto mode.

## Existing approach
Teams inspect settings, permission UIs, hook definitions, and documentation, then assume the configured precedence is active. Some move dangerous operations to `deny` or rely on sandboxing.

## Existing limitations
Configuration presence is not execution evidence. Runtime semantics can vary by client surface, version, permission mode, extension integration, and hook path. A safety boundary therefore needs an executable acceptance test.

## Proposed improvement
Run a harmless permission canary before enabling unattended operation and after any relevant upgrade/config change. The canary compares declared decisions with observed prompt/execution behavior and fails closed on any mismatch or unknown result.

## Architecture
```text
policy + host metadata
  -> harmless allow/ask/deny probes
  -> observation.json
  -> permission_canary.py
  -> PASS / FAIL_OPEN / FAIL_CLOSED / UNKNOWN
  -> independent Permission Verifier
  -> autonomy allowed or blocked
```

## Actual package tree
```text
permission-ask-policy-canary/
├── README.md
├── evidence/research.md
├── skills/validate-permission-enforcement.md
├── rules/permission-policy-rules.md
├── subagents/permission-verifier.md
├── workflows/permission-canary-rollout.md
├── hooks/pre-autonomy.md
├── scripts/permission_canary.py
└── tests/test_permission_canary.py
```

## Installation
Requires Python 3.10+. Copy the package into the repository or agent-control project. No third-party Python dependency is required.

## Observation format
```json
{
  "metadata": {
    "host": "example",
    "version": "x.y.z",
    "surface": "cli",
    "mode": "auto",
    "policy_revision": "abc123"
  },
  "observations": [
    {"name":"allow-probe","expected":"allow","observed":"allow","prompted":false,"executed":true},
    {"name":"ask-probe","expected":"ask","observed":"ask","prompted":true,"executed":false},
    {"name":"deny-probe","expected":"deny","observed":"deny","prompted":false,"executed":false}
  ]
}
```

## Usage
Use only harmless synthetic actions in a disposable workspace, then run:
```bash
python scripts/permission_canary.py observations.json
```

Exit codes:
- `0`: PASS
- `2`: FAIL_OPEN
- `3`: UNKNOWN/invalid evidence
- `4`: FAIL_CLOSED

## Workflow
Follow `workflows/permission-canary-rollout.md` and invoke `hooks/pre-autonomy.md` before unattended execution.

## Metrics
Track matrix coverage, fail-open rate, fail-closed rate, validation age, remediation latency, and unattended sessions started without a fresh PASS.

## Verification
Run:
```bash
python -m unittest tests/test_permission_canary.py
```
Then execute the harmless canary matrix on every in-scope surface/mode. A config screenshot or `/permissions` listing alone is not verification.

## Safety
Never use a production push, deletion, deployment, database mutation, credential, message, or network egress as a probe. The canary validates the permission path with disposable effects only.

## Failure handling
A fail-open or unknown result blocks autonomy. Downgrade to manual operation or deterministic deny boundaries. Re-test once only after a concrete remediation such as version/config/surface change.

## Definition of Done
- current evidence documented;
- all required surfaces/modes have harmless observations;
- validator tests pass;
- zero fail-open/unknown rows remain;
- independent verification completed;
- fallback policy documented;
- no dangerous probe was executed.

## Customization
Add project-specific harmless probes and metadata fields, but preserve the invariant that runtime enforcement—not configuration presence—is the acceptance criterion.