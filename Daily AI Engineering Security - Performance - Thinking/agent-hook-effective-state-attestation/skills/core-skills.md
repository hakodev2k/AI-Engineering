# Core Skills

## Skill 1 — Build an Effective Hook Inventory

**Purpose:** derive a normalized runtime hook snapshot without trusting a single configuration source.

**Trigger:** session start, configuration change, plugin enable/disable, organization switch, agent upgrade, or before a protected workflow.

**Inputs:** configured hook sources, plugin state, enterprise policy, runtime/debug hook listing, host version.

**Preconditions:** collection must be read-only; do not execute third-party hooks merely to enumerate them.

**Required context:** agent product/version, settings-source precedence, workspace identity, organization/profile identity.

**Tools:** host hook listing/debug events, JSON normalization, file hashing, `scripts/hook_state_guard.py`.

**Procedure:**
1. Record host/version and configuration-source identifiers.
2. Enumerate expected hooks from the approved manifest rather than inferring policy from arbitrary repository text.
3. Obtain the effective runtime hook listing from the host or an adapter that translates debug/event data into `{event, matcher, command, source}` records.
4. Normalize whitespace but do not rewrite commands semantically.
5. Store command hashes in reports; avoid copying full commands into long-lived telemetry unless required for local debugging.
6. Run deterministic reconciliation.
7. Mark status as `measured` only after a runtime snapshot exists.

**Decisions:** if the runtime cannot expose an effective hook list, mark attestation `unverified` and use an isolated canary only for explicitly approved critical hooks.

**Constraints:** never infer equality from natural-language similarity; never let an LLM approve an unknown hook by itself.

**Expected output:** normalized runtime snapshot and redacted attestation report.

**Metrics:** inventory coverage, unknown-hook count, required-hook coverage, snapshot age.

**Verification:** every runtime hook has event, matcher, source where available, and deterministic command fingerprint.

**Failure handling:** invalid/unavailable runtime state blocks critical workflows; retry once after a clean process restart, then escalate.

**Stop conditions:** verified match; or two failed collection attempts with evidence captured.

---

## Skill 2 — Reconcile Declared vs Effective State

**Purpose:** detect missing required hooks, active forbidden hooks, and unapproved extras.

**Trigger:** runtime snapshot collected.

**Inputs:** approved policy JSON and runtime snapshot JSON.

**Preconditions:** policy is version-controlled or otherwise integrity-protected.

**Required context:** criticality and expected state for each hook.

**Tools:** `python scripts/hook_state_guard.py --policy ... --runtime ...`.

**Procedure:**
1. Validate policy schema and unique hook IDs.
2. Fingerprint normalized `{event, matcher, command}` identities.
3. Compare all `required` identities against runtime.
4. Compare all `forbidden` identities against runtime.
5. Treat unknown hooks according to explicit policy; default is fail closed.
6. Produce counts and redacted mismatch details.
7. Separate `implemented`, `measured`, and `verified` status.

**Decisions:** a critical missing/forbidden mismatch blocks; optional missing hooks are reported but do not block unless local policy says otherwise.

**Constraints:** source labels are metadata, not the primary identity; command equivalence must not be guessed.

**Expected output:** machine-readable pass/block result.

**Metrics:** critical mismatch count, unknown-hook count, time-to-attest.

**Verification:** guard exits 0 only when policy passes.

**Failure handling:** non-zero validation/runtime errors are not converted to a pass.

**Stop conditions:** pass or an actionable blocking mismatch exists.

---

## Skill 3 — Verify Critical Hooks with an Isolated Canary

**Purpose:** add execution evidence when registry/listing integrity is uncertain.

**Trigger:** critical hook protects high-risk actions and the host supports a harmless isolated trigger.

**Inputs:** approved hook, temporary workspace, expected marker protocol.

**Preconditions:** hook owner explicitly supports canary mode; canary must not use production credentials or real repository writes.

**Required context:** event type, safe trigger action, expected external marker.

**Tools:** temporary directory, host test session, local marker/audit sink.

**Procedure:**
1. Create a temporary disposable workspace.
2. Set a unique non-secret canary ID.
3. Trigger only the minimal harmless event needed for the selected hook.
4. Verify the expected marker appears exactly once.
5. Verify no unexpected hook side effects occur.
6. Delete the temporary workspace after evidence is recorded.

**Decisions:** registry match + failed canary means runtime verification fails; do not weaken the expected hook requirement.

**Constraints:** do not invoke destructive hooks; do not run unknown hook commands directly.

**Expected output:** canary result linked to the attestation ID.

**Metrics:** critical hooks canary-verified / selected critical hooks, duplicate invocation count.

**Verification:** expected marker exactly once and no forbidden marker.

**Failure handling:** one retry after process restart; then block/escalate.

**Stop conditions:** verified canary or bounded retry exhausted.

---

## Skill 4 — Respond to Hook-State Drift

**Purpose:** recover safely without hiding a security-control failure.

**Trigger:** required hook missing, forbidden hook active, unknown hook active, or canary mismatch.

**Inputs:** attestation report, config-source metadata, process/version information.

**Preconditions:** preserve evidence before changing state.

**Required context:** whether the mismatch affects enforcement, audit, or convenience hooks.

**Tools:** host restart, approved config management, plugin uninstall/disable mechanisms, incident channel.

**Procedure:**
1. Freeze protected agent actions.
2. Record only redacted mismatch evidence.
3. Determine whether drift is source-resolution, stale process state, plugin lifecycle, or unknown.
4. Perform at most one approved non-destructive remediation such as clean restart/reload.
5. Re-run attestation from scratch.
6. If mismatch remains, escalate rather than bypassing the hook.
7. If an unexpected third-party hook executed, assess repository/file changes and credentials potentially exposed to it.

**Decisions:** security/audit hook failures always require explicit resolution or human override documented outside the agent.

**Constraints:** never fix a missing gate by switching to a weaker permission mode.

**Expected output:** restored verified state or blocked incident record.

**Metrics:** mean time to detect, mean time to restore, recurrence count.

**Verification:** fresh attestation after remediation.

**Failure handling:** no more than one automated remediation cycle.

**Stop conditions:** verified state restored or human escalation initiated.
