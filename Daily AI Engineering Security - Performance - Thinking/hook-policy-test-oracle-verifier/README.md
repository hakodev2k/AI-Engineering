# Hook Policy Test Oracle Verifier

**Category:** Security

## Problem
Security hooks can execute successfully while making the wrong authorization decision, and host permission modes can transform or ignore an otherwise-correct `ask`/`deny` result. A test that proves only “the hook ran” is not evidence that a dangerous action was blocked.

## Evidence
See `evidence/research.md`. Current August 2026 reports include a Claude Code hook tester that returns success for both allow and deny outcomes, `ask` decisions silently resolving to allow in the VS Code extension, and project hooks that fail to fire while sibling deny rules from the same settings file still work.

## Existing approach and limitations
Common approaches are manual spot checks, exit-code-only hook tests, vendor hook development scripts, and configuration review. They often do not assert the semantic decision (`allow`, `deny`, `ask`), the exact tool/input, or the host surface/mode in which enforcement is expected.

## Proposed improvement
Use one expectation contract for unit and runtime evidence. `scripts/verify_hook_policy.py` can execute a trusted local hook without `shell=True` and compare the observed semantic decision with a JSON case matrix. The same tool can verify host-produced JSONL observations by case ID, so passing a unit hook test cannot substitute for runtime enforcement evidence.

## Architecture
```text
hook-policy-test-oracle-verifier/
├── README.md
├── evidence/research.md
├── hooks/pre-merge-policy-verification.md
├── rules/policy-test-oracle-rules.md
├── scripts/verify_hook_policy.py
├── skills/build-policy-case-matrix.md
├── subagents/security-verifier.md
├── tests/test_verify_hook_policy.py
└── workflows/unit-and-runtime-verification.md
```

## Installation
Python 3.10+; no third-party packages.

## Case file
```json
[
  {
    "id": "deny-infra-write",
    "expected": "deny",
    "input": {"hook_event_name":"PreToolUse","tool_name":"Write","tool_input":{"file_path":"infra/main.tf"}}
  }
]
```

## Unit usage
```bash
python scripts/verify_hook_policy.py --cases cases.json --hook ./guard.py
```
The hook executable is invoked directly with a minimal inherited environment and a five-second default timeout. Never run an untrusted hook merely to test it.

## Runtime usage
Have the host adapter emit JSONL such as `{"id":"deny-infra-write","actual":"deny"}` after the effective permission decision, then run:
```bash
python scripts/verify_hook_policy.py --cases cases.json --observed-jsonl runtime.jsonl
```

## Metrics
- expected-decision coverage by high-risk capability.
- mismatched decisions / total cases.
- missing runtime observations.
- mode/surface matrix coverage.
- false-allow count (expected deny/ask but actual allow).
- verification latency.

## Verification
`python -m unittest tests/test_verify_hook_policy.py` MUST pass. A security control is Verified only after high-risk cases pass against the effective runtime, not only the hook executable.

## Safety
The verifier MUST NOT execute untrusted hooks. It MUST NOT weaken `deny` to make tests pass. Runtime tests against destructive tools SHOULD use harmless canaries or sandboxed substitutes; dangerous/irreversible actions require explicit human approval.

## Failure handling
Any missing case, parse failure, timeout, or decision mismatch is blocking. Retry a failed runtime scenario at most once after collecting diagnostics; then stop and escalate.

## Definition of Done
**Implemented:** expectation matrix and verifier integrated. **Measured:** unit/runtime results collected. **Verified:** every required high-risk case has an effective runtime observation matching expectation, no false-allow remains, tests pass, and permission boundaries are preserved.
