import unittest
from scripts.retry_classifier import classify

class RetryClassifierTests(unittest.TestCase):
    def test_incomplete_is_terminal(self):
        d=classify('response.incomplete',1,0)
        self.assertEqual(d.action,'STOP')
        self.assertEqual(d.delay_seconds,0)
    def test_transient_retries_with_budget(self):
        d=classify('connection_reset',1,0,max_attempts=3,max_wait=10)
        self.assertEqual(d.action,'RETRY')
        self.assertEqual(d.next_attempt,2)
    def test_websocket_fallback_when_attempt_budget_exhausted(self):
        d=classify('transport_timeout',3,3,max_attempts=3,max_wait=45,transport='websocket')
        self.assertEqual(d.action,'FALLBACK')
    def test_https_stops_when_attempt_budget_exhausted(self):
        d=classify('transport_timeout',3,3,max_attempts=3,max_wait=45,transport='https')
        self.assertEqual(d.action,'STOP')
    def test_wait_budget_blocks_retry(self):
        d=classify('connection_reset',2,4,max_attempts=4,max_wait=5,transport='websocket')
        self.assertEqual(d.action,'FALLBACK')
    def test_unknown_event_is_not_blindly_retried(self):
        self.assertEqual(classify('mystery',1,0).action,'STOP')

if __name__=='__main__': unittest.main()
