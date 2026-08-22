# Hooks

## PreTask

**Trigger:** before analysis starts.

**Action:** verify the repository is readable and record the raw request unchanged.

**Command/script:** repository-specific read-only checks.

**Failure behavior:** stop if required source context cannot be accessed.

## PreImplementation

**Trigger:** before the first production-code edit.

**Action:** validate contract structure and unresolved obligations.

**Command:**

```bash
python .ai/acceptance-contract-gate/scripts/validate-contract.py acceptance-contract.json
python .ai/acceptance-contract-gate/scripts/check-unresolved-obligations.py acceptance-contract.json --phase pre-implementation
```

**Failure behavior:** block implementation.

## PostDiscovery

**Trigger:** when implementation discovers behavior not represented in the accepted contract.

**Action:** mark the contract stale and return to decomposition/challenge.

**Command/script:** semantic workflow action; no deterministic command can decide materiality alone.

**Failure behavior:** do not continue implementing the newly discovered behavior until the gate passes again.

## PreComplete

**Trigger:** before declaring success.

**Action:** ensure required obligations have verification evidence and no blocking ambiguity is open.

**Command:**

```bash
python .ai/acceptance-contract-gate/scripts/check-unresolved-obligations.py acceptance-contract.json --phase pre-completion
```

**Failure behavior:** completion status must remain `implemented-not-verified` or `blocked`; do not report verified success.
