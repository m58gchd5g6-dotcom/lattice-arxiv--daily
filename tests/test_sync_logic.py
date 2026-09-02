import unittest

from pipeline.sync_logic import append_new_papers


class AppendNewPapersTests(unittest.TestCase):
    def test_only_summarizes_and_appends_unseen_papers(self):
        database = [
            {
                "id": "existing",
                "title": "Existing paper",
                "status": "read",
                "notes": ["keep this note"],
            }
        ]
        fetched = [
            {"id": "existing", "title": "Changed upstream title", "abstract": "old"},
            {"id": "new", "title": "New paper", "abstract": "new abstract"},
        ]
        summarized_ids = []

        def summarize(paper):
            summarized_ids.append(paper["id"])
            return "summary for " + paper["id"]

        def normalize(paper, summary):
            return {
                "id": paper["id"],
                "title": paper["title"],
                "summary": {"raw": summary},
                "status": "unread",
                "notes": [],
            }

        result, added = append_new_papers(
            database,
            fetched,
            summarize=summarize,
            normalize=normalize,
        )

        self.assertEqual(added, 1)
        self.assertEqual(summarized_ids, ["new"])
        self.assertEqual(result[0]["title"], "Existing paper")
        self.assertEqual(result[0]["status"], "read")
        self.assertEqual(result[0]["notes"], ["keep this note"])
        self.assertEqual(result[1]["id"], "new")
        self.assertEqual(result[1]["summary"]["raw"], "summary for new")

        self.assertEqual(database[0]["title"], "Existing paper")


if __name__ == "__main__":
    unittest.main()
