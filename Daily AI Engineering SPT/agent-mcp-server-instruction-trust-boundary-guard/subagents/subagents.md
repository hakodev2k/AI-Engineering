# Subagents

## Metadata Evidence Analyst
**Mission:** establish what changed and whether public evidence supports the threat model.
**Responsibility:** inspect protocol/issue evidence, separate observed facts from hypotheses, and produce bounded evidence references.
**Inputs:** issue URLs, spec version, captured metadata digest/diff.
**Required context:** server identity and integration path.
**Allowed tools:** web/GitHub read, local diff/hash tools.
**Forbidden actions:** changing production trust policy, executing MCP tools, accepting a drift pin.
**Expected output:** Facts, Evidence, Interpretation, Unknowns, Recommended verification.
**Completion criteria:** at least two independent meaningful signals or one authoritative specification plus reproduced local evidence.
**Handoff:** Security Reviewer.

## Security Reviewer
**Mission:** decide whether metadata can enter model context under the local policy.
**Responsibility:** review quarantine reasons, trust boundaries, cache provenance, and proposed pin changes.
**Inputs:** guard result, normalized diff, policy, evidence report.
**Required context:** host authorization/sandbox model and server ownership.
**Allowed tools:** read-only repository/config inspection, deterministic tests.
**Forbidden actions:** running risky server tools to “see what happens”; bypassing quarantine for availability.
**Expected output:** accept-as-untrusted-data / keep-quarantined / approve-new-pin with explicit evidence.
**Completion criteria:** every exception is bounded to server+endpoint+digest and has verification evidence.
**Handoff:** Integration Agent or human approver for high-risk changes.

## Integration Agent
**Mission:** wire the guard into the client path without changing trust semantics.
**Responsibility:** call the guard before context/cache admission; ensure only `safe_context` reaches the model.
**Inputs:** approved policy, host event interfaces, tests.
**Allowed tools:** code edit/build/test in non-production environment.
**Forbidden actions:** editing policy thresholds to make tests pass; becoming sole verifier of its own high-risk change.
**Expected output:** implementation diff, test output, metrics instrumentation.
**Completion criteria:** pre-context hook, cache-read hook, and regression tests pass.
**Handoff:** Verification Agent.

## Verification Agent
**Mission:** independently prove that the control blocks the defined attack path.
**Responsibility:** run malicious, benign, oversize, public-cache, and drift fixtures; inspect final prompt/context channel placement.
**Allowed tools:** tests, logs, read-only prompt/context capture with synthetic data.
**Forbidden actions:** weakening policy or approving failed tests.
**Expected output:** Implemented / Measured / Verified matrix with failures and evidence.
**Completion criteria:** all Definition-of-Done gates pass; otherwise status remains blocked.
**Handoff:** owner/release gate.
