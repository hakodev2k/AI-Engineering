# Workflow: Generated Test Quality Gate

## Trigger
A feature, bug fix, refactor, dependency change, or AI-authored code change requires new or modified automated tests.

## Entry conditions
- A repository and base ref are available.
- The changed behavior or acceptance criteria can be identified.
- Relevant test tooling is discoverable.

## Inputs
- Base ref or diff.
- Changed implementation.
- Acceptance criteria/bug evidence.
- Existing tests and fixtures.
- `config/test-quality.yaml`.

## Flow

```text
Trigger
  ↓
Discover changed behavior
  ↓
Plan test cases
  ↓
Test Author implements
  ↓
Static guard + narrow tests
  ↓
Independent Test Verifier
  ↓
Broader relevant tests + diff review
  ↓
Verified / Blocked / Needs approval
```

## Stages

### 1. Context discovery
**Owner:** Test Author  
Read changed files, public contracts, adjacent tests, fixtures, and repository test commands. Produce a behavior list and identify negative/boundary cases.

**Checkpoint:** Every changed behavior has either a planned test or an explicit evidence-based reason no new test is needed.

### 2. Test planning
**Owner:** Test Author  
For each planned test define behavior, precondition, action, expected observable result, and failure proposition.

**Stop:** If the only viable test requires changing a public contract, security control, production configuration, schema, or destructive data operation, set `needs-approval` before that action.

### 3. Implementation
**Owner:** Test Author  
Follow `skills/generate-high-signal-tests.md` and `rules/test-quality-rules.md`.

### 4. Author verification
**Owner:** Test Author  
Run the narrow test target and `scripts/check-generated-tests.py`.

**Retryable failures:** test syntax/fixture mistakes introduced by the author; transient test runner failure.  
**Maximum retries:** 2 test-fix attempts; one transient command retry per distinct command.  
**Evidence preserved:** command, exit code, concise failure summary, changed files.  
**Escalation:** implementation failures go to the implementation owner; environment/permission failures become `blocked`.

### 5. Independent verification
**Owner:** Test Verifier  
Execute `skills/review-test-evidence.md`, rerun the guard and narrow tests, validate regression evidence and assertion quality.

**Maximum retries:** 1 verification retry for transient command failure. Material quality findings are not blindly retried; they return to Test Author if the author still has retry budget.

### 6. Final validation
**Owner:** Test Verifier  
Run broader relevant tests when practical, inspect final diff, confirm no skips/focus markers, unrelated snapshots, weakened tests, or unapproved dangerous changes.

## Produced artifacts
- Test code and test helpers.
- Evidence JSON conforming to `schemas/test-evidence.schema.json`.
- Test/static-guard command output summary.
- Verification verdict and remaining risks.

## Approval points
Explicit human approval is required before production deployment/config changes, destructive data/schema changes, breaking API contracts, security-control weakening, irreversible migrations, or large dependency upgrades.

## Failure paths
- **Validation failure:** return concrete file/assertion evidence to Test Author; bounded repair only.
- **Implementation defect:** stop test-only changes and hand evidence to implementation owner.
- **Tool/environment failure:** retry once if transient, otherwise `blocked`.
- **Permission failure:** do not escalate privileges; `blocked`.
- **Approval boundary:** `needs-approval` and stop.

## Definition of Done
- Changed behavior is explicitly mapped to tests or justified non-test evidence.
- New/modified tests have meaningful behavioral assertions.
- Relevant negative/boundary coverage exists where applicable.
- Tests are deterministic and no tests are skipped/focused.
- Static guard exits 0.
- Narrow relevant tests pass; broader relevant tests pass when available/practical.
- Regression test has evidence it detects the prior bug when applicable.
- Independent verifier returns `verified`.
- No unapproved dangerous action occurred.
- Remaining risks are documented.
