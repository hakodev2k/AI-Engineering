import json, os, tempfile, unittest
from datetime import datetime, timezone, timedelta
from email.utils import format_datetime
import importlib.util

HERE=os.path.dirname(os.path.dirname(__file__))
SPEC=importlib.util.spec_from_file_location('gate', os.path.join(HERE,'scripts','retry_after_gate.py'))
gate=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(gate)

POLICY={
 'max_retry_attempts':3,'default_delay_seconds':2,'max_delay_seconds':120,
 'honor_retry_after':True,'allow_retry_statuses':[429,503],
 'forbid_retry_methods':['POST','PATCH']
}

class RetryAfterGateTests(unittest.TestCase):
    def test_delta_seconds(self): self.assertEqual(gate.parse_retry_after('30'),30)
    def test_http_date(self):
        now=datetime(2026,1,1,tzinfo=timezone.utc)
        value=format_datetime(now+timedelta(seconds=45), usegmt=True)
        self.assertEqual(gate.parse_retry_after(value, now),45)
    def test_invalid_header_blocks(self):
        r=gate.evaluate('GET',429,'nonsense',POLICY); self.assertEqual(r['decision'],'block')
    def test_retry_delay_is_capped(self):
        r=gate.evaluate('GET',429,'999',POLICY); self.assertEqual(r['delay_seconds'],120)
    def test_non_idempotent_requires_approval(self):
        r=gate.evaluate('POST',429,'5',POLICY); self.assertEqual(r['decision'],'approval-required')
    def test_non_retryable_status(self):
        r=gate.evaluate('GET',400,None,POLICY); self.assertEqual(r['decision'],'do-not-retry')

if __name__=='__main__': unittest.main()
