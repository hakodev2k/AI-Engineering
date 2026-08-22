# Research

## Topic
Auth Token Propagation Consistency Guard

## Category
Security

## Problem
A multi-process AI client can show an authenticated user session while its backend/app-server has no usable credential, producing a split-brain authentication state. This makes authorization behavior unpredictable and can cause repeated 401s, silent credential loss, or unsafe fallback logic.

## Why it matters now
A fresh 2026-08-19 report in openai/codex#39491 shows successful browser login and a correct account/avatar while backend logs report `hasToken=false`, `auth_token_missing`, and requests are sent without a token. An independent earlier report, #30775, shows the same class after an auth bootstrap 401: a still-valid cached access token existed, refresh produced no token, in-memory state dropped to `hasToken=false`, and the app never recovered.

## Affected users
Developers using desktop/CLI/IDE agent clients with OAuth or ChatGPT sign-in, and platform teams operating authentication bridges across UI, local app-server, credential store, and backend HTTP layers.

## Current public evidence
### Observed evidence
- https://github.com/openai/codex/issues/39491 — UI appears signed in after successful login, but app-server reports missing token and backend requests receive 401.
- https://github.com/openai/codex/issues/30775 — cached credential remained valid on disk while runtime auth state became tokenless after refresh/bootstrap failure.
- Official OpenAI help documents that Sign in with ChatGPT stores credentials locally and that distinct authorization/credential artifacts exist: https://help.openai.com/en/articles/11381614-api-codex-cli-and-sign-in-with-chatgpt
- Official Codex guidance expects clients to sign in with ChatGPT: https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/

## Existing approaches
Re-login, restart all processes, clear local state, retry refresh, or surface a login page after 401.

## Remaining limitations
A UI login indicator is not proof that every request path has a usable credential. Blind retry can loop on a missing token. Clearing state is disruptive. Falling back to an arbitrary API key or alternate principal risks crossing identity/authorization boundaries.

## Root-cause analysis
1. Authentication truth is distributed across UI, credential store, app-server memory, refresh state, and request wrapper.
2. Components expose different notions of “logged in”.
3. Refresh failure can overwrite or invalidate in-memory credential state without a coherent transition contract.
4. Privileged requests are not always gated on a verified effective principal/credential state.
5. Recovery paths can prioritize convenience over explicit identity continuity.

## Improvement opportunity
Use a credential-state contract that records only safe metadata (principal/account identifier, credential presence, expiry state, generation/source—not raw secrets), verifies consistency immediately before authenticated tool/backend calls, fails closed on principal mismatch or absent credentials, and uses bounded refresh/re-auth recovery.

## Goal / Metrics / Trigger / Inputs / Outputs
Goal: ensure every authenticated operation has a coherent, current identity boundary. Metrics: split-brain detections, tokenless authenticated requests, 401-after-login rate, recovery latency, principal mismatches, retry count. Trigger: login completion, token refresh, 401, process handoff, pre-authenticated request. Inputs: component auth observations and safe credential metadata. Outputs: PASS/REFRESH/REAUTH/BLOCK plus evidence.