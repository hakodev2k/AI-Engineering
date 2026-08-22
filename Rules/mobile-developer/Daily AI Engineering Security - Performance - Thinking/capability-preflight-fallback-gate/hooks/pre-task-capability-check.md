# Hook: Pre-Task Capability Check

## Trigger
Before entering a task stage that has one or more hard external/runtime capability dependencies.

## Preconditions
The stage declares required capabilities and semantic properties. Discovery and harmless probe mechanisms are available or explicitly marked unavailable.

## Action
Build or update the capability ledger, run deterministic validation, and block the dependent stage unless every hard capability is ready or has a verified equivalent fallback.

## Script/command
```bash
python scripts/capability_check.py evaluate --input runtime/capabilities.json
```

For package verification:
```bash
python scripts/capability_check.py verify tests/fixtures.json
```

## Expected result
A JSON result containing overall decision plus per-capability status, missing evidence, and fallback decision.

## Failure behavior
Block only the dependent stage. Preserve discovery/probe evidence and report the exact missing evidence level. Do not retry deterministic initialization failures indefinitely and do not silently substitute a weaker capability.

## Blocks completion
Yes, when a hard dependency remains unverified or a fallback fails semantic-equivalence checks.