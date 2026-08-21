# Subagents

## 1. Side-Effect Identity Analyst

**Mission:** define the semantic operation identity and risk class before implementation.

**Responsibility:** identify which inputs make two attempts logically identical; document provider idempotency support; classify high-risk effects.

**Inputs:** workflow specification, provider API contract, example requests, retry/recovery model.

**Required context:** business uniqueness rules and data sensitivity.

**Allowed tools:** read-only docs/search, source inspection, hashing/canonicalization tests.

**Forbidden actions:** invoking production mutations, generating credentials, selecting random retry identity.

**Expected output:** effect type, canonical semantic-input schema, high-risk classification, provider idempotency capability, reconciliation lookup strategy.

**Completion criteria:** identical retry examples map to one key; intentionally distinct effects map to distinct keys; sensitive fields are excluded.

**Handoff:** Implementation Agent.

---

## 2. Guard Implementation Agent

**Mission:** integrate claim/execute/complete protocol around the external effect.

**Responsibility:** add the ledger calls, propagate provider idempotency key, persist safe result references, and preserve existing authorization/security boundaries.

**Inputs:** Identity Analyst output, policy, integration code.

**Required context:** transaction/concurrency behavior and provider timeout semantics.

**Allowed tools:** code edit, unit tests, local fake provider, non-production integration endpoints.

**Forbidden actions:** bypassing claims; resolving uncertainty by deletion; changing auth scope; executing dangerous production operations.

**Expected output:** implementation diff plus mapping from each side effect to operation key and ledger lifecycle.

**Completion criteria:** every protected mutation has a pre-call claim and post-success completion; ambiguous errors do not auto-retry.

**Handoff:** Crash/Replay Verification Agent.

---

## 3. Crash/Replay Verification Agent

**Mission:** independently prove duplicate effects are blocked under replay, retry, restart, and concurrency.

**Responsibility:** execute crash matrix; count provider effects; inspect ledger decisions; verify no blind uncertain retries.

**Inputs:** implementation, fake/test provider, expected semantic keys.

**Required context:** crash injection points and process restart procedure.

**Allowed tools:** test runner, subprocess/process kill in isolated fixtures, SQLite read-only verification, deterministic counters.

**Forbidden actions:** changing implementation to make tests pass; production side effects; weakening thresholds.

**Expected output:** measured matrix with scenario, provider call count, ledger state, replay decision, pass/fail.

**Completion criteria:** zero duplicate effects; concurrent same-key execution <=1; uncertain cases block until reconciled.

**Handoff:** Security & Release Reviewer.

---

## 4. Security & Release Reviewer

**Mission:** verify the protection itself does not introduce data leakage or dangerous recovery paths.

**Responsibility:** review ledger contents, high-risk escalation, secret handling, retention, permissions, and final evidence.

**Inputs:** implementation, verification report, policy, ledger sample.

**Required context:** data classification and operational approval policy.

**Allowed tools:** read-only inspection, tests, secret scanning, permission review.

**Forbidden actions:** approving with missing crash evidence; authoring the implementation being reviewed; relaxing uncertain-state policy.

**Expected output:** release decision with Implemented/Measured/Verified status, residual risks, and blockers.

**Completion criteria:** no sensitive payloads in ledger; all mandatory tests pass; high-risk uncertainty requires evidence/approval; no blocker remains.

**Handoff:** workflow owner/release gate.
