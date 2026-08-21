# Approval Lifecycle Hooks

## Pre-request validation
**Trigger:** before presenting an approval request.
**Preconditions:** request JSON and policy exist.
**Action:** `python scripts/validate-approval-request.py --request <request.json> --policy config/approval-policy.json`
**Expected result:** exit 0 and `valid` result.
**Failure:** block request presentation; fix request first.
**Blocking:** yes.

## Pre-execution gate
**Trigger:** immediately before protected execution.
**Preconditions:** request, approval, intent, review, policy, ledger exist.
**Action:** `python scripts/evaluate-approval-gate.py --request <request.json> --approval <approval.json> --intent <intent.json> --review <review.json> --ledger <ledger.jsonl> --policy config/approval-policy.json --phase pre-execution`
**Expected result:** decision `allow`, exit 0.
**Failure:** do not execute.
**Blocking:** yes.

## Post-execution consumption
**Trigger:** immediately after the attempted protected action.
**Preconditions:** result details and exact fingerprint available.
**Action:** `python scripts/append-consumption.py --ledger <ledger.jsonl> --request <request.json> --executor <id> --result <succeeded|failed|cancelled> --evidence <reference>`
**Expected result:** append-only record written atomically.
**Failure:** mark execution evidence incomplete and block further reuse until ledger is reconciled manually.
**Blocking:** yes for subsequent actions.

## Replay check
**Trigger:** after consumption or before another use of the same approval.
**Action:** run the pre-execution gate again.
**Expected result:** single-use approval returns `block`; bounded reusable approval decrements remaining uses according to ledger.
**Failure:** block further execution.
**Blocking:** yes.