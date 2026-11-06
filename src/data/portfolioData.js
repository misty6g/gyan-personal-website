/**
 * Gyan Mistry - Portfolio Configuration & Data Source
 * 
 * Centralized data store for work experience, GitHub projects,
 * RIT coursework curriculum, education, and social links.
 * 
 * TO ADD OR EDIT SKILLS MANUALLY:
 * - For Work Experiences: edit the `technologies` array inside each object in `portfolioData.experiences`.
 * - For GitHub Projects: edit the `technologies` array inside each object in `portfolioData.projects`.
 * - For Coursework: edit the `technologies` array inside each object in `portfolioData.coursework`.
 * - For the Technical Skills Matrix: edit the arrays in `portfolioData.skills`.
 */

export const portfolioData = {
  personal: {
    name: "Gyan Atul Mistry",
    preferredName: "Gyan Mistry",
    title: "Artificial Intelligence at RIT",
    headline: "Seeking '27 Summer internships in software and ML engineering (backend, data, and ML systems)",
    location: "North Andover, MA / Rochester, NY",
    email: "mistrygyan@gmail.com",
    phone: "(978) 609-1925",
    clearance: "Active U.S. Department of Defense Secret Security Clearance",
    statusBadge: "Seeking '27 Summer Internships",
    resumePdfUrl: "/resume.pdf",
    avatarUrl: "/gyan.jpg",
    about: [
      "AI & Software Engineering student at RIT building high-performance distributed systems, ML pipelines, and autonomous agent infrastructure."
    ],
    fullBio: [
      "I am an Artificial Intelligence undergraduate at RIT (Presidential Scholar, Dean's List) with minors in Software Engineering, Applied Statistics, and Math. I am on track to be the first graduate of RIT's Artificial Intelligence degree program.",
      "Over the past two summers, I shipped production-scale automation and ML systems in high-stakes environments. At Lockheed Martin, I held an active DoD Secret clearance with the F-16 IFG team, building AI agents to convert technical orders from SGML to XML (hitting an 80% accuracy target) and automating zero-data-loss ticket migrations from MS Planner to Jira. At Redis, I built Python automation pipelines integrating Glean, Jira, and Squadcast REST APIs to process 4,000+ tickets (cutting categorization time by 95%), while automating executive reporting from 4 hours down to 3 minutes.",
      "Outside of internships, I engineer high-performance systems: a Kalshi prediction-market trading engine in Python and Rust, autonomous multi-agent operating systems, computer vision models, and sports analytics pipelines. I also lead the RIT Men's Club Volleyball team as Captain and ECVA All-Star. I work primarily in Python, PyTorch, and TypeScript, with growing depth in Rust, C++, Docker, and distributed cloud systems."
    ]
  },

  badges: [
    { label: "Active DoD Secret Clearance", icon: "shield", variant: "defense" },
    { label: "Seeking '27 Summer Internships", icon: "briefcase", variant: "primary" },
    { label: "RIT Presidential Scholar & Dean's List", icon: "award", variant: "gold" },
    { label: "1st Graduate of RIT's AI Program", icon: "star", variant: "accent" },
    { label: "xAI Grok Competition Winner", icon: "trophy", variant: "gold" },
    { label: "ECVA All-Star Volleyball Captain", icon: "activity", variant: "accent" }
  ],

  /**
   * Social Links
   */
  socials: [
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/gyanmistry/",
      handle: "in/gyanmistry",
      icon: "linkedin"
    },
    {
      platform: "GitHub",
      url: "https://github.com/misty6g",
      handle: "misty6g",
      icon: "github"
    },
    {
      platform: "Twitter / X",
      url: "https://x.com/MistryGyan",
      handle: "@MistryGyan",
      icon: "twitter"
    },
    {
      platform: "Spotify",
      url: "https://open.spotify.com/user/31qptdpulx4f2pa5n4dxzj3bukyy?si=a9aa2f56eae24cfa",
      handle: "Spotify Profile",
      icon: "music"
    },
    {
      platform: "Email",
      url: "mailto:mistrygyan@gmail.com",
      handle: "mistrygyan@gmail.com",
      icon: "mail"
    },
    {
      platform: "Live Web App",
      url: "https://asl-study-tool-theta.vercel.app/",
      handle: "asl-study-tool-theta.vercel.app",
      icon: "globe"
    }
  ],

  /**
   * Comprehensive Categorized Skills Matrix
   */
  skills: {
    "Programming Languages": [
      "Python", "Rust", "C++", "Java", "TypeScript", "JavaScript", "SQL", "C", "Go", "Bash", "C#", "TI-BASIC", "MongoDB"
    ],
    "Frameworks & AI/ML": [
      "PyTorch", "FastAPI", "Next.js", "Flask", "Hugging Face Transformers", "sentence-transformers", "NumPy", "TensorFlow", "Scikit-learn", "React 19", "React Native", "Expo", "Node.js", "Express", "Three.js", "Tailwind CSS", "Gradio", "Zustand", "MediaPipe", "FAISS", "LSTM", "Matplotlib", "Pydantic", "TanStack Query", "Pandas", "OpenCV", "CUDA"
    ],
    "Data, Cloud & DevOps": [
      "Kubernetes", "Docker", "Docker Compose", "OpenTelemetry", "Firebase", "Firestore", "SQLAlchemy", "SQLite", "Redis", "PostgreSQL", "Supabase", "HDF5", "Grafana", "Tableau", "OpenAPI", "GitHub Actions", "pytest", "Playwright", "Vitest", "Jest", "CMake", "ffmpeg", "Jira", "Squadcast", "OpenAI API", "xAI Grok API", "NVIDIA Nemotron", "Nebius Token Factory", "Vercel", "Render", "Git", "Linux"
    ],
    "Systems, Quant & Methodologies": [
      "Multi-Agent Systems", "Retrieval-Augmented Generation (RAG)", "BM25", "Adversarial Machine Learning", "Large Language Models (LLMs)", "Computer Vision", "High-Performance Computing (HPC)", "Statistical Process Control (SPC)", "Fractional Kelly Sizing", "Point-in-Time Backtesting", "Bayesian Modeling", "Algorithmic Trading", "Minimax Game Theory", "WebSockets", "PWA", "IndexedDB", "Agile/Scrum", "CI/CD", "Enterprise Architecture"
    ]
  },

  /**
   * Work Experience
   * Top 2 experiences (Lockheed Martin and Redis) shown by default.
   */
  experiences: [
    {
      id: "lockheed-martin",
      company: "Lockheed Martin",
      location: "Fort Worth, TX",
      featured: true,
      roles: [
        {
          title: "Artificial Intelligence Intern",
          period: "August 2026 - Present",
          current: true
        },
        {
          title: "Software Engineering Aero Intern",
          period: "May 2026 - July 2026",
          current: false
        }
      ],
      tagline: "F-16 IFG Team / ACA Bay / DoD Secret Clearance",
      bullets: [
        "Embedded with the F-16 Integrated Fighter Group (IFG) team in an ACA bay, operating under an active U.S. Department of Defense Secret security clearance.",
        "Engineered AI agents and automated conversion scripts to transform F-16 Technical Orders (TOs) from SGML to XML, hitting an 80% automated accuracy target.",
        "Spearheaded Jira site setup and authored Python automation scripts to migrate legacy tickets from Microsoft Planner to Jira with zero data loss.",
        "Conducted sprint demonstrations for cross-functional stakeholders, incorporated technical feedback, and deployed iterative improvements continually."
      ],
      technologies: [
        "Python", "AI Agents", "SGML", "XML", "Jira Administration", "Microsoft Planner", "REST APIs", 
        "Data Migration", "ETL", "JQL", "Bash", "Defense Tech", "Agile/Scrum", "DoD Secret Clearance", 
        "Technical Documentation", "OpenAI API", "NVIDIA Nemotron API", "Linux", "Jupyter", "Kubernetes", "Atlassian", "Windows", "Windsurf", "Claude Code"
      ]
    },
    {
      id: "redis",
      company: "Redis",
      location: "Remote",
      featured: true,
      roles: [
        {
          title: "Cloud Service Ops R&D Intern / Cloud Operations Engineer",
          period: "June 2025 - August 2025",
          current: false
        }
      ],
      tagline: "Cloud Operations / Production ETL & Automation Pipelines",
      bullets: [
        "Built Python automation pipelines integrated with REST APIs (Glean, Jira, Squadcast) to process 4,000+ support and incident tickets.",
        "Cut manual categorization time by 95% and improved ticket labeling accuracy +70% compared to manual baseline (validated by a 300-ticket spot-check).",
        "Unified automated pipelines across four external systems (Jira, Grafana, Zendesk, Squadcast) plus CSV, Google Sheets, and Tableau exports, achieving 99.6% job success over 7 runs with retry logic, exponential backoff, and dry-run safety checks.",
        "Automated Root Cause Analysis (RCA) rollups and executive summary slides (Python to Tableau), slashing weekly reporting prep from 4 hours down to 3 minutes.",
        "Developed custom Tableau BI dashboards and automated RCA analytics leveraging SQL and Python ETL workflows to enhance operational visibility.",
        "Leveraged OpenAI API and Glean to generate automated executive narratives on incident subcategories, isolating 4 high-impact problem areas with root causes and remediations adopted by Cloud Ops."
      ],
      technologies: [
        "Python", "Redis", "REST APIs", "OpenAI API", "Glean API", "Jira API", "Squadcast API", 
        "Zendesk API", "Tableau", "SQL", "ETL Pipelines", "Grafana", "Exponential Backoff", 
        "Incident Management", "Root Cause Analysis (RCA)", "Automated Reporting", "BI Dashboards", 
        "Google Sheets API", "CSV Processing", "Ai Agents", "SQL", "JQL", "Data Visualization"
      ]
    },
    {
      id: "rit-campus",
      company: "Rochester Institute of Technology",
      location: "Rochester, NY",
      featured: false,
      roles: [
        {
          title: "Intramural Referee",
          period: "August 2025 - Present",
          current: true
        },
        {
          title: "RIT Freshman Orientation Leader",
          period: "August 2026 - August 2026",
          current: false
        }
      ],
      tagline: "Campus Leadership / Athletic Operations & Student Mentorship",
      bullets: [
        "Officiated collegiate intramural athletics contests, enforcing competitive rules, managing fast-paced game dynamics, and maintaining fair play under pressure.",
        "Mentored incoming freshmen, facilitating orientation curriculum, navigating campus computing and academic resources, and leading cohort discussions."
      ],
      technologies: [
        "Leadership", "Conflict Resolution", "High-Pressure Decision Making", "Public Speaking", 
        "Athletic Officiating", "Mentorship", "Event Coordination", "Time Management"
      ]
    },
    {
      id: "community-service",
      company: "North Andover Community Service & Athletics",
      location: "North Andover, MA",
      featured: false,
      roles: [
        {
          title: "Summer Camp Counselor (North Andover Youth & Rec)",
          period: "June 2022 - August 2024",
          current: false
        },
        {
          title: "Soccer Referee (North Andover Soccer Association)",
          period: "September 2019 - June 2024",
          current: false
        }
      ],
      tagline: "Youth Mentorship / 4+ Years Certified Refereeing",
      bullets: [
        "Organized daily sports clinics, team games, and STEM crafts for elementary school youth (kindergarten through 2nd grade).",
        "Refereed competitive youth soccer leagues across 4+ seasons, upholding strict safety protocols, precision timekeeping, and fair play."
      ],
      technologies: [
        "Youth Mentorship", "Athletic Coaching", "Rules Enforcement", "Conflict Resolution", 
        "Team Leadership", "Public Speaking", "First Aid Safety"
      ]
    }
  ],

  /**
   * Projects Showcase
   * Ordered with the strongest SWE, ML, and systems work first.
   */
  projects: [
    {
      id: "model-serve-k8s",
      title: "Model Serve on Kubernetes",
      subtitle: "FastAPI inference, probes, and CPU autoscaling",
      badge: "ML Systems",
      featured: true,
      description: "A scikit-learn digits classifier served with FastAPI, built into a Docker image, and run on a local kind cluster with health probes, resource limits, and a HorizontalPodAutoscaler.",
      highlights: [
        "POST /predict accepts 1-256 images. GET /healthz, /readyz, and /metrics cover liveness, readiness, and counters. Eight pytest tests, and GitHub Actions runs the tests plus the Docker build.",
        "Held-out eval job on 450 images, recorded 2026-10-22 on kind v0.24 / Kubernetes 1.31: 97.11% accuracy and 0.9711 macro-F1.",
        "In-cluster load test (16 clients, 32-image batches, 150 s): 180,773 successful requests, ~1,205 req/s, latency p50 8.5 ms, p95 42.4 ms, p99 78.6 ms. HPA went from 1 replica to the cap of 5."
      ],
      technologies: [
        "Python", "FastAPI", "Scikit-learn", "NumPy", "Pydantic", "Docker",
        "Kubernetes", "pytest", "GitHub Actions", "Uvicorn"
      ],
      githubUrl: "https://github.com/misty6g/model-serve-k8s",
      liveUrl: null
    },
    {
      id: "agent-rag-observability",
      title: "Agent RAG Observability",
      subtitle: "Flask-docs QA with FAISS, BM25, and tracing",
      badge: "RAG + Tracing",
      featured: true,
      description: "Retrieval-augmented QA over about 33k words of Flask documentation, with FAISS dense search, BM25, hybrid reciprocal-rank fusion, local Qwen generators, and OpenTelemetry spans per request.",
      highlights: [
        "On 30 questions, hybrid retrieval at 100-word chunks reached recall@5 0.967 and MRR@10 0.848. Hybrid matched or beat dense-only MRR at every published chunk size.",
        "Qwen2.5-1.5B with hybrid-c200 scored 70.0% answer accuracy versus 43.3% for dense-c200. Doc-level hit@3 was 86.7% in both rows. Accuracy means the gold string appears as a whole token.",
        "FastAPI exposes POST /ask and GET /healthz. Twelve pytest tests run without downloading a model. The README states this service was not deployed to Cloud Run."
      ],
      technologies: [
        "Python", "FastAPI", "FAISS", "BM25", "sentence-transformers",
        "Hugging Face Transformers", "PyTorch", "OpenTelemetry", "NumPy",
        "pytest", "Retrieval-Augmented Generation (RAG)"
      ],
      githubUrl: "https://github.com/misty6g/agent-rag-observability",
      liveUrl: null
    },
    {
      id: "ai-redteam-harness",
      title: "AI Red-Team Harness",
      subtitle: "Prompt-injection eval and adversarial MNIST",
      badge: "ML Security",
      featured: true,
      description: "Seeded harness that measures indirect prompt injection against a local Qwen2.5-1.5B tool-using agent, and FGSM/PGD robustness of a small PyTorch CNN on MNIST.",
      highlights: [
        "With no defense, attack success was 32/100. A tool-call allowlist and a detection pre-filter each recorded 0/100 on this suite. Spotlighting recorded 29/100. Overt injections succeeded 32/50. Subtle ones succeeded 0/50 on this model.",
        "The standard CNN's clean accuracy was 95.65% and fell to 4.50% under PGD-10 at eps=0.2. One round of PGD adversarial training reached 62.30% robust accuracy at that epsilon, with clean accuracy 92.90%.",
        "21 pytest tests. Runs use seed 1337 and greedy decoding. Every number above is taken from results/ in the repo."
      ],
      technologies: [
        "Python", "PyTorch", "Hugging Face Transformers", "NumPy", "pytest",
        "Adversarial Machine Learning", "GitHub Actions"
      ],
      githubUrl: "https://github.com/misty6g/ai-redteam-harness",
      liveUrl: null
    },
    {
      id: "partner-integration-kit",
      title: "Partner Integration Kit",
      subtitle: "Signed webhooks, generated SDKs, onboarding CLI",
      badge: "Partner API",
      featured: false,
      description: "FastAPI partner API with hashed API keys, idempotent order writes, HMAC-signed webhooks, a dead-letter queue, OpenAPI-generated Python and TypeScript clients, and a BM25 help bot over the runbooks.",
      highlights: [
        "Measured 2026-10-06: 46 pytest tests passed, and Coverage.py reported 93% branch coverage on src/ (statements 1503, missed 70, branches 258, partial 41).",
        "Webhook drill of 30 deliveries: 24 succeeded, 6 dead-lettered, 0 bad signatures, and 78 signature checks passed.",
        "GET /v1/orders latency on SQLite: p50 30.322 ms, p95 63.363 ms (200 samples, concurrency 8, 0 errors). POST /v1/orders p95 93.588 ms. Help-bot top-1 and top-3 were 16/16 on the labeled set."
      ],
      technologies: [
        "Python", "FastAPI", "SQLAlchemy", "SQLite", "Pydantic", "OpenAPI",
        "TypeScript", "Redis", "Docker", "Docker Compose", "pytest", "BM25",
        "GitHub Actions"
      ],
      githubUrl: "https://github.com/misty6g/partner-integration-kit",
      liveUrl: null
    },
    {
      id: "dnn-seq-lab",
      title: "DNN Sequence Lab",
      subtitle: "PyTorch sequence models on synthetic book data",
      badge: "Deep Learning",
      featured: false,
      description: "A research loop on synthetic limit-order-book sessions: a known path-dependent label, a linear baseline, a TCN, an LSTM, and a transformer, with early stopping and held-out ranking metrics. The sessions are simulated.",
      highlights: [
        "Published seed-7 run, model chosen by validation AUC: TCN test AUC 0.789 (session-bootstrap 95% interval 0.759-0.818) and test Spearman IC 0.603. The linear baseline reached test AUC 0.737 and IC 0.501.",
        "LSTM test AUC 0.788 with 30,769 parameters, against the TCN at 57,121 parameters. The transformer test AUC was 0.771.",
        "pytest checks the no-look-ahead feature contract, AUC and IC, a forward pass of each architecture, and a one-epoch training smoke test."
      ],
      technologies: [
        "Python", "PyTorch", "NumPy", "Pandas", "Matplotlib", "LSTM", "pytest"
      ],
      githubUrl: "https://github.com/misty6g/dnn-seq-lab",
      liveUrl: null
    },
    {
      id: "orbit",
      title: "Orbit",
      subtitle: "Multi-agent student OS on Nebius and Nemotron",
      badge: "Live Demo",
      featured: false,
      description: "Personal student OS built for the Nebius x NVIDIA Global AI Hackathon. Orbit Core routes a turn across specialist domains, stores a per-user profile in Firestore, and asks before it writes to an external system.",
      highlights: [
        "Next.js and TypeScript app with Firebase Auth (email and Google). Nebius and Tavily keys can be pasted in the app, and the Vercel host can supply defaults.",
        "Orbit Core calls NVIDIA Nemotron on Nebius Token Factory to choose specialist planets and a Nano, Super, or Ultra response tier.",
        "Specialists cover schedule, study, health, wallet, career, travel, and local search. The home view is a Three.js solar system. Live at orbit-nebius-hackathon.vercel.app."
      ],
      technologies: [
        "TypeScript", "Next.js", "React", "Three.js", "Firebase", "Firestore",
        "Tailwind CSS", "NVIDIA Nemotron", "Nebius Token Factory",
        "Multi-Agent Systems", "Vercel"
      ],
      githubUrl: "https://github.com/misty6g/orbit-nebius-hackathon",
      linkedinPostUrl: "https://lnkd.in/p/gpJiiM-x",
      liveUrl: "https://orbit-nebius-hackathon.vercel.app"
    },
    {
      id: "kalshi-quant",
      title: "Kalshi Quant & Betting Agent",
      subtitle: "Python and Rust prediction-market agent",
      badge: "Quant Trading System",
      featured: false,
      description: "Kalshi trading agent that estimates event probabilities with Perplexity Sonar and Octagon, compares them with market odds, and can paper-trade, dry-run, or place live orders behind a risk manager.",
      highlights: [
        "Python loop covers market discovery, a weighted ensemble of the two research estimates, an edge check, a kill switch, and a Flask dashboard.",
        "Rust crates implement strategy, risk limits, execution, and snapshot backtests. Position size uses fractional Kelly and is capped by the risk limits. PyO3 exposes that core to Python.",
        "Paper mode simulates a $1,000 portfolio. Dry-run logs the orders it would send. Live mode can target the Kalshi demo environment. The API client signs requests with RSA."
      ],
      technologies: [
        "Python", "Rust", "PyO3", "Flask", "Fractional Kelly Sizing",
        "Point-in-Time Backtesting", "Algorithmic Trading", "REST APIs"
      ],
      githubUrl: "https://github.com/misty6g/kalshi-perplexity-betting-agent",
      liveUrl: null
    },
    {
      id: "xbaw-fab-ops",
      title: "XBAW Fab Ops",
      subtitle: "Synthetic fab line with yield and SPC",
      badge: "Manufacturing Software",
      featured: false,
      description: "MES-lite demo for a fictional RF bulk-acoustic-wave filter line. It ingests SECS/GEM-inspired JSON tool events into SQL and reports die yield, line yield, scrap, throughput, and an individuals-style SPC chart.",
      highlights: [
        "FastAPI ingest treats a repeated event id as a no-op. Docker Compose runs Postgres. Local runs and tests use SQLite. The dashboard is React and TypeScript.",
        "pytest covers the KPI math: die yield, line yield, wafer scrap, throughput, step yield, utilization, and Cp/Cpk. SPC limits are mean plus or minus 3 sample standard deviations.",
        "Harborline RF Line 2, its recipes, and its history are synthetic. The README says the project is not affiliated with a real fab."
      ],
      technologies: [
        "Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "SQLite", "Pydantic",
        "React", "TypeScript", "Docker", "Docker Compose", "pytest",
        "Statistical Process Control (SPC)", "GitHub Actions"
      ],
      githubUrl: "https://github.com/misty6g/xbaw-fab-ops",
      liveUrl: null
    },
    {
      id: "cuda-kernel-lab",
      title: "CUDA Kernel Lab",
      subtitle: "SAXPY, reductions, and tiled GEMM",
      badge: "High Performance Computing",
      featured: false,
      description: "CUDA and C++ microbenchmarks for STREAM-style copy, SAXPY, a shared-memory reduction, and naive versus 16x16 tiled GEMM. Each device kernel is checked against a CPU reference. CI builds the host path because GitHub Actions has no GPU.",
      highlights: [
        "Tiled GEMM stages 16x16 panels in shared memory. The host implementation uses the same tile algorithm, including shapes that are not multiples of 16.",
        "The reduction is a shared-memory tree with __syncthreads, then a host finish of the partials.",
        "Copy, SAXPY, and the reduction report GB/s. GEMM reports GFLOPS. Those rates move with the machine."
      ],
      technologies: [
        "CUDA", "C++", "C", "High-Performance Computing (HPC)", "CMake", "GitHub Actions"
      ],
      githubUrl: "https://github.com/misty6g/cuda-kernel-lab",
      liveUrl: null
    },
    {
      id: "asl-study-tool",
      title: "ASL Study Tool",
      subtitle: "Full-Stack Web Application with In-Browser Computer Vision",
      badge: "Live Production App",
      featured: false,
      description: "Interactive American Sign Language learning platform featuring real-time client-side computer vision that scores hand landmark geometry live through the user's webcam without server latency.",
      highlights: [
        "Engineered 9 core sign decks with 140+ animated flashcards utilizing 3D CSS perspective flips, video streaming, and responsive deck navigation.",
        "Implemented client-side computer vision using Google MediaPipe Tasks Vision to evaluate real-time webcam sign landmark geometry across 6 movement dimensions with custom scoring heuristics.",
        "Built a timed quiz mode with fuzzy slash-variant answer validation, synthesized Web Audio sound feedback, and automated reinforcement queues for missed signs."
      ],
      technologies: [
        "React 19", "TypeScript", "JavaScript", "Node.js", "Express", "PostgreSQL",
        "Supabase", "Google MediaPipe Tasks Vision", "Computer Vision", "Landmark Geometry",
        "Webcam Video Streaming", "3D CSS Transforms", "Web Audio API", "Fuzzy String Matching",
        "Spaced Repetition", "Vercel", "Render", "Full-Stack Architecture", "REST APIs"
      ],
      githubUrl: "https://github.com/misty6g/ASL-Study-Tool",
      liveUrl: "https://asl-study-tool-theta.vercel.app"
    },
    {
      id: "volleyball-lineup-sheet",
      title: "Rotation Board",
      subtitle: "Offline volleyball lineup PWA",
      badge: "Live Demo",
      featured: false,
      description: "Mobile-first lineup manager for RIT Men's Volleyball. It builds serve-receive lineups, rotates on side-out, and applies libero swaps and planned subs. All match state stays in the browser.",
      highlights: [
        "Next.js and TypeScript. The rotation engine lives in src/domain with Zod validation. Zustand stores undo as court snapshots.",
        "Dexie writes lineups to IndexedDB. A service worker caches the app shell so the board still opens in a gym with no network.",
        "Vitest covers the domain logic. Playwright covers the flows. Live at volleyball-lineup-sheet.vercel.app."
      ],
      technologies: [
        "TypeScript", "Next.js", "React", "Tailwind CSS", "Zustand", "IndexedDB",
        "Playwright", "Vitest", "PWA"
      ],
      githubUrl: "https://github.com/misty6g/volleyball-lineup-sheet",
      liveUrl: "https://volleyball-lineup-sheet.vercel.app"
    },
    {
      id: "thrift-swipe",
      title: "Thrift Swipe",
      subtitle: "Expo marketplace with a swipe deck and checkout",
      badge: "React Native",
      featured: false,
      description: "React Native and Expo app for secondhand clothing. A swipe deck, multi-seller cart, and simulated checkout sit on Supabase, with a deterministic ranking function for the feed.",
      highlights: [
        "Gesture Handler and Reanimated drive the deck. Swipe right carts the item, swipe left records a pass, and undo restores the last action.",
        "Supabase provides Auth, Postgres, row-level security, and a checkout RPC. With empty env vars the app runs a demo catalog the README describes as 14 sellers and 105+ listings.",
        "src/lib/ranking.ts scores the feed with category +30, size +25, price fit +20, plus tag, brand, and freshness terms."
      ],
      technologies: [
        "TypeScript", "React Native", "Expo", "Supabase", "PostgreSQL",
        "TanStack Query", "Jest"
      ],
      githubUrl: "https://github.com/misty6g/thrift-swipe",
      liveUrl: null
    },
    {
      id: "volleyball-film-editor",
      title: "Rally Cut",
      subtitle: "Volleyball film trimmer from court motion",
      badge: "Computer Vision",
      featured: false,
      description: "Finds volleyball rallies in a game film or a YouTube link, drops the standing-around time between serves, and exports a trimmed cut after a manual segment review.",
      highlights: [
        "Scores spatial residual motion inside a court ROI after estimating camera translation. An optional OpenCV HOG person prior weights the motion, and serve-toss detection can snap the lead-in.",
        "The Gradio UI edits keep-segments. ffmpeg writes the export. yt-dlp downloads URL inputs.",
        "pytest covers detection, download, and the pipeline."
      ],
      technologies: [
        "Python", "OpenCV", "NumPy", "Gradio", "ffmpeg", "pytest", "Computer Vision"
      ],
      githubUrl: "https://github.com/misty6g/volleyball-film-editor",
      liveUrl: null
    },
    {
      id: "gridiron-market-lab",
      title: "Gridiron Market Lab",
      subtitle: "Point-in-time NFL odds research harness",
      badge: "Sports Analytics",
      featured: false,
      description: "Offline NFL odds sandbox. It joins the latest pre-kickoff line to each game, runs a pluggable signal, and settles unit bets with American-odds math. The sample data is synthetic.",
      highlights: [
        "The point-in-time join uses the latest odds as of a decision time and never a line from after kickoff. pytest covers that look-ahead guard.",
        "Strategies in the repo are closing_line_value and rest_form. Reports include hit rate, total PnL, and Brier score.",
        "The CLI is standard-library Python. No API keys are required."
      ],
      technologies: [
        "Python", "pytest", "Point-in-Time Backtesting", "Algorithmic Trading"
      ],
      githubUrl: "https://github.com/misty6g/gridiron-market-lab",
      liveUrl: null
    },
    {
      id: "lane-assist-lite",
      title: "Lane Assist Lite",
      subtitle: "OpenCV lane detection and offset estimate",
      badge: "Computer Vision",
      featured: false,
      description: "CPU-only lane perception demo. It finds lane markings in a still or a dashcam clip, estimates lateral offset in the image plane, and writes an annotated frame plus a JSON report.",
      highlights: [
        "Pipeline: blur, Canny edges, a yellow and white HLS prior, a perspective ROI, probabilistic Hough segments, then a slope-intercept fit.",
        "Offset at the bottom of the ROI is image center minus lane center. The README defines positive as right of center.",
        "GitHub Actions runs pytest on Python 3.11 and 3.12 with opencv-python-headless."
      ],
      technologies: [
        "Python", "OpenCV", "NumPy", "Computer Vision", "pytest", "GitHub Actions"
      ],
      githubUrl: "https://github.com/misty6g/lane-assist-lite",
      liveUrl: null
    },
    {
      id: "anime-frame-search",
      title: "Anime Frame Search",
      subtitle: "Cosine search over frame embeddings",
      badge: "Visual Search",
      featured: false,
      description: "Visual search over short anime-style frames. A pluggable embedder builds a NumPy matrix, and queries rank frames by cosine similarity through FastAPI and a small browser UI.",
      highlights: [
        "The default HashEmbedder needs no model download. Image and caption vectors are fused, L2-normalized, and stored with np.savez_compressed.",
        "pytest runs with AFS_EMBEDDER=hash. The embedder module also describes an optional sentence-transformers CLIP backend, commented out of the default requirements.",
        "Queries rank that NumPy matrix by cosine similarity."
      ],
      technologies: [
        "Python", "FastAPI", "NumPy", "Pydantic", "pytest"
      ],
      githubUrl: "https://github.com/misty6g/anime-frame-search",
      liveUrl: null
    },
    {
      id: "finc-425-tick-api",
      title: "FINC 425 Tick Data API",
      subtitle: "Futures order book and limit-flow reader",
      badge: "Coursework",
      featured: false,
      description: "Course code that reads 2018 futures tick files from HDF5 into pandas. It exposes the order book, trades, weighted book balance, and limit flows for Treasury and equity-index symbols, including ZT.",
      highlights: [
        "load_h5 opens a day's foreground.h5 file and checks that book columns share one append number.",
        "Implemented views include get_order_book, weighted book balance, trades, and limit flows between two timestamps, plus a matplotlib plot of the book.",
        "Symbols in the loader include ZT, ZF, ZN, ZB, UB, TN, and ES, each with a tick size."
      ],
      technologies: [
        "Python", "Pandas", "Matplotlib", "HDF5", "Algorithmic Trading"
      ],
      githubUrl: "https://github.com/misty6g/FINC-425-stock-market-algorithmic-trading",
      liveUrl: null
    },
    {
      id: "spike-rally",
      title: "Spike Rally",
      subtitle: "Real-Time Multiplayer Volleyball Mini-Game",
      badge: "Full-Stack Gaming",
      featured: false,
      description: "Real-time 2D volleyball mini-game engineered with TypeScript, HTML5 Canvas physics, and WebSocket-driven multiplayer synchronization.",
      highlights: [
        "Built responsive 2D ball physics, spike collision calculations, and player movement mechanics using HTML5 Canvas.",
        "Implemented low-latency client-server state synchronization over WebSockets with Node.js.",
        "Designed room matchmaking and game-state broadcast logic for competitive head-to-head rallies."
      ],
      technologies: [
        "TypeScript", "JavaScript", "HTML5 Canvas", "WebSockets", "Node.js", 
        "Real-Time Networking", "Client-Server State Synchronization", "2D Collision Detection", 
        "Physics Engine", "Multiplayer Matchmaking", "Game Loops"
      ],
      githubUrl: "https://github.com/misty6g/spike-rally",
      liveUrl: null
    },
    {
      id: "mancala-move-calculator",
      title: "Mancala Move Calculator",
      subtitle: "Game Engine & Minimax Strategy Evaluation",
      badge: "Algorithms & Game Theory",
      featured: false,
      description: "Interactive Mancala board game engine with minimax lookahead search to compute optimal move sequences and board evaluations.",
      highlights: [
        "Modeled complete Mancala game rules, extra-turn chains, and pit capture mechanics.",
        "Implemented minimax decision trees with alpha-beta pruning to compute the highest-value move sequences.",
        "Created an interactive visual board state interface allowing users to test hypothetical game positions."
      ],
      technologies: [
        "JavaScript", "Node.js", "Express", "Minimax Game Theory", "Alpha-Beta Pruning"
      ],
      githubUrl: "https://github.com/misty6g/mancala-move-calculator",
      liveUrl: null
    },
    {
      id: "ti84-rng-programs",
      title: "TI-84 RNG Toolkit",
      subtitle: "MATH 301 generators and samplers",
      badge: "Numerical Methods",
      featured: false,
      description: "Menu-driven TI-BASIC program for a TI-84 Plus. It runs congruential generators, period checks, inverse-transform samplers, accept-reject, and a linear-feedback shift register, then returns to the menu.",
      highlights: [
        "RNG tools: LCG sequences, Hull-Dobell full-period checks, Carmichael lambda, modular inverse, Kolmogorov-Smirnov uniforms, and LFSR period.",
        "Sampling tools: inverse transform for a general PMF, accept-reject, Poisson and binomial inversion, and alias-method setup.",
        "Source is src/MATH301.txt. build.py packs bin/MATH301.8xp with the tivars library. Results are displayed and not saved."
      ],
      technologies: [
        "TI-BASIC", "Python"
      ],
      githubUrl: "https://github.com/misty6g/ti84-rng-programs",
      liveUrl: null
    },
    {
      id: "clash-royale-bot",
      title: "Clash Royale Bot",
      subtitle: "Automated Screen Vision & Decision Agent",
      badge: "Game Automation",
      featured: false,
      description: "Screen perception bot using computer vision to monitor real-time game states and execute tactical troop deployments.",
      highlights: [
        "Employed OpenCV template matching and color thresholding to detect elixir counts, tower health, and enemy placements on screen.",
        "Formulated rule-based response heuristics to execute defensive and counter-push plays automatically.",
        "Automated input dispatch with simulated coordinate taps and low-latency frame capture."
      ],
      technologies: [
        "Python", "OpenCV", "Computer Vision", "Template Matching", "Color Thresholding", 
        "Image Recognition", "Automated Decision Making", "GUI Automation", "PyAutoGUI", 
        "State Machine Architecture", "Real-Time Video Ingestion"
      ],
      githubUrl: "https://github.com/misty6g/clash-royale-bot",
      liveUrl: null
    }
  ],

  /**
   * Complete Coursework from RIT Transcript / Schedule
   * All 32 courses equipped with fully comprehensive technical skills and concepts.
   */
  coursework: [
    // --- Flagship AI, Machine Learning, and Systems Courses ---
    {
      id: "csci-335",
      code: "CSCI 335",
      title: "Machine Learning",
      category: "Artificial Intelligence & ML",
      term: "Summer 2026",
      status: "Taken",
      featured: true,
      technologies: [
        "Python", "Scikit-learn", "Computer Vision", "Supervised Learning", "Unsupervised Learning", 
        "Support Vector Machines (SVMs)", "SoftMax", "Neural Networks", "Bayesian Decision Theory", 
        "Gradient Descent", "Overfitting & Regularization", "Cross-Validation", "Model Evaluation"
      ],
      description: "Foundational and modern machine learning theories and algorithms: supervised and unsupervised learning, Bayesian decision theory, support vector machines, and deep neural networks."
    },
    {
      id: "ling-581",
      code: "LING 581",
      title: "Natural Language Processing I",
      category: "Artificial Intelligence & ML",
      term: "Fall 2026",
      status: "In Progress",
      featured: true,
      technologies: [
        "Python", "PyTorch", "Natural Language Processing (NLP)", "Transformers", "Tokenization", 
        "Word2Vec", "BERT", "Syntactic Parsing", "Part-of-Speech Tagging", "Language Models", 
        "Computational Linguistics", "NLTK", "Jupyter Notebook", "Gradient Descent", "SoftMax", "Diacritics"
      ],
      description: "Computational processing of natural language: syntactic parsing, tokenization algorithms, word embeddings, transformer architectures, and sequence-to-sequence language modeling."
    },
    {
      id: "swen-566",
      code: "SWEN 566",
      title: "AI-Centric Software",
      category: "Artificial Intelligence & ML",
      term: "Spring 2026",
      status: "Taken",
      featured: true,
      technologies: [
        "Python", "OpenAI API", "Large Language Models (LLMs)", "AI Agents", "Prompt Engineering", 
        "Azure AI Services", "Computer Vision APIs", "LangChain", "Multimodal Architectures", 
        "API Integration", "Agentic Workflows"
      ],
      description: "Production engineering of software applications powered by AI: provisioning AI services, integrating Large Language Models, engineering autonomous agents, and building multimodal applications."
    },
    {
      id: "csci-331",
      code: "CSCI 331",
      title: "Introduction to Artificial Intelligence",
      category: "Artificial Intelligence & ML",
      term: "Fall 2026",
      status: "In Progress",
      featured: true,
      technologies: [
        "Python", "State-Space Search", "A* Search Algorithm", "Heuristic Optimization", 
        "Propositional Logic", "First-Order Logic", "Automated Planning", 
        "Constraint Satisfaction Problems (CSP)", "Adversarial Search", "Game Playing"
      ],
      description: "Theories and algorithms for designing AI systems: state-space search, heuristic algorithms, propositional and first-order logic, automated planning, and constraint satisfaction."
    },
    {
      id: "finc-425",
      code: "FINC 425",
      title: "Stock Market Algorithmic Trading",
      category: "Quantitative & Finance",
      term: "Spring 2026",
      status: "Taken",
      featured: true,
      technologies: [
        "Python", "Pandas", "Quantitative Finance", "Algorithmic Trading", "Time Series Analysis", 
        "Statistical Arbitrage", "Market Microstructure", "Backtesting Engines", "Order Book Dynamics", 
        "Risk Management", "Sharpe Ratio", "Markov Chains", "Monte Carlo Simulation", "Options Trading", "Leverage Trading", "Portfolio Optimization"
      ],
      description: "Quantitative trading strategies and market microstructure: statistical arbitrage, momentum and mean-reversion modeling, algorithmic backtesting, and automated risk management systems."
    },
    {
      id: "swen-262",
      code: "SWEN 262",
      title: "Engineering of Software Subsystems",
      category: "Software Engineering",
      term: "Fall 2025",
      status: "Taken",
      featured: true,
      technologies: [
        "Java", "Object-Oriented Design", "Gang of Four (GoF) Design Patterns", "Software Architecture", 
        "Refactoring", "Domain-Driven Design", "Anti-Patterns", "JUnit", "Polymorphism", "SOLID Principles"
      ],
      description: "Principles of contemporary software design at the subsystem level: Gang of Four design patterns, domain-driven design, architectural refactoring, anti-patterns, and rigorous unit testing."
    },
    {
      id: "math-241",
      code: "MATH 241",
      title: "Linear Algebra",
      category: "Mathematics & Statistics",
      term: "Summer 2025",
      status: "Taken",
      featured: true,
      technologies: [
        "Linear Algebra", "Vector Spaces", "Matrix Decompositions", "Eigenvalues & Eigenvectors", 
        "Singular Value Decomposition (SVD)", "Orthogonality", "Determinants", 
        "Systems of Linear Equations", "Mathematical Foundations of ML"
      ],
      description: "Vector spaces, linear transformations, matrices, determinants, eigenvalues and eigenvectors, orthogonality, and singular value decomposition (SVD) applied to machine learning."
    },
    {
      id: "swen-250",
      code: "SWEN 250",
      title: "Personal Software Engineering",
      category: "Software Engineering",
      term: "Spring 2025",
      status: "Taken",
      featured: true,
      technologies: [
        "C", "Linux", "Bash Scripting", "Pointer Arithmetic", "Dynamic Memory Allocation", 
        "GDB Debugger", "Valgrind", "Memory Leaks", "Shell Commands", "Git", "Software Construction Standards"
      ],
      description: "Individual technical engineering skills in Unix and Linux: advanced C programming, pointer arithmetic, dynamic memory management, shell scripting, and low-level debugging with GDB."
    },

    // --- Additional Technical Courses Revealed on "Show More" ---
    {
      id: "gcis-505",
      code: "GCIS 505",
      title: "AI for Programmers",
      category: "Artificial Intelligence & ML",
      term: "Spring 2026",
      status: "Taken",
      featured: false,
      technologies: [
        "Python", "Heuristic Search", "Knowledge Representation", "Automated Reasoning", 
        "Inference Engines", "Constraint Satisfaction", "Graph Algorithms", 
        "Breadth-First / Depth-First Search", "Algorithmic Problem Solving"
      ],
      description: "Advanced artificial intelligence concepts for software engineers: knowledge representation, automated reasoning, constraint satisfaction, and algorithmic problem solving."
    },
    {
      id: "iste-476",
      code: "ISTE 476",
      title: "Visual Analytics",
      category: "Data & Visualization",
      term: "Fall 2026",
      status: "In Progress",
      featured: false,
      technologies: [
        "Tableau", "Visual Data Mining", "Exploratory Data Analysis (EDA)", "Interactive Dashboards", 
        "Information Visualization", "Visual Perception", "Multidimensional Data", 
        "Data Storytelling", "Business Intelligence"
      ],
      description: "Interactive visual data exploration and visual analytics: human visual perception, interactive dashboard design, visual data mining, and multidimensional data representation."
    },
    {
      id: "math-301",
      code: "MATH 301",
      title: "Mathematics of Simulation and Randomness",
      category: "Mathematics & Statistics",
      term: "Fall 2026",
      status: "In Progress",
      featured: false,
      technologies: [
        "Monte Carlo Simulation", "Stochastic Modeling", "Pseudo-Random Number Generators", 
        "Probability Distributions", "Statistical Hypothesis Testing", "Markov Processes", "Simulation Verification"
      ],
      description: "Mathematical foundations of simulation: pseudo-random number generation, Monte Carlo methods, stochastic processes, and statistical validation of simulation models."
    },
    {
      id: "swen-543",
      code: "SWEN 543",
      title: "Engineering of Enterprise Software Systems",
      category: "Software Engineering",
      term: "Fall 2026",
      status: "In Progress",
      featured: false,
      technologies: [
        "Enterprise Architecture", "Microservices", "Scalable Distributed Systems", "Cloud Infrastructure", 
        "High Availability", "Database Transactions", "REST APIs", "Message Queues", "Fault Tolerance"
      ],
      description: "Architectural engineering of enterprise systems: distributed service layers, scalability, transaction isolation, fault tolerance, message queuing, and enterprise cloud integration."
    },
    {
      id: "math-251",
      code: "MATH 251",
      title: "Probability and Statistics I",
      category: "Mathematics & Statistics",
      term: "Spring 2026",
      status: "Taken",
      featured: false,
      technologies: [
        "Probability Theory", "Random Variables", "Probability Density Functions (PDF)", 
        "Expected Value", "Variance", "Joint Distributions", "Central Limit Theorem", 
        "Hypothesis Testing", "Confidence Intervals"
      ],
      description: "Probability models, random variables, joint distributions, mathematical expectation, sampling distributions, confidence intervals, and hypothesis testing."
    },
    {
      id: "swen-256",
      code: "SWEN 256",
      title: "Software Process and Project Management",
      category: "Software Engineering",
      term: "Spring 2026",
      status: "Taken",
      featured: false,
      technologies: [
        "Agile Methodologies", "Scrum Framework", "Jira Project Management", "Sprint Velocity", 
        "Risk Management", "Estimation Techniques", "Software Quality Assurance", "CI/CD Workflows"
      ],
      description: "Software engineering methodologies: Agile and Scrum practices, sprint velocity tracking, project risk assessment, quality assurance metrics, and team workflow governance."
    },
    {
      id: "swen-444",
      code: "SWEN 444",
      title: "Human Centered Requirements and Design",
      category: "Software Engineering",
      term: "Spring 2026",
      status: "Taken",
      featured: false,
      technologies: [
        "UI/UX Design", "Human-Computer Interaction (HCI)", "Wireframing", "Usability Testing", 
        "Interactive Prototyping", "Cognitive Walkthroughs", "User Task Modeling", "Universal Accessibility (a11y)"
      ],
      description: "Human-computer interaction models and techniques: user task analysis, usability evaluation, interactive UI prototyping, cognitive walkthroughs, and universal design principles."
    },
    {
      id: "swen-340",
      code: "SWEN 340",
      title: "Software Design for Computing Systems",
      category: "Software Engineering",
      term: "Fall 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "C", "Embedded Systems", "Computer Architecture", "Microcontrollers", "Firmware Development", 
        "Hardware-Software Interfaces", "Real-Time Operating Constraints", "Peripheral Bus I/O"
      ],
      description: "Software engineering at the hardware interface: computer architecture, microcontroller firmware development, real-time operating constraints, and hardware-software integration."
    },
    {
      id: "swen-261",
      code: "SWEN 261",
      title: "Introduction to Software Engineering",
      category: "Software Engineering",
      term: "Summer 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "Java", "Scrum Team Development", "Object-Oriented Programming", "Git Version Control", 
        "Code Reviews", "Software Lifecycle", "Unit Testing", "Requirements Engineering"
      ],
      description: "Introduction to disciplined software engineering: team-based semester project development, Scrum processes, object-oriented design principles, version control, and code reviews."
    },
    {
      id: "gcis-124",
      code: "GCIS 124",
      title: "Software Development and Problem Solving II",
      category: "Computer Science",
      term: "Spring 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "Java", "Python", "Object-Oriented Programming (OOP)", "Data Structures (Stacks, Queues, Trees, HashMaps)", 
        "Inheritance", "Polymorphism", "Recursion", "Algorithmic Analysis"
      ],
      description: "Object-oriented software development and algorithmic problem solving: inheritance, polymorphism, abstract data structures, recursive problem solving, and exception handling."
    },
    {
      id: "gcis-123",
      code: "GCIS 123",
      title: "Software Development and Problem Solving I",
      category: "Computer Science",
      term: "Fall 2024",
      status: "Taken",
      featured: false,
      technologies: [
        "Python", "Procedural Programming", "Algorithms", "Control Flow", "Functions", 
        "Data Types", "Unit Testing", "Debugging Techniques", "Computational Problem Solving"
      ],
      description: "Foundations of computer science and procedural software engineering in Python: algorithmic thinking, control flow, functions, testing methodologies, and debugging techniques."
    },
    {
      id: "math-182-181",
      code: "MATH 182 / 181",
      title: "Project-Based Calculus I & II",
      category: "Mathematics & Statistics",
      term: "Spring 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "Differential Calculus", "Integral Calculus", "Optimization Models", "Taylor Series", 
        "Numerical Approximations", "Mathematical Modeling", "Differential Equations"
      ],
      description: "Differential and integral calculus with applied projects: limits, derivative optimization, integration techniques, sequences, and Taylor series expansions."
    },
    {
      id: "stat-105",
      code: "STAT 105",
      title: "Introduction to Statistics",
      category: "Mathematics & Statistics",
      term: "Fall 2024",
      status: "Transferred",
      featured: false,
      technologies: [
        "Descriptive Statistics", "Normal Distribution", "Sampling Distributions", 
        "Linear Regression", "Correlation Analysis", "Hypothesis Testing", "Statistical Inference"
      ],
      description: "Statistical analysis foundations: descriptive metrics, probability distributions, sampling error, confidence intervals, and introductory bivariate linear regression."
    },
    {
      id: "cint-91",
      code: "CINT 91",
      title: "Computing Internship / Co-op",
      category: "Industry Experience",
      term: "Fall 2026",
      status: "In Progress",
      featured: false,
      technologies: [
        "Software Engineering", "AI Systems Engineering", "Production Deployments", 
        "Enterprise Agile", "Cross-Functional Teamwork", "Real-World Systems", "DoD Security Protocols"
      ],
      description: "Full-time computing industry internship and cooperative education: engineering real-world software, AI automation pipelines, and enterprise systems in production environments."
    },
    {
      id: "swen-99",
      code: "SWEN 99",
      title: "Software Engineering Co-op Preparation",
      category: "Software Engineering",
      term: "Fall 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "Technical Interview Preparation", "Resume Strategy", "Professional Ethics in Computing", 
        "Career Planning", "Engineering Communication"
      ],
      description: "Professional preparation for engineering internships: workplace ethics, technical interviews, resume optimization, and engineering career development."
    },
    {
      id: "swen-101",
      code: "SWEN 101",
      title: "Software Engineering Seminar",
      category: "Software Engineering",
      term: "Fall 2024",
      status: "Taken",
      featured: false,
      technologies: [
        "Software Engineering Discipline", "Computing Ethics", "Professional Standards", 
        "Software Lifecycle Overview"
      ],
      description: "Overview of the software engineering discipline, professional career paths, societal impacts of software, and computing ethics."
    },

    // --- American Sign Language & Humanities Courses ---
    {
      id: "mlas-301",
      code: "MLAS 301",
      title: "American Sign Language III",
      category: "Sign Language & Humanities",
      term: "Fall 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "American Sign Language (ASL)", "Spatial Grammar", "Classifier Predicates", 
        "Non-Manual Signals", "Storytelling Syntax", "Deaf Culture", "Visual-Gestural Fluency"
      ],
      description: "Advanced conversational American Sign Language: spatial syntax, classifier predicates, storytelling conventions, and contemporary Deaf cultural perspectives."
    },
    {
      id: "mlas-202",
      code: "MLAS 202",
      title: "American Sign Language II",
      category: "Sign Language & Humanities",
      term: "Spring 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "American Sign Language (ASL)", "Conversational Fluency", "Temporal Markers", 
        "Receptive Signing", "Expressive Signing", "Deaf Community Norms"
      ],
      description: "Intermediate ASL fluency: temporal markers, non-manual cues, expressive and receptive signing speed, and Deaf cultural norms."
    },
    {
      id: "mlas-201",
      code: "MLAS 201",
      title: "Beginning American Sign Language I",
      category: "Sign Language & Humanities",
      term: "Fall 2024",
      status: "Taken",
      featured: false,
      technologies: [
        "American Sign Language (ASL)", "Fingerspelling", "Foundational Vocabulary", 
        "Basic Visual Grammar", "Deaf Cultural Awareness"
      ],
      description: "Introductory ASL vocabulary, manual fingerspelling, basic grammatical structures, and visual-gestural communication principles."
    },
    {
      id: "comm-253",
      code: "COMM 253",
      title: "Communication & Public Speaking",
      category: "Liberal Arts & Social Sciences",
      term: "Fall 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "Technical Presentations", "Public Speaking", "Audience Analysis", 
        "Persuasive Rhetoric", "Stakeholder Alignment", "Verbal Communication"
      ],
      description: "Principles and practice of effective oral and technical presentations: audience analysis, persuasive rhetoric, visual aids, and stakeholder alignment."
    },
    {
      id: "visl-140",
      code: "VISL 140",
      title: "Visual Culture",
      category: "Liberal Arts & Social Sciences",
      term: "Fall 2025",
      status: "Taken",
      featured: false,
      technologies: [
        "Visual Analysis", "Semiotics", "Design Aesthetics", "Image Interpretation", 
        "Critical Thinking", "Media Literacy"
      ],
      description: "Critical analysis of visual culture: interpretation of contemporary imagery, media semiotics, aesthetic theory, and visual communication."
    },
    {
      id: "econ-101",
      code: "ECON 101",
      title: "Principles of Microeconomics",
      category: "Liberal Arts & Social Sciences",
      term: "Fall 2024",
      status: "Taken",
      featured: false,
      technologies: [
        "Microeconomics", "Supply & Demand Dynamics", "Price Elasticity", "Game Theory", 
        "Competitive Market Structures", "Consumer Choice Theory"
      ],
      description: "Microeconomic decision-making: supply and demand elasticity, consumer utility, production costs, market structures, and game theory."
    },
    {
      id: "envs-101",
      code: "ENVS 101",
      title: "Environmental Studies",
      category: "Liberal Arts & Social Sciences",
      term: "Fall 2024",
      status: "Transferred",
      featured: false,
      technologies: [
        "Environmental Science", "Ecological Systems", "Sustainability Modeling", 
        "Natural Resource Economics", "Environmental Policy"
      ],
      description: "Interdisciplinary study of ecological systems, global environmental challenges, resource economics, and sustainability policies."
    },
    {
      id: "pols-110",
      code: "POLS 110",
      title: "American Politics",
      category: "Liberal Arts & Social Sciences",
      term: "Fall 2024",
      status: "Transferred",
      featured: false,
      technologies: [
        "Institutional Analysis", "Constitutional Law", "Public Policy Analysis", 
        "Legislative Processes", "Political Science"
      ],
      description: "Constitutional foundations, institutional governance, electoral processes, political behavior, and public policy formulation in the United States."
    }
  ],

  /**
   * Education Information
   */
  education: [
    {
      institution: "Rochester Institute of Technology (RIT)",
      degree: "BS in Artificial Intelligence",
      note: "Expected to be the first graduate of RIT's Artificial Intelligence program",
      location: "Rochester, NY",
      graduation: "Anticipated May 2028",
      minors: "Software Engineering, Applied Statistics, and Math",
      immersion: "American Sign Language (ASL)",
      honors: ["RIT Presidential Scholar", "Dean's List"],
      gpa: "Dean's List Honors"
    },
    {
      institution: "North Andover High School",
      degree: "High School Diploma",
      location: "North Andover, MA",
      graduation: "September 2020 - May 2024",
      honors: ["1530 SAT Score", "High Honors"]
    }
  ],

  /**
   * Extracurriculars, Leadership & Personal Interests
   */
  extracurriculars: {
    leadership: [
      {
        role: "Captain",
        organization: "RIT Men's Club Volleyball",
        period: "2024 - Present",
        highlight: "ECVA All-Star / 42% Instagram Reach Growth / 7 Tournaments Hosted",
        description: "Elected team captain; led squad to tournament success across the Eastern Collegiate Volleyball Association (ECVA). Grew social media reach by 42%, authored 12 custom digital marketing assets, and organized 7 intercollegiate and campus events."
      }
    ],
    memberships: [
      { name: "Society of Software Engineers (SSE)", institution: "RIT" },
      { name: "Society of Asian Scientists and Engineers (SASE)", institution: "RIT" },
      { name: "Computing Organization for Multicultural Students (COMS)", institution: "RIT" },
      { name: "RIT AI Club", institution: "RIT" }
    ],
    languages: [
      { language: "English", fluency: "Native / Bilingual" },
      { language: "American Sign Language (ASL)", fluency: "Conversational / Immersion" },
      { language: "Spanish", fluency: "Elementary" },
      { language: "Gujarati", fluency: "Elementary" }
    ],
    personalInterests: [
      { name: "Volleyball", icon: "activity", desc: "Competitive collegiate club player and captain" },
      { name: "Fashion", icon: "tag", desc: "Streetwear, design, and styling" },
      { name: "Music", icon: "music", desc: "Hip-hop, R&B, and playlist curation" },
      { name: "AI & ML", icon: "cpu", desc: "Autonomous agents, neural architectures, quant trading" },
      { name: "NFL & NBA", icon: "trophy", desc: "Statistical modeling and game theory" },
      { name: "Anime", icon: "film", desc: "Shonen, sci-fi, and animation aesthetics" }
    ]
  }
};
