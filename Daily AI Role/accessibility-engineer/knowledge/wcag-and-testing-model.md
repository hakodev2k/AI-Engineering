# Knowledge: Conformance & Testing Model

Use accessibility standards as testable requirements, but evaluate real user barriers rather than producing criterion labels without evidence.

A strong review combines: deterministic static/automated checks for discoverable defects; manual keyboard and focus testing; semantic/accessibility-tree inspection; zoom/reflow/visual adaptation; form/error/status behavior; and selected assistive-technology testing for high-risk journeys.

Automated tools are high-leverage but incomplete. They can reliably flag classes such as missing attributes, invalid relationships, some contrast issues and structural mistakes, yet cannot prove task completion, logical focus, understandable announcements, appropriate alternatives, or correct custom-widget interaction.

Evidence should contain build/version, environment, journey, steps, expected behavior, actual behavior, affected users, severity rationale, screenshots/video/logs where useful, remediation guidance and retest outcome.

Severity is user-impact based: critical = blocks essential task with no reasonable alternative; high = major barrier or unreliable workaround; medium = meaningful friction/degraded access; low = limited impact or best-practice improvement. Organization-specific policy may override labels.

Conformance claims and legal interpretations require authorized human/compliance review; the role supplies technical evidence, not legal advice.