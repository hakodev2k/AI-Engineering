# Final Verification Hook

**Trigger:** after risk analysis and before reporting the migration preflight as verified.

**Preconditions:** SQL and preflight result exist; approval record exists when required.

**Action:** rerun the preflight command, run `python -m unittest discover -s tests -v`, inspect Git/command evidence for unintended changes or database execution, and compare the rerun decision with the recorded result.

**Expected result:** tests pass, results match, no blocking finding exists, approval requirements are satisfied, and no migration was executed.

**Failure behavior:** one test remediation/rerun is allowed; otherwise stop and preserve outputs. Permission or approval failure stops immediately.

**Blocking:** yes.
