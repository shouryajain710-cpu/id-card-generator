export const ROLE_TITLES = {
  "Web Developer": {
    title: "THE CODE SHAPER",
  },

  "AI / ML": {
    title: "THE NEURAL ALCHEMIST",
  },

  "Data Analytics": {
    title: "THE DATA NAVIGATOR",
  },

  "UI / UX Designer": {
    title: "THE PIXEL ARCHITECT",
  },

  Cybersecurity: {
    title: "THE DIGITAL SENTINEL",
  },
};

export const DEFAULT_ROLE_TITLE = {
  title: "THE BUILDER",
};

export function getRoleTitle(role = "") {
  const normalizedRole = role.trim();

  if (!normalizedRole) {
    return null;
  }

  return ROLE_TITLES[normalizedRole] || DEFAULT_ROLE_TITLE;
}