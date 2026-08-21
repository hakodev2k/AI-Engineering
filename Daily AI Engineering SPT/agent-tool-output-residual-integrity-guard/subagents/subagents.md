# Subagents

## Residual Auditor

**Mission:** establish whether tool outputs preserve enough residual metadata to support safe reasoning.

**Responsibility:** inspect capture/model/persistence boundaries, build fixtures, compare truth against residual metadata, identify silent-discard paths.

**Inputs:** runner behavior, fixtures, policy, transcripts, artifact store metadata.

**Required context:** output limits, capture architecture, persistence format.

**Allowed tools:** read-only file inspection, hashing, byte counting, `scripts/residual_guard.py`, test runner.

**Forbidden actions:** production writes, changing limits to force a pass, guessing omitted content.

**Expected output:** baseline with observed facts, gaps, severity, and reproducible fixture evidence.

**Completion criteria:** all output stages classified and each gap tied to measurable evidence.

**Handoff target:** Integration Implementer.

---

## Integration Implementer

**Mission:** add the Output Residual Contract to the host/tool boundary with minimal behavioral change.

**Responsibility:** externalize full captured bytes, emit bounded model view, propagate residual metadata, expose targeted artifact reads.

**Inputs:** auditor baseline, policy, tool-runner interfaces.

**Required context:** lifecycle of stdout/stderr/tool result and storage permissions.

**Allowed tools:** code editing, local tests, fixture generation.

**Forbidden actions:** weakening sandbox/security controls, unbounded prompt injection of artifacts, declaring its own implementation verified.

**Expected output:** implementation plus tests and before/after metrics.

**Completion criteria:** policy invariants pass and no blocking capture path remains.

**Handoff target:** Independent Verifier.

---

## Independent Verifier

**Mission:** prove the implementation prevents false completeness and preserves recoverability without trusting implementer claims.

**Responsibility:** run independent fixtures, corrupt/missing-artifact tests, size/hash checks, bounded-view checks, and evidence-sensitive conclusion scenarios.

**Inputs:** implementation, tests, baseline, policy.

**Required context:** Definition of Done and known prior failure paths.

**Allowed tools:** test runner, hashing, fixture generation, read-only inspection.

**Forbidden actions:** silently fixing failures while verifying; changing acceptance thresholds to pass.

**Expected output:** `Implemented / Measured / Verified` status with failures and evidence.

**Completion criteria:** all required tests pass or a blocking failure is explicitly reported.

**Handoff target:** workflow owner/human reviewer.
