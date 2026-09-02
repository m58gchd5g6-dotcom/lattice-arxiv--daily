def append_new_papers(database, fetched_papers, *, summarize, normalize):
    """Return a new database containing normalized records for unseen papers."""
    result = list(database)
    existing_ids = {paper.get("id") for paper in database}
    added = 0

    for paper in fetched_papers:
        paper_id = paper.get("id")
        if not paper_id or paper_id in existing_ids:
            continue

        summary = summarize(paper)
        result.append(normalize(paper, summary))
        existing_ids.add(paper_id)
        added += 1

    return result, added
