# Test Quality Hooks

## Pre-task: repository test discovery
- **Trigger:** Before generating or modifying tests.
- **Preconditions:** Repository checkout and base ref are available.
- **Action:** Locate test projects/configuration, existing test conventions, and changed implementation files.
- **Command/script:** Repository-specific read/search only; no destructive command.
- **Expected result:** Test command and relevant test locations are known.
- **Failure behavior:** Mark blocked if no runnable test target can be identified and document what was inspected.
- **Blocking:** Yes when verification would otherwise be impossible.

## Post-edit: generated-test static guard
- **Trigger:** After test files are edited.
- **Preconditions:** Python 3 and Git are available.
- **Action:** Scan changed test files for missing assertions and skip/focus markers.
- **Command/script:** `python scripts/check-generated-tests.py --base <base-ref>`
- **Expected result:** Exit code 0.
- **Failure behavior:** Return findings to Test Author. Repair attempts are bounded by workflow retry limits.
- **Blocking:** Yes.

## Post-edit: narrow test execution
- **Trigger:** After static guard passes.
- **Preconditions:** Repository test dependencies are available.
- **Action:** Run the smallest relevant test target using repository conventions; default for .NET is from `config/test-quality.yaml`.
- **Command/script:** Repository-specific; example `dotnet test <test-project> --no-restore`.
- **Expected result:** Exit code 0 with no skipped/focused test introduced by this task.
- **Failure behavior:** Preserve command output and classify as test defect, implementation defect, transient tool failure, or environment failure.
- **Blocking:** Yes.

## Final verification: independent evidence review
- **Trigger:** Before status may become `verified`.
- **Preconditions:** Evidence JSON and final diff exist.
- **Action:** Test Verifier reruns static guard plus narrow tests and inspects behavior/assertion mapping.
- **Command/script:** `python scripts/check-generated-tests.py --base <base-ref>` plus the narrow repository test command.
- **Expected result:** Guard and tests exit 0; evidence is consistent with diff and commands.
- **Failure behavior:** One transient verification retry; quality failures return to author only within remaining author retry budget; otherwise blocked.
- **Blocking:** Yes.
