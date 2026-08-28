import unittest
from scripts.tool_call_ledger import reconcile
class T(unittest.TestCase):
    def test_complete(self):
        r=reconcile([{"batch_id":"b","call_id":"1","tool":"read","effect":"read_only","event":"declared"},{"batch_id":"b","call_id":"2","tool":"search","effect":"read_only","event":"declared"},{"batch_id":"b","call_id":"1","tool":"read","effect":"read_only","event":"succeeded"},{"batch_id":"b","call_id":"2","tool":"search","effect":"read_only","event":"succeeded"}])
        self.assertEqual(r["b"]["decision"],"complete")
    def test_pending_waits(self):
        self.assertEqual(reconcile([{"batch_id":"b","call_id":"1","tool":"read","effect":"read_only","event":"declared"}])["b"]["decision"],"wait")
    def test_mutating_ambiguous_blocks(self):
        rows=[{"batch_id":"b","call_id":"1","tool":"write","effect":"mutating","event":"declared"},{"batch_id":"b","call_id":"1","tool":"write","effect":"mutating","event":"dispatched"}]
        self.assertEqual(reconcile(rows)["b"]["decision"],"block")
    def test_duplicate_terminal_blocks(self):
        rows=[{"batch_id":"b","call_id":"1","tool":"read","effect":"read_only","event":"declared"},{"batch_id":"b","call_id":"1","tool":"read","effect":"read_only","event":"succeeded"},{"batch_id":"b","call_id":"1","tool":"read","effect":"read_only","event":"failed"}]
        self.assertEqual(reconcile(rows)["b"]["decision"],"block")
    def test_orphan_blocks(self):
        self.assertEqual(reconcile([{"batch_id":"b","call_id":"1","tool":"read","effect":"read_only","event":"succeeded"}])["b"]["decision"],"block")
if __name__=="__main__": unittest.main()
