# Workflows

## Workflow A — Preflight Every Write-Capable Operation

**Trigger:** agent plans any file mutation or shell command that may write.

**Goal:** prove the canonical destination is authorized before mutation.

**Inputs:** requested path, operation type, optional shell command, `config/policy.json`.

**Baseline:** record whether the current host performs only lexical path checks, whether symlink leaf writes are possible, and guard latency before integration.

**Context:** repository root, writable roots, OS, target path, protected-path policy.

**Stages:**
1. **Observe** — Filesystem Boundary Analyst identifies apparent path, parent path, and expected destination.
2. **Resolve** — run `scripts/write_target_guard.py` against the target.
3. **Classify** — separate pass, policy block, resolution failure, protected-target approval requirement.
4. **Plan** — choose direct safe host API or Safe Atomic Replacement; never switch to a lower-control write path.
5. **Checkpoint** — if any other tool can mutate filesystem state, repeat preflight before write.
6. **Execute** — Implementation Agent performs exactly the approved mutation.
7. **Verify** — Independent Verification Agent checks canonical result, file type, and intended diff.

**Tools:** guard script, structured host write API, Git status/diff, filesystem metadata.

**Outputs:** preflight JSON, mutation result, post-write verification.

**Checkpoints:** after target resolution; immediately before write; after write.

**Metrics:** coverage of write operations, blocked escape count, p50/p95 preflight latency, outside-root writes (target zero), unexpected link-state changes.

**Retry policy:** one retry only for transient metadata/resolution errors after refreshing filesystem state. A policy violation is not retryable without a changed plan or explicit human decision.

**Stop conditions:** outside-root target, link leaf under default policy, protected target without approval, unresolved canonical identity, second resolution failure.

**Failure path:** preserve metadata, do not write, hand off to analyst/human owner.

**Verification:** target remains within approved canonical root and only intended repository diff exists.

**Definition of Done:** preflight passed; mutation used approved path; post-write verification passed; metrics captured; no outside-root changes.

## Workflow B — Safe Atomic File Replacement

**Trigger:** agent needs to replace the contents of an existing regular file.

**Goal:** avoid predictable temporary paths, link-following replacement, and partial writes.

**Inputs:** destination path, generated content, policy.

**Baseline:** verify whether current implementation uses shell redirection or predictable temporary names.

**Stages:**
1. Preflight destination.
2. Create a random exclusive temporary file in the destination directory.
3. Write, flush, and close the temp file.
4. Re-run destination preflight.
5. Abort if link state or canonical parent changed.
6. Atomically promote temp file using a safe host API.
7. Verify final destination is the expected regular file.
8. Verify intended diff.

**Responsible agent:** Implementation Agent; final verification by Independent Verification Agent.

**Metrics:** replacement success rate, race detections, leftover temp files, outside-root writes.

**Retry policy:** at most one complete restart after an ordinary I/O failure; zero retries after a target-identity change.

**Stop conditions:** target becomes a link, parent changes, atomic promotion unavailable across filesystems, ownership is ambiguous.

**Failure path:** delete only the owned temp file; preserve destination; escalate target-state changes.

**Definition of Done:** final regular file verified, no temp leak, intended diff only.

## Workflow C — Suspected Symlink Write Incident

**Trigger:** unexpected runtime corruption, outside-root modification, recursive launcher, target-integrity block after a prior write, or evidence of link substitution.

**Goal:** contain, establish facts, recover from trusted state, and prevent recurrence.

**Stages:**
1. Stop agent writes and automatic retries.
2. Record requested path, canonical chain, link metadata, timestamps, and hashes where safe.
3. Identify whether runtime/system/user files were modified.
4. Compare affected object with trusted Git/package state.
5. Restore through trusted package/repository mechanisms; privileged recovery requires human approval.
6. Add a regression fixture matching the failure.
7. Tighten policy/integration if root cause is confirmed.
8. Independent verifier runs full escape and normal-write suite.

**Metrics:** time to containment, verified recovery, recurrence rate, regression coverage.

**Retry policy:** no automated repeat of the write that triggered incident handling.

**Stop conditions:** evidence of broader host compromise, privileged recovery required, target identity unresolved.

**Definition of Done:** affected state restored and independently verified; regression blocks reproduction; residual risks documented.
