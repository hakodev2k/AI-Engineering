# Final Verification Hook

**Trigger:** after edits/tests and before reporting completion.

**Preconditions:** investigation evidence, implementation diff if any, latest scanner report, test evidence.

**Action:** rerun the scanner; run `python <package-root>/scripts/verify-report.py .ai/transaction-side-effects.json --allow-findings`; then have the independent verifier classify every remaining candidate and execute repository-specific build/test commands.

**Expected result:** valid report, all confirmed risks either remediated or explicitly accepted with required approval, applicable tests/build passing, no unintended diff.

**Failure behavior:** preserve command output and verifier findings. Return to implementation only while the shared maximum of two fix retries remains; otherwise stop as failed/blocked.

**Blocking:** yes. Scanner/report validity alone never proves correctness; independent evidence is required.
