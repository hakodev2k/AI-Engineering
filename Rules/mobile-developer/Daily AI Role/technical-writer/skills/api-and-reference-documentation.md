# Skill: API and Reference Documentation

**Purpose:** produce precise lookup-oriented API, schema, CLI, configuration, or component reference.
**Trigger:** new/changed interface or missing reference.
**Inputs:** authoritative spec/schema/code, supported versions, examples, auth/error model.
**Preconditions:** source-of-truth identified; version known.
**Context/tools:** repository, spec viewers, test client, static checks as available.
**Steps:** inventory symbols → map parameters/types/defaults → document auth/permissions → document behavior and errors → add minimal verified examples → cross-link concepts/how-to → review against source.
**Decisions:** omit undocumented internals; label preview/experimental behavior; separate normative facts from guidance.
**Constraints:** no invented response fields, status codes, defaults, limits, or examples.
**Outputs:** reference pages plus source map and verification evidence.
**Quality:** completeness, exact naming, version correctness, runnable examples.
**Verification:** diff against spec/schema and execute representative examples when possible.
**Failure:** source conflict or behavior cannot be reproduced → block affected claim and escalate.
**Stop:** required surface covered and review passes.