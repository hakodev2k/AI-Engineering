# Workflow: Breaking Contract Migration

**Trigger:** platform contract must change incompatibly.

**Goal:** move consumers without surprise breakage.

**Stages:** establish necessity -> inventory consumers -> map dependency/version constraints -> define new contract and compatibility window -> create migration tooling/docs -> pilot -> track migration -> handle bounded exceptions through human authority -> notify deadlines -> verify replacement adoption -> retire old contract after exit criteria.

Parallelize consumer discovery and technical validation where independent. Serialize changes to shared contract versions and retirement decisions.

**Stop conditions:** replacement not viable, critical consumer lacks path, required approval missing, or retirement evidence incomplete.
