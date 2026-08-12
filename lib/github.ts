export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface SyncResult {
  repo: string;
  branch: string;
  buildFolder: string;
  commitsFound: number;
  newBuilds: number;
  commits: GitHubCommit[];
}

const MOCK_COMMITS: Record<string, GitHubCommit[]> = {
  "nabil/ecotype": [
    {
      sha: "9fa83c1a2b3c4d5",
      message: "Added trash sorting mechanic",
      author: "Nabil",
      date: "2026-08-01T10:00:00Z",
    },
    {
      sha: "7bc42de4f5a6b7",
      message: "Fixed UI bug on score screen",
      author: "Nabil",
      date: "2026-07-28T14:30:00Z",
    },
    {
      sha: "3a1f9b2c8d9e0",
      message: "Initial playable prototype",
      author: "Nabil",
      date: "2026-07-20T09:15:00Z",
    },
  ],
  "nabil/deck-recycle": [
    {
      sha: "ad821ab1234567",
      message: "Balance card draw rates",
      author: "Nabil",
      date: "2026-07-25T11:00:00Z",
    },
    {
      sha: "c4e5f678901234",
      message: "Added tutorial level",
      author: "Nabil",
      date: "2026-07-18T16:45:00Z",
    },
  ],
  "nabil/pixel-farm": [
    {
      sha: "f1a2b3c4d5e6f7",
      message: "Godot HTML5 export with crop system",
      author: "Nabil",
      date: "2026-08-02T08:00:00Z",
    },
  ],
};

export async function fetchCommitsFromGitHub(
  repo: string,
  branch: string,
  token?: string
): Promise<GitHubCommit[]> {
  if (token) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/commits?sha=${branch}&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        return data.map(
          (c: {
            sha: string;
            commit: { message: string; author: { name: string; date: string } };
          }) => ({
            sha: c.sha,
            message: c.commit.message.split("\n")[0],
            author: c.commit.author.name,
            date: c.commit.author.date,
          })
        );
      }
    } catch {
      // fall through to mock
    }
  }

  return MOCK_COMMITS[repo] ?? [];
}

export async function syncProjectFromGitHub(
  repo: string,
  branch: string,
  buildFolder: string,
  token?: string
): Promise<SyncResult> {
  const commits = await fetchCommitsFromGitHub(repo, branch, token);

  return {
    repo,
    branch,
    buildFolder,
    commitsFound: commits.length,
    newBuilds: 0,
    commits,
  };
}
