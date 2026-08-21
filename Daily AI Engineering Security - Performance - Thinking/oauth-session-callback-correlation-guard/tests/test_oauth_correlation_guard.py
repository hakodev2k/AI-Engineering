import hashlib, importlib.util, pathlib, unittest

MODULE=pathlib.Path(__file__).resolve().parents[1]/"scripts"/"oauth_correlation_guard.py"
spec=importlib.util.spec_from_file_location("ocg",MODULE); ocg=importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(ocg)

def txn(state, session, consumed=False):
    return {"transaction_id":"t-"+session,"state_hash":hashlib.sha256(state.encode()).hexdigest(),"session_id":session,"issuer":"provider-a","redirect_uri":"http://127.0.0.1:1455/cb","expires_at":"2026-08-20T10:00:00Z","consumed":consumed}
def cb(state):
    return {"state":state,"issuer":"provider-a","redirect_uri":"http://127.0.0.1:1455/cb","now":"2026-08-20T09:00:00Z","session_exists":True}

class OAuthCorrelationTests(unittest.TestCase):
    def test_two_flows_bind_to_original_sessions(self):
        reg={"transactions":[txn("state-a","A"),txn("state-b","B")]}
        self.assertEqual(ocg.verify(cb("state-a"),reg)[1]["session_id"],"A")
        self.assertEqual(ocg.verify(cb("state-b"),reg)[1]["session_id"],"B")
    def test_replay_rejected(self):
        code,out=ocg.verify(cb("state-a"),{"transactions":[txn("state-a","A",True)]})
        self.assertEqual(code,2); self.assertEqual(out["reason"],"replay")
    def test_wrong_issuer_rejected(self):
        c=cb("state-a"); c["issuer"]="provider-b"
        code,out=ocg.verify(c,{"transactions":[txn("state-a","A")]})
        self.assertEqual(code,2); self.assertEqual(out["reason"],"issuer_mismatch")
    def test_expired_rejected(self):
        c=cb("state-a"); c["now"]="2026-08-20T11:00:00Z"
        self.assertEqual(ocg.verify(c,{"transactions":[txn("state-a","A")]})[0],2)
    def test_unknown_state_rejected(self):
        self.assertEqual(ocg.verify(cb("x"),{"transactions":[txn("state-a","A")]})[0],2)

if __name__=="__main__": unittest.main()