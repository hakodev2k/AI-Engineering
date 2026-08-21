#!/usr/bin/env python3
import json
policy=json.load(open('config/incident-policy.json'))
assert policy['max_retries']==3
assert 'production_change' in policy['require_approval']
print('ok')
