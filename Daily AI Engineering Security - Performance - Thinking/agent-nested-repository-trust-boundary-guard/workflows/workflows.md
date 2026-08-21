# Workflows

## Workflow 1 — Pre-Task Nested Boundary Attestation

**Trigger:** task begins in a workspace that may contain nested repos/projects.  
**Goal:** prove the execution topology before model-driven writes.  
**Inputs:** workspace root, `config/policy.json`.  
**Baseline:** number/type of nested roots, active nested hooks, child agent-config roots, unknown roots.  
**Context:** parent security policy and approved exception list.

### Stages
1. **Observe** — Boundary Inventory Agent runs the scanner and saves a sanitized report.
2. **Baseline** — capture metrics and policy version.
3. **Classify** — Security Reviewer marks every nested root trusted/read-only/blocked/approval-required.
4. **Checkpoint** — any unknown root or active nested hook blocks high-risk operations.
5. **Execute** — Implementation Agent works only inside attested boundaries.
6. **Verify** — Verification Agent scans again and compares topology.

**Tools:** `python3 scripts/nested_trust_guard.py --root <workspace> --policy config/policy.json --output trust-report.json`.  
**Outputs:** pre/post reports, attestation, changed-path inventory.  
**Metrics:** unknown roots=0 for allowed execution; unapproved nested metadata writes=0; post-scan violations=0.  
**Retry policy:** one retry only for a demonstrable transient filesystem race.  
**Stop conditions:** unreadable boundary, new unclassified root, active unapproved hook, weaker/unknown child policy.  
**Failure path:** stop, preserve evidence, request explicit human classification; never widen permissions automatically.  
**Verification:** independent post-scan and diff review.  
**Definition of Done:** topology attested, work completed within scope, post-scan pass, no unapproved persistence surface.

---

## Workflow 2 — Safe Delegation Into Nested Project

**Trigger:** parent agent wants to spawn/re-root a subagent into a child directory.  
**Goal:** prevent delegation from silently losing parent controls.  
**Inputs:** target child path, current trust report, parent contract, child settings metadata.  
**Baseline:** parent sandbox/network/filesystem/approval/tool restrictions.

### Stages
1. Resolve target child path and owning nested root.
2. Require a current inventory entry; otherwise rescan.
3. Compare effective child policy with parent baseline.
4. Classify `same`, `stronger`, `weaker`, or `unknown`.
5. Allow `same`/`stronger`; block `weaker`/`unknown` absent explicit approval.
6. Bind subagent instructions to the attested root and prohibited metadata paths.
7. On return, verify no topology or policy drift occurred.

**Responsible agents:** Boundary Inventory Agent → Security Reviewer → Implementation Agent → Verification Agent.  
**Checkpoint:** delegation occurs only after attestation.  
**Metrics:** delegations with attestation=100%; silent policy weakening=0.  
**Retry:** at most one re-attestation after a settings change.  
**Stop:** ambiguity about merge/inheritance semantics or changed child policy.  
**Failure path:** keep work at parent root or escalate for human approval.  
**Definition of Done:** child root is explicitly attested and post-delegation verification passes.

---

## Workflow 3 — Approved Nested Metadata Change

**Trigger:** legitimate task requires installing/updating a nested Git hook or agent configuration.  
**Goal:** permit necessary changes without normalizing blanket write access.  
**Inputs:** exact paths, proposed diff, reason, approval record.  
**Baseline:** pre-change trust report and current hook/config inventory.

### Stages
1. Detect target as persistence/control metadata.
2. Produce exact path/action plan.
3. Obtain explicit human approval scoped to those paths and operations.
4. Apply only the approved change.
5. Re-run scanner immediately.
6. Verification Agent compares pre/post metadata inventory and source diff.
7. If unexpected additional metadata appears, revert/stop according to repository policy and escalate.

**Metrics:** approved path match=100%; extra control-file modifications=0.  
**Retry:** no automatic retry of metadata writes; one corrected attempt requires renewed diff validation.  
**Stop:** approval mismatch, path expansion, hook creation outside approved set, new nested root.  
**Definition of Done:** exact approved change present, scanner status acceptable, independent verification complete.
