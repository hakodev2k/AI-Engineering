# Knowledge: Assistive Technology & Input

Accessibility behavior emerges from the application, browser/platform accessibility APIs, assistive technology, device/input method and user settings. Therefore record the environment and avoid claiming universal compatibility from one combination.

Key interaction models:
- Keyboard users need reachable controls, predictable order, visible focus and pattern-correct keys.
- Screen-reader users depend on names, roles, states, relationships, structure, reading order, focus context and timely status/error announcements.
- Speech-input users benefit from visible labels that match accessible names and controls that can be targeted predictably.
- Magnification/low-vision users need reflow, zoom resilience, persistent context and non-overlapping content.
- Switch/alternative-input users are harmed by excessive steps, tiny targets, traps and pointer-only gestures.
- Motion-sensitive users need reduced/pauseable nonessential motion.

Custom widgets increase compatibility risk. Prefer platform-native controls. When custom behavior is necessary, define keyboard contract, focus model, accessible state model and expected announcements before implementation.

Testing should focus on task completion and recovery, not merely whether a node appears in an accessibility tree.