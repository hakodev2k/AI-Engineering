# Workflow: Selector Drift Recovery

## Trigger
A Playwright test fails because a locator no longer resolves the intended element or resolves ambiguously after a UI/DOM change.

## Entry conditions
- Failing test, test file, and error output are available.
- Repository can run or inspect the relevant Playwright test.
- No production mutation is required to investigate.

## Inputs
- test file and test name
- failing command/output
- trace/screenshot/DOM evidence when available
- `config/selector-policy.yaml`
- repository test conventions

## Context
Load the failing spec/page object first, then the directly related component and nearby tests. Expand only when evidence requires it.

## Stages

### 1. Diagnose
**Owner:** Selector Investigator  
**Tools:** Playwright runner/trace, repository search, `scripts/scan-selectors.py`  
**Artifacts:** failure classification, original locator, evidence, ranked candidates.

Checkpoint: continue only if the failure is selector drift or equivalent evidence strongly supports it.

### 2. Candidate selection
**Owner:** Selector Investigator  
Choose the highest-priority locator that uniquely identifies the intended element. Record why lower-level CSS/test-id alternatives are needed when semantic locators are not suitable.

Checkpoint: ambiguous candidates block implementation.

### 3. Minimal repair
**Owner:** Selector Repair Agent  
Edit only the relevant locator or centralized page-object abstraction. Preserve assertion semantics.

Approval checkpoint: stop before deleting/skipping tests, weakening assertions solely to pass, production data writes, destructive cleanup, or security weakening.

### 4. Targeted retest
**Owner:** Selector Repair Agent  
Run the smallest failing test.

Retry rule:
- Maximum repair attempts: 2 total.
- Retryable: same selector-not-found/strict-mode ambiguity with new evidence.
- Preserve: command, failure output, trace/screenshot, candidate locator, diff.
- Escalate: after second failed attempt set status `blocked`.
- Do not retry unrelated application, auth, network, or data failures as selector repairs.

### 5. Full-spec retest
**Owner:** Selector Repair Agent  
If targeted retest passes, run the full containing spec/file. Any new non-selector failure stops the selector workflow and is reported separately.

### 6. Independent verification
**Owner:** Selector Verification Agent  
Validate report, inspect diff, confirm both test scopes passed, and reject forbidden shortcuts.

### 7. Complete
Set status `verified` only when the verifier accepts the evidence.

## Produced artifacts
- minimal code diff
- optional `selector-scan.json`
- repair report conforming to `schemas/repair-report.schema.json`
- targeted and full-spec test output

## Failure paths
- Not selector drift → stop and hand off to product/test-data/environment debugging.
- Ambiguous target → `blocked` with evidence.
- Two failed repairs → `blocked`; preserve both attempts.
- Permission/tool failure → retry transient tool failure once, otherwise stop without elevating permissions.
- Approval-required action → `needs-approval` and stop before action.

## Definition of Done
- Original failure classified with evidence.
- Replacement locator is stable and uniquely identifies intended element.
- No forbidden locator shortcut was introduced without documented justification.
- Targeted test passes.
- Full containing spec passes.
- Repair report validator passes.
- Independent verifier accepts the diff.
- No blocking risk remains.
