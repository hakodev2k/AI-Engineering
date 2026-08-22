#!/usr/bin/env python3
import importlib.util, pathlib, time, unittest

MODULE = pathlib.Path(__file__).parents[1] / "scripts" / "mcp_oauth_guard.py"
spec = importlib.util.spec_from_file_location("guard", MODULE)
guard = importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)

class GuardTests(unittest.TestCase):
    def test_partial_refresh_preserves_refresh_token(self):
        old={"access_token":"a","refresh_token":"r1","scope":"read","version":2}
        new={"access_token":"b","expires_in":900}
        merged=guard.merge_tokens(old,new)
        self.assertEqual(merged["refresh_token"],"r1")
        self.assertEqual(merged["scope"],"read")
        self.assertEqual(merged["version"],3)

    def test_rotation_replaces_refresh_token(self):
        merged=guard.merge_tokens({"refresh_token":"r1","version":1},{"refresh_token":"r2"})
        self.assertEqual(merged["refresh_token"],"r2")

    def test_stale_session_requires_rehydrate(self):
        code,result=guard.check_state({"version":4},3,60)
        self.assertEqual(code,2); self.assertEqual(result["status"],"rehydrate_required")

    def test_expiring_without_refresh_requires_reauth(self):
        code,result=guard.check_state({"version":1,"expires_at":time.time()+5},1,60)
        self.assertEqual(code,3); self.assertEqual(result["status"],"reauthorization_required")

    def test_ready_state(self):
        code,result=guard.check_state({"version":1,"expires_at":time.time()+3600,"refresh_token":"r"},1,60)
        self.assertEqual(code,0); self.assertEqual(result["status"],"ready")

if __name__ == "__main__": unittest.main()
