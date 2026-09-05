# Skill: Audit Workspace Boundaries

## Purpose
Establish whether the repository contains filesystem links or resolution paths that can escape the trusted workspace.

## Inputs
Trusted root, repository tree, filesystem metadata, policy.

## Preconditions
The root is explicitly chosen by the human/workflow and exists.

## Allowed tools
Read-only filesystem inspection, repository search, `scripts/path_boundary_gate.py`.

## Process
1. Canonicalize the trusted root.
2. Run `--scan-all` without following linked directories.
3. Collect each link/reparse component and resolved target.
4. Classify direct paths, internal links, broken links, and external targets.
5. Map external/broken findings to repository references and intended usage.
6. Separate facts from hypotheses about why the link exists.
7. Stop before replacing/deleting links or widening the root.
8. Hand findings to the edit planner.

## Expected output
Boundary report, affected paths, link targets, risk, evidence, and open questions.

## Verification
Every external or broken finding must be reproducible by the deterministic scanner.

## Failure handling
Transient metadata errors may retry twice. Permission failures block; never elevate silently.

## Stop conditions
Unknown mount semantics, unresolved link target, missing permission, or boundary change requiring approval.