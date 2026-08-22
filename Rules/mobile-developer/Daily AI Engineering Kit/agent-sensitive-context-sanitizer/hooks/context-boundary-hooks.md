# Context Boundary Hooks

These hooks are tool-neutral lifecycle contracts. Map them to the hook/event system of your agent platform when available.

## PreContextCollect

**Trigger:** before an agent gathers repository/log/data context for downstream transmission.

**Action:** require destination, purpose, and trust classification to be recorded.

**Command/script:** none; this is a workflow metadata gate.

**Failure behavior:** if destination or purpose is missing, stop context collection beyond read-only discovery.

## PostContextCollect

**Trigger:** after the candidate artifact is assembled.

**Action:** calculate candidate hash and run deterministic scanning.

**Command:**

```bash
python scripts/scan-sensitive-context.py --input "$CANDIDATE" --destination "$DESTINATION" --output "$REPORT"
```

**Failure behavior:** retry once for operational errors; second failure blocks release.

## PreExternalSend

**Trigger:** immediately before a model/tool/subagent/external-service request containing repository-derived or user-derived context.

**Action:** verify the report and released artifact.

**Command:**

```bash
python scripts/verify-sanitization-report.py --report "$REPORT" --released "$RELEASED"
```

**Failure behavior:** block the send on any non-zero exit code.

## PostSensitiveFinding

**Trigger:** scanner reports one or more findings.

**Action:** route deterministic `redact` findings to the redactor; route ambiguous/high-risk/override cases to the Privacy & Security Reviewer.

**Command:**

```bash
python scripts/redact-context.py --input "$CANDIDATE" --report "$REPORT" --output "$RELEASED"
```

**Failure behavior:** one regeneration attempt; then stop.

## PreApprovalOverride

**Trigger:** an agent proposes sending an item classified as `approval-required` or changing policy/detector behavior.

**Action:** compare approval scope with exact destination, purpose, candidate hash, and override reason.

**Command/script:** deterministic approval adapters may implement this comparison; the core kit intentionally does not invent a vendor-specific approval API.

**Failure behavior:** missing or mismatched approval blocks release.

## PostDestinationChange

**Trigger:** destination, model provider, MCP server, external API, subagent trust level, or purpose changes after a report exists.

**Action:** invalidate the previous release decision and rerun scanning/policy evaluation.

**Failure behavior:** no transmission until the new release is verified.

## PostSourceChange

**Trigger:** candidate context changes after scanning.

**Action:** recompute hash, invalidate prior report, rerun scanner and verification.

**Failure behavior:** stale reports are not accepted.

## PreComplete

**Trigger:** workflow is about to report success.

**Action:** confirm:

- candidate hash exists;
- report is valid;
- findings have dispositions;
- released artifact was verified;
- required approval exists;
- destination adapter used the released artifact;
- send result is recorded separately from sanitization result.

**Command:** rerun `verify-sanitization-report.py` when the released artifact is still available.

**Failure behavior:** report `completed-but-not-verified` or `blocked`; never claim verified success.