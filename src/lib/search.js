export const QUICK_QUERIES = [
  'Python', 'Rust', 'PyTorch', 'React', 'Docker', 'SQL', 'OpenAI', 'Computer Vision', 'TypeScript', 'Tableau'
];

const EMPTY = {
  projects: [],
  experiences: [],
  courses: [],
  total: 0
};

export function searchPortfolio(data, rawQuery) {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return EMPTY;

  const includes = (value) => value.toLowerCase().includes(q);

  const projects = data.projects.filter((p) =>
    p.technologies.some(includes) || includes(p.title) || includes(p.description)
  );

  const experiences = data.experiences.filter((e) =>
    e.technologies.some(includes) || includes(e.company) || e.bullets.some(includes)
  );

  const courses = data.coursework.filter((c) =>
    c.technologies.some(includes) || includes(c.title) || includes(c.code)
  );

  return {
    projects,
    experiences,
    courses,
    total: projects.length + experiences.length + courses.length
  };
}

export function flattenResults(results) {
  return [
    ...results.experiences.map((e) => ({
      id: e.id,
      group: 'Experience',
      title: e.company,
      detail: e.roles[0].title
    })),
    ...results.projects.map((p) => ({
      id: p.id,
      group: 'Projects',
      title: p.title,
      detail: p.subtitle
    })),
    ...results.courses.map((c) => ({
      id: c.id,
      group: 'Coursework',
      title: `${c.code} ${c.title}`,
      detail: c.term
    }))
  ];
}
