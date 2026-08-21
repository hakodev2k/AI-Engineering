# Research — Agent OAuth Refresh Single-Writer Guard

## Problem
Long-running AI agents and subagents can outlive an OAuth access token. When child workers snapshot credentials at spawn, when multiple processes refresh the same rotating refresh token concurrently, or when refresh persistence is non-atomic, otherwise healthy work can fail with 401s, force re-login, or corrupt the shared credential state.

## Category
Security (with reliability/performance impact).

## Why it matters now
Recent public bug reports show this is not a theoretical OAuth edge case. Agent runtimes increasingly keep background workers, remote-control bridges, daemon processes, and workflow agents alive for hours. Those components cross token-expiry/rotation boundaries and may share one credential store.

## Observed evidence
1. Anthropic Claude Code issue #84273 (opened 2026-08-05) reports background/workflow subagents failing together with 401 during OAuth rollover while the parent continues after refresh. The reporter observed recurrence across earlier dates and described behavior consistent with children retaining a spawn-time credential snapshot.
2. Claude Code issue #85058 (opened 2026-08-08) reports duplicate proactive-refresh scheduling at the same millisecond and recurring credential corruption/re-login. The report also notes multiple long-lived components sharing the same credential file with version skew.
3. Claude Code issue #85262 (opened 2026-08-09) reports refresh persistence that can omit metadata such as expiry/scopes, causing the next launch to reject otherwise live tokens.
4. Claude Code issue #53063 reports non-interactive/subprocess OAuth refresh failing after access-token expiry, relevant to automated/headless agent orchestration.
5. RFC 6749 defines refresh tokens as client-bound credentials that are used only with the authorization server and must be protected in storage/transit. RFC 9700, the OAuth 2.0 Security Best Current Practice, requires sender-constraining or refresh-token rotation for public clients and emphasizes replay prevention.
6. A recent 2026 paper, NEBULA, highlights a remaining implementation gap: RFC 9700 specifies rotation policy but not a concurrency/ordering contract, and presents compare-and-set semantics to prevent a concurrent-refresh reuse-detection bypass. This is research evidence, not an official standard.

## Existing approaches
- Refresh an access token only when the API returns 401/expiry.
- Schedule proactive refresh before `expiresAt`.
- Persist tokens in a shared credentials file.
- Let each worker independently refresh using the same refresh token.
- Keep a token snapshot in each spawned child.
- Use refresh-token rotation or sender-constrained tokens at the authorization server.

## Observed limitations
- A parent can refresh successfully while already-running children continue using stale credentials.
- Multiple refreshers can race on a rotating token, creating replay/reuse failures or last-writer-wins corruption.
- File replacement without schema validation can persist incomplete credential metadata.
- Retrying 401 blindly can amplify refresh races.
- OAuth standards define protocol-level security properties but do not prescribe a client-side multi-process lease, generation counter, or child-rebind protocol for long-running agent fleets.
- Manual re-login recovers a user session but does not make unattended/headless execution reliable.

## Root-cause hypotheses
These are engineering hypotheses derived from the evidence and must be verified in each integration:
1. **Credential snapshot lifetime exceeds access-token lifetime**: child agents bind a token value rather than a reloadable credential reference.
2. **No single-writer authority**: multiple processes/timers may attempt refresh concurrently.
3. **No generation/CAS contract**: a refresher cannot prove it is rotating the credential generation it originally read.
4. **Non-atomic or schema-incomplete persistence**: readers can observe malformed or partially updated credential state.
5. **401 handling conflates causes**: expiry, revoked refresh token, malformed state, scope loss, and upstream auth incidents are treated as the same retryable condition.

## Improvement target
Introduce a reusable client-side control plane around OAuth refresh:

`observe credential generation -> acquire single-writer lease -> re-read current generation -> refresh once -> validate response -> atomically persist complete generation -> notify/rebind children -> verify authenticated probe -> release lease`

Readers never need raw refresh-token values from the guard. The package operates on metadata and delegates the real token endpoint call to an integration callback so it does not normalize insecure secret handling.

## Success metrics
- Concurrent refresh attempts per credential generation: **<= 1**.
- Duplicate refresh executions under N concurrent callers: **0** after one winner obtains the lease.
- Child requests using a superseded generation after grace period: **0**.
- Partial/malformed persisted generations accepted: **0**.
- Blind retries on deterministic auth failure: **0**.
- Recovery loop retries: bounded to configured maximum (default 2).
- Secret values emitted to logs: **0**.

## Sources
- Claude Code issue #84273, `Background/Workflow subagents all 401 at OAuth token rollover...`, opened 2026-08-05: https://github.com/anthropics/claude-code/issues/84273
- Claude Code issue #85058, `Duplicate proactive auth-refresh scheduling corrupts OAuth token...`, opened 2026-08-08: https://github.com/anthropics/claude-code/issues/85058
- Claude Code issue #85262, `OAuth refresh persists credentials without expiresAt/scopes...`, opened 2026-08-09: https://github.com/anthropics/claude-code/issues/85262
- Claude Code issue #53063, `OAuth auto-refresh fails in non-interactive (subprocess) mode`, opened 2026-04-25: https://github.com/anthropics/claude-code/issues/53063
- RFC 6749 — OAuth 2.0 Authorization Framework: https://www.rfc-editor.org/rfc/rfc6749.html
- RFC 9700 — Best Current Practice for OAuth 2.0 Security: https://www.rfc-editor.org/rfc/rfc9700.html
- NEBULA: A Language-Independent Specification for Opaque Rotating Refresh Tokens, 2026-08-04: https://arxiv.org/abs/2608.04115

## Evidence classification
- **Observed:** public issue behavior, dates, documented OAuth requirements.
- **Interpretation:** stale child snapshots, concurrent refresh writers, and incomplete persistence form one recurring client-side lifecycle failure class.
- **Proposed engineering solution:** the single-writer lease, generation/CAS checks, atomic persistence, child rebind protocol, verification hooks, and scripts in this package.
