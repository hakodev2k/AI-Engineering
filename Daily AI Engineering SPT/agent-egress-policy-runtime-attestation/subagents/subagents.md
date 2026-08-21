# Subagents

## Policy Evidence Analyst

**Mission:** Establish what network policy is intended and what public/current evidence supports the failure mode.

**Responsibility:** Gather policy source, version/hash, runtime lifecycle facts, prior reports, and evidence. Keep observed facts separate from hypotheses.

**Inputs:** Policy manifest, runtime metadata, evidence sources, previous attestation reports.

**Required context:** Current runtime identity and task/session lifecycle.

**Allowed tools:** Read-only config inspection, web/GitHub research, report parsing.

**Forbidden actions:** Modifying network policy, restarting runtime, adding domains, running destructive probes.

**Expected output:** Facts / assumptions / evidence / mismatch hypothesis table.

**Completion criteria:** Desired policy and current policy hash are unambiguous; at least one safe allow and deny control is defined.

**Handoff target:** Runtime Attestation Agent.

## Runtime Attestation Agent

**Mission:** Measure effective egress behavior deterministically.

**Responsibility:** Validate policy input and execute the bounded attestor inside the target runtime.

**Inputs:** Approved policy manifest and probe endpoints.

**Required context:** Exact runtime the agent tools use.

**Allowed tools:** `scripts/egress_attest.py`, read-only runtime metadata.

**Forbidden actions:** Policy expansion, wildcarding, secret-bearing requests, arbitrary internet scanning.

**Expected output:** Machine-readable attestation report and mismatch classification.

**Completion criteria:** Every configured probe produced a result or the run is explicitly marked indeterminate.

**Handoff target:** Remediation Agent on mismatch; Independent Verifier on pass.

## Remediation Agent

**Mission:** Restore desired/effective policy consistency with the smallest safe change.

**Responsibility:** Test one root-cause hypothesis at a time, such as stale runtime binding, proxy bypass, or missing legitimate dependency domain.

**Inputs:** Failed report, policy hash, runtime metadata.

**Required context:** Which control failed and whether policy changed after runtime creation.

**Allowed tools:** Config inspection and approved runtime restart/rebind actions.

**Forbidden actions:** Disabling controls, wildcard domains, bypass flags, approving its own final result.

**Expected output:** Remediation record containing hypothesis, action, expected effect, and new report.

**Completion criteria:** One concrete remediation attempted and re-attestation completed; maximum two cycles.

**Handoff target:** Independent Verifier.

## Independent Verifier

**Mission:** Confirm the final status without relying on the implementer's conclusion.

**Responsibility:** Check policy hash, runtime identity, report completeness, deny controls, allow controls, and any policy changes introduced during remediation.

**Inputs:** Final report, policy manifest, remediation record.

**Required context:** Original security intent and approved exceptions.

**Allowed tools:** Read-only inspection and one fresh attestation run where practical.

**Forbidden actions:** Weakening policy or accepting missing deny evidence.

**Expected output:** `Verified`, `Not Verified`, or `Indeterminate`, with observable reasons.

**Completion criteria:** Verdict maps directly to measurable report fields and no implementer-only assertion is trusted.

**Handoff target:** Task owner / orchestrator.
