# Mobile Debugging Rules
## Purpose
Find root causes using reproducible evidence across device, OS, lifecycle, network, and release conditions.
## Scope
Crash investigation, hangs, UI defects, platform differences, network/storage issues, and production reproduction.
## MUST
- Investigation MUST record app version/build, OS/device, reproduction conditions, relevant state, and evidence before broad fixes.
- Production-only issues MUST use release-equivalent configuration and symbols where possible.
- Hypotheses MUST be tested against logs, traces, debugger/profiler output, controlled experiments, or equivalent evidence.
## MUST NOT
- A symptom-suppressing retry or delay MUST NOT be accepted as root-cause remediation without bounded evidence.
- Sensitive production data MUST NOT be copied into debugging artifacts without approved handling.
## SHOULD
- Reduce issues to the smallest reproducible lifecycle/network/device scenario before changing architecture.
## Exceptions
Urgent containment may precede root-cause completion when impact is high, with follow-up investigation required.
## Verification
Review reproduction notes, diagnostic artifacts, hypothesis tests, regression coverage, and post-fix production signals.