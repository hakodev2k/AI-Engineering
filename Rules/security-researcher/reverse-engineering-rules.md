# Reverse Engineering Rules

## Purpose
Ensure reverse engineering produces defensible technical understanding while respecting authorization, confidentiality, licensing, and operational safety.

## Scope
Applies to binaries, firmware, bytecode, mobile applications, protocols, file formats, proprietary components, and compiled dependencies examined for security purposes.

## MUST
- Reverse engineering MUST be authorized for the artifact, objective, and jurisdiction involved.
- Analysis MUST record artifact identity, version, cryptographic hash, acquisition source, and relevant execution environment.
- Static-analysis conclusions MUST be distinguished from runtime-observed behavior.
- Security-significant control flow, trust boundaries, parsers, privilege transitions, and cryptographic operations MUST be validated with evidence before strong claims are made.
- Modified binaries or patched samples MUST be clearly separated from originals.
- Dynamic execution of untrusted artifacts MUST follow appropriate sandbox controls.
- Findings derived from decompiler output MUST account for lost symbols, compiler transformations, undefined behavior, and reconstruction errors.
- Proprietary code excerpts in reports MUST be limited to what is necessary to explain the security finding.

## MUST NOT
- MUST NOT represent decompiler pseudocode as exact original source.
- MUST NOT defeat access controls or licensing restrictions outside explicit research authority.
- MUST NOT publish proprietary implementation detail unrelated to the vulnerability.
- MUST NOT execute unknown binaries on trusted hosts merely for convenience.
- MUST NOT infer cryptographic weakness solely from function names or pattern matches without validating actual use.

## SHOULD
- Correlate static analysis with debugger, tracing, instrumentation, or controlled runtime observations when practical.
- Maintain notes that map addresses, symbols, structures, and hypotheses to evidence.
- Prefer minimal binary modification when testing a hypothesis.

## Exceptions
Restrictions may be relaxed only when required by authorized interoperability, incident response, or vulnerability research and when legal constraints, risk, and approval are documented.

## Verification
Review artifact hashes, tool output, analysis notes, dynamic evidence, modified-sample labeling, and report excerpts. Confirm material conclusions can be traced to observed binary behavior rather than unsupported pseudocode interpretation.