# Onboarding Rules

## Purpose
Make first-use and project-entry workflows reliable, secure, and reproducible.

## Scope
Covers workstation prerequisites, repository setup, credentials, local execution, validation, and first contribution.

## MUST
- Onboarding MUST define supported platforms, prerequisites, access dependencies, and a verifiable success checkpoint.
- Setup instructions MUST be executable from a clean supported environment.
- Required credentials MUST use approved secret-delivery mechanisms.
- Changes to onboarding MUST be tested against a clean or equivalently isolated environment.

## MUST NOT
- MUST NOT embed secrets, personal tokens, or production credentials in setup instructions.
- MUST NOT depend on undocumented machine state or manual fixes.
- MUST NOT instruct developers to weaken host security controls merely to complete setup.

## SHOULD
- Setup SHOULD be automated where automation is deterministic and maintainable.
- Failure messages SHOULD identify the failed prerequisite and corrective action.

## Exceptions
Platform-specific exceptions require reason, supported scope, risk, fallback path, and owner. Security exceptions require explicit approval.

## Verification
Run clean-environment onboarding, inspect scripts and documentation, validate secret handling, and measure time-to-first-success and recurring setup failures.