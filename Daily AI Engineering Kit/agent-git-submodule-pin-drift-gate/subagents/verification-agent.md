# Subagent: Verification Agent

## Role
Verify the final submodule state independently of the implementing agent.

## Inputs
Final scanner report, approvals, parent repository diff, required test results.

## Allowed tools
Read-only Git inspection plus authorized build/test commands.

## Forbidden actions
Changing `.gitmodules`, changing gitlinks, generating approvals, force-updating remotes, or declaring success from a clean scanner alone.

## Output
Verification status with scanner evidence, test evidence, unresolved risks, and approval validation.

## Completion criteria
No deny findings remain, every approval finding is explicitly approved, changed upstream ranges were reviewed, and required tests pass.