export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface TransformedProject {
  id: number;
  slug: string;
  title: string;
  description: string;
  url: string;
  demo: string | null;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  featured: boolean;
  screenshot?: string;
}

const GITHUB_API = "https://api.github.com";
const GITHUB_USERNAME = "Marxz13";
const FEATURED_REPOS = ["Car-Rental", "property_price_prediction", "Personal-website-react"];

// Map project names to screenshot paths (add your screenshots to public/images/projects/)
const PROJECT_SCREENSHOTS: Record<string, string> = {
  "Car-Rental": "/images/projects/car-rental.png",
  "property_price_prediction": "/images/projects/property-prediction.png",
  "Personal-website-react": "/images/projects/personal-website.png",
};

// Map project names to live demo URLs (overrides GitHub homepage)
const PROJECT_DEMOS: Record<string, string> = {
  "property_price_prediction": "https://propvalue.marzallan.com",
};

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub repos: ${response.status}`);
  }

  return response.json();
}

export async function getTransformedProjects(): Promise<TransformedProject[]> {
  try {
    const repos = await getGitHubRepos();

    return repos
      .filter((repo) => !repo.name.includes(".github"))
      .map((repo) => ({
        id: repo.id,
        slug: repo.name.toLowerCase(),
        title: repo.name
          .replace(/-/g, " ")
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        description: repo.description || "No description available",
        url: repo.html_url,
        demo: PROJECT_DEMOS[repo.name] || repo.homepage,
        language: repo.language || "Unknown",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
        featured: FEATURED_REPOS.includes(repo.name),
        screenshot: PROJECT_SCREENSHOTS[repo.name],
      }))
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    return [];
  }
}
