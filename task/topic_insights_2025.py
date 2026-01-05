import json
import math
import re
from collections import Counter, defaultdict

from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors


def load_topics(file_path: str, year: str) -> list[str]:
    topics = []
    with open(file_path, "r", encoding="utf-8") as handle:
        for line in handle:
            if not line.strip():
                continue
            try:
                study = json.loads(line)
            except json.JSONDecodeError:
                continue

            date_created = str(study.get("date_created", ""))
            if not date_created.startswith(year):
                continue

            name = str(study.get("name", "")).strip()
            if name:
                topics.append(name)

    return topics


def find_duplicate_topics(topics: list[str]) -> list[tuple[str, int]]:
    counts = Counter()
    for topic in topics:
        key = topic.strip().lower()
        if not key:
            continue
        counts[key] += 1
    duplicates = [(topic, count) for topic, count in counts.items() if count > 1]
    duplicates.sort(key=lambda item: item[1], reverse=True)
    return duplicates


STOPWORDS = {
    "a",
    "an",
    "and",
    "for",
    "in",
    "of",
    "on",
    "the",
    "to",
    "with",
    "market",
    "industry",
    "services",
    "service",
    "software",
    "solutions",
    "global",
    "management",
    "system",
    "systems",
    "platform",
    "platforms",
    "solution",
    "technology",
    "technologies",
}


def extract_keywords(topic: str) -> list[str]:
    tokens = re.findall(r"[a-z0-9]+", topic.lower())
    keywords = [token for token in tokens if token not in STOPWORDS and len(token) > 2]
    return keywords


def summarize_most_searched(
    topics: list[str], labels, embeddings, centers, limit: int
) -> list[dict]:
    cluster_members = defaultdict(list)
    for idx, label in enumerate(labels):
        cluster_members[label].append(idx)

    cluster_summaries = []
    for label, members in cluster_members.items():
        center = centers[label].reshape(1, -1)
        member_embeddings = embeddings[members]
        similarities = cosine_similarity(member_embeddings, center).reshape(-1)
        representative_idx = members[int(similarities.argmax())]
        representative = topics[representative_idx]
        sample_indices = members[:3]
        examples = [topics[idx] for idx in sample_indices]
        cluster_summaries.append(
            {
                "label": representative,
                "size": len(members),
                "examples": examples,
            }
        )

    cluster_summaries.sort(key=lambda item: item["size"], reverse=True)
    return cluster_summaries[:limit]


def build_embeddings(topics: list[str], model_name: str):
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer(model_name)
    return model.encode(topics, normalize_embeddings=True)


def pick_cluster_count(n_topics: int) -> int:
    return max(2, min(100, n_topics))


def cluster_topics(embeddings, topics: list[str], seed: int):
    n_clusters = pick_cluster_count(len(topics))
    kmeans = KMeans(n_clusters=n_clusters, random_state=seed, n_init=10)
    labels = kmeans.fit_predict(embeddings)
    centers = kmeans.cluster_centers_
    return labels, centers


def most_interesting_topics(
    embeddings, topics: list[str], limit: int, neighbor_k: int = 6
) -> list[tuple[str, float]]:
    if len(topics) <= 2:
        return [(topics[0], 0.0)] if topics else []

    k = min(neighbor_k, len(topics))
    neighbors = NearestNeighbors(n_neighbors=k, metric="cosine")
    neighbors.fit(embeddings)
    distances, _ = neighbors.kneighbors(embeddings)

    global_center = embeddings.mean(axis=0, keepdims=True)
    global_distances = 1 - cosine_similarity(embeddings, global_center).reshape(-1)

    scored = []
    for idx, topic in enumerate(topics):
        mean_neighbor_distance = float(distances[idx][1:].mean())
        unique_score = mean_neighbor_distance + float(global_distances[idx])
        scored.append((topic, unique_score))

    scored.sort(key=lambda item: item[1], reverse=True)
    return scored[:limit]


def most_distant_outliers(embeddings, topics: list[str], labels, centers, limit: int):
    distances = []
    for idx, label in enumerate(labels):
        center = centers[label].reshape(1, -1)
        similarity = cosine_similarity(embeddings[idx].reshape(1, -1), center)[0][0]
        distances.append((topics[idx], float(1 - similarity)))

    distances.sort(key=lambda item: item[1], reverse=True)
    return distances[:limit]


def main() -> None:
    file_path = "company_studies.jsonl"
    year = "2025"
    top_n = 10
    model_name = "all-MiniLM-L6-v2"
    seed = 42

    topics = load_topics(file_path, year)
    if not topics:
        print(f"No topics found for {year}.")
        return

    print(f"Loaded {len(topics)} topics for {year}.")

    duplicates = find_duplicate_topics(topics)
    if duplicates:
        print("\nDuplicate study titles (same name, multiple rows):")
        for topic, count in duplicates[:top_n]:
            print(f"- {topic} ({count})")

    embeddings = build_embeddings(topics, model_name)
    labels, centers = cluster_topics(embeddings, topics, seed)

    most_searched = summarize_most_searched(
        topics, labels, embeddings, centers, top_n
    )
    print("\nMost searched topics (largest semantic clusters):")
    for rank, cluster in enumerate(most_searched, start=1):
        print(
            f"{rank}. {cluster['label']} "
            f"(cluster size {cluster['size']})"
        )
        print(f"   Examples: {', '.join(cluster['examples'])}")

    interesting = most_interesting_topics(
        embeddings, topics, min(top_n, len(topics))
    )
    print("\nMost interesting topics (unexpected/unique):")
    for rank, (topic, score) in enumerate(interesting, start=1):
        print(f"{rank}. {topic} (uniqueness {score:.3f})")

    outliers = most_distant_outliers(
        embeddings, topics, labels, centers, min(top_n, len(topics))
    )
    print("\nOutliers far from other topics:")
    for rank, (topic, distance) in enumerate(outliers, start=1):
        print(f"{rank}. {topic} (distance {distance:.3f})")


if __name__ == "__main__":
    main()
