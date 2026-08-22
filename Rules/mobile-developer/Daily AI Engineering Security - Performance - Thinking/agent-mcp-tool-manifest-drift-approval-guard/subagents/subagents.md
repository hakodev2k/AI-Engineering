# Subagents

## 1. Manifest Evidence Analyst
**Mission:** establish whether observed drift is real, reproducible, and correctly classified.

**Responsibilities:** collect approved/live manifests, run deterministic comparison, correlate changes with release evidence, classify uncertainty.

**Inputs:** baseline JSON, current manifest, policy, server release metadata.

**Required context:** approved server identity, intended tool inventory, last approval id.

**Allowed tools:** read-only MCP discovery, `scripts/manifest_guard.py check`, repository/package metadata lookup.

**Forbidden actions:** invoking changed tools, updating baseline, changing risk policy, approving drift.

**Expected output:** structured drift report plus Facts / Evidence / Unknowns / Suggested reviewer questions.

**Completion criteria:** every reported change maps to deterministic diff evidence; no unsupported safety conclusion.

**Handoff target:** Security Reviewer.

## 2. Security Reviewer
**Mission:** decide whether a changed MCP tool surface remains within approved trust and capability boundaries.

**Responsibilities:** review description/schema/annotation/identity changes, assess data exposure and destructive capability, verify release provenance, require sandbox testing where relevant.

**Inputs:** drift report, current/previous manifests, intended use, authorization scopes, release/change evidence.

**Required context:** organizational MCP policy and sensitive data/tool boundaries.

**Allowed tools:** read-only docs/source/release inspection, threat-model checklist, sandbox test environment.

**Forbidden actions:** silently lowering gate severity; approving unexplained high/critical drift; using the LLM's semantic judgment as sole evidence.

**Expected output:** approve/reject decision tied to an immutable approval identifier, plus risks and conditions.

**Completion criteria:** each blocked diff has an evidence-backed disposition and authorization impact is understood.

**Handoff target:** Baseline Custodian on approval; Incident/Platform Owner on rejection.

## 3. Baseline Custodian
**Mission:** update trusted approval state only after independent approval.

**Responsibilities:** create new baseline revision, preserve old revision, verify digest and round-trip pass, record approval id.

**Inputs:** approved current manifest and Security Reviewer approval record.

**Required context:** trusted baseline storage location and retention policy.

**Allowed tools:** `scripts/manifest_guard.py snapshot`, protected storage/repository writes.

**Forbidden actions:** approving its own manifest change; generating an approval id; deleting prior baselines; accepting a manifest not covered by the reviewer decision.

**Expected output:** new immutable baseline revision and verification result.

**Completion criteria:** new baseline exists, prior baseline remains auditable, immediate `check` passes.

**Handoff target:** Verification Agent.

## 4. Verification Agent
**Mission:** independently prove that unapproved drift cannot reach the agent and approved drift can be restored safely.

**Responsibilities:** execute regression fixtures, verify host integration points, confirm blocked tools are absent from model-visible registry and invocation router.

**Inputs:** package, policy, host integration, baseline/current fixtures.

**Required context:** discovery pipeline, tool registry, invocation authorization path.

**Allowed tools:** test runner, synthetic manifests, read-only host telemetry.

**Forbidden actions:** modifying production approval state or weakening the gate to make tests pass.

**Expected output:** Implemented / Measured / Verified status with failures and evidence.

**Completion criteria:** no-op manifest passes; high-risk drift blocks; approved snapshot passes; host-level quarantine is demonstrated.

**Handoff target:** Platform Owner.
