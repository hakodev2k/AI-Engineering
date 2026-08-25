# Actuator and Power Rules
## Purpose
Control energy safely and protect actuators, batteries, power electronics, and mechanisms.
## Scope
Motors, drives, brakes, batteries, power rails, thermal limits, and energy isolation.
## MUST
- Enforce current, voltage, torque, temperature, duty-cycle, and energy limits specified for the system.
- Define startup, shutdown, brownout, overtemperature, and power-loss behavior.
- Verify brake and holding behavior for gravity-loaded or stored-energy mechanisms.
- Provide a safe isolation procedure before maintenance or hazardous access.
## MUST NOT
- Defeat drive protections or thermal limits without engineering justification and approval.
- Assume software shutdown removes hazardous stored energy.
## SHOULD
- Monitor degradation indicators and power margin under worst credible load.
## Exceptions
Temporary limit changes require measured evidence, bounded duration, risk analysis, and authorized approval.
## Verification
Review drive settings, thermal/load tests, power-fault tests, brake tests, schematics, and telemetry.