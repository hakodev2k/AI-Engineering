import importlib.util, json, os, tempfile, unittest

ROOT=os.path.dirname(os.path.dirname(__file__))
SPEC=importlib.util.spec_from_file_location("gate", os.path.join(ROOT,"scripts","idempotency_gate.py"))
gate=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(gate)

class GateTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); gate.DB=os.path.join(self.tmp.name,"ledger.db")
        self.intent={"idempotency_key":"x:create:42","operation":"create","target":"tickets","arguments":{"external_id":"42","title":"A"},"max_retries":2,"requires_approval":False,"reconciliation":{"method":"read","lookup_field":"external_id"}}
        self.path=os.path.join(self.tmp.name,"intent.json"); self.write()
    def tearDown(self): self.tmp.cleanup()
    def write(self):
        with open(self.path,"w",encoding="utf-8") as f: json.dump(self.intent,f)
    def test_completed_intent_is_not_reclaimed(self):
        self.assertEqual(gate.claim(self.path),0); self.assertEqual(gate.transition("x:create:42","succeeded",result="ticket:42"),0); self.assertEqual(gate.claim(self.path),0)
        r=gate.connect().execute("SELECT status,attempts FROM intents WHERE key=?",("x:create:42",)).fetchone(); self.assertEqual(r,("succeeded",1))
    def test_ambiguous_blocks_retry(self):
        gate.claim(self.path); gate.transition("x:create:42","ambiguous",error="timeout"); self.assertEqual(gate.claim(self.path),4)
    def test_fingerprint_drift_rejected(self):
        gate.claim(self.path); gate.transition("x:create:42","failed_retryable",error="503"); self.intent["arguments"]["title"]="B"; self.write(); self.assertEqual(gate.claim(self.path),3)
    def test_retry_limit(self):
        gate.claim(self.path)
        for _ in range(2):
            gate.transition("x:create:42","failed_retryable",error="503"); self.assertEqual(gate.claim(self.path),0)
        gate.transition("x:create:42","failed_retryable",error="503"); self.assertEqual(gate.claim(self.path),7)
    def test_nonretryable_blocks(self):
        gate.claim(self.path); gate.transition("x:create:42","failed_nonretryable",error="403"); self.assertEqual(gate.claim(self.path),5)
    def test_secret_field_rejected(self):
        self.intent["arguments"]={"token":"abc"}; self.write()
        with self.assertRaises(ValueError): gate.validate(self.intent)

if __name__=="__main__": unittest.main()
