import os
import unittest
from types import SimpleNamespace

os.environ.setdefault("DEEPSEEK_API_KEY", "test-key")

from daily_arxiv import fetch_arxiv


class FetchArxivTests(unittest.TestCase):
    def test_retries_empty_feeds_before_returning_papers(self):
        entry = SimpleNamespace(
            id="http://arxiv.org/abs/2608.12345v1",
            title="  A   lattice paper  ",
            summary="An abstract",
            authors=[SimpleNamespace(name="Alice")],
            published="2026-08-28T00:00:00Z",
        )
        feeds = iter(
            [
                SimpleNamespace(entries=[]),
                SimpleNamespace(entries=[]),
                SimpleNamespace(entries=[entry]),
            ]
        )
        attempts = []

        def parse_feed(url):
            attempts.append(url)
            return next(feeds)

        papers = fetch_arxiv(
            parse_feed=parse_feed,
            sleep=lambda _seconds: None,
            max_attempts=3,
        )

        self.assertEqual(len(attempts), 3)
        self.assertEqual(papers[0]["id"], "2608.12345v1")
        self.assertEqual(papers[0]["title"], "A lattice paper")


if __name__ == "__main__":
    unittest.main()
