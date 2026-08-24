# Compiler Security Rules

## Purpose
Treat source, IR, object inputs, plugins, and build metadata as potentially hostile.

## Scope
Compiler process security, input handling, code generation safety, plugins, and build integrations.

## MUST
- Untrusted inputs MUST be parsed with bounded memory, recursion, and work where practical.
- Security-sensitive generated constructs MUST preserve language and platform mitigations.
- External tools and plugins MUST be invoked with explicit arguments and least required privilege.
- Security fixes MUST include a regression test that exercises the vulnerable boundary.

## MUST NOT
- MUST NOT execute source-controlled commands merely by parsing source.
- MUST NOT embed credentials, tokens, or sensitive environment values in outputs or logs.
- MUST NOT disable hardening silently to recover from a compilation problem.

## SHOULD
- Parsers and binary readers SHOULD be fuzzed continuously.
- High-risk components SHOULD use memory-safe implementation techniques where feasible.

## Exceptions
Weakening a security control requires explicit risk acceptance and human approval.

## Verification
Use fuzzers, sanitizers, dependency scanners, hostile corpora, configuration review, and security regression tests.