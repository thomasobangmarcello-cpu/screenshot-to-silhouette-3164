export const backgrounds = [
  "PLP Software Engineering Graduate",
  "Career Returner (3-Yr Caregiving Break)",
  "Self-Taught / Career Switcher",
  "Relocated Talent (New to Local Market)",
] as const;

export const tracks = [
  "Full-Stack Web Development (React / Node)",
  "Python & Backend APIs",
  "Mobile App Development (Flutter)",
  "Data & Cloud Operations",
] as const;

export const availableSkills = [
  "React",
  "TypeScript",
  "Python",
  "REST APIs",
  "Git Workflow",
  "UI Prototyping",
  "SQL",
  "Unit Testing",
];

export type Persona = "junior" | "returner";
export type Profile = { name: string; background: string; track: string; skills: string[] };
export type Partner = {
  id: string;
  company: string;
  category: string;
  role: string;
  mentor: string;
  mentorTitle: string;
  initials: string;
  skills: string[];
  tracks: readonly string[];
  need: string;
  sprint: string;
  location: string;
  localCvWaived: boolean;
};

export const partners: Partner[] = [
  {
    id: "savannah",
    company: "SavannahPay",
    category: "FINTECH",
    role: "Junior Frontend Engineer",
    mentor: "Grace Wanjiku",
    mentorTitle: "Senior Software Engineer",
    initials: "GW",
    skills: ["React", "TypeScript", "REST APIs", "Git Workflow", "UI Prototyping"],
    tracks: [tracks[0]],
    need: "Build accessible payment experiences for small businesses across East Africa.",
    sprint: "Merchant dashboard & payment insights",
    location: "Nairobi · Hybrid",
    localCvWaived: true,
  },
  {
    id: "afrihealth",
    company: "AfriHealth Tech",
    category: "HEALTHTECH",
    role: "Associate Backend Developer",
    mentor: "Daniel Otieno",
    mentorTitle: "Lead Backend Engineer",
    initials: "DO",
    skills: ["Python", "REST APIs", "SQL", "Unit Testing", "Git Workflow"],
    tracks: [tracks[1]],
    need: "Connect community clinics with reliable patient records and secure health APIs.",
    sprint: "Clinic scheduling API & integration tests",
    location: "Nairobi · Remote",
    localCvWaived: true,
  },
  {
    id: "kazicloud",
    company: "KaziCloud",
    category: "CLOUD & PRODUCT",
    role: "Junior Full-Stack Fellow",
    mentor: "Amina Hassan",
    mentorTitle: "Senior Platform Engineer",
    initials: "AH",
    skills: ["React", "Python", "SQL", "Unit Testing", "Flutter"],
    tracks: [tracks[2], tracks[3]],
    need: "Help local teams manage their work with mobile-first tools and cloud reporting.",
    sprint: "Team workspace & cloud reporting",
    location: "Mombasa · Remote",
    localCvWaived: true,
  },
];

export function getProfile(persona: Persona): Profile {
  return persona === "junior"
    ? {
        name: "Brian Kamau",
        background: backgrounds[0],
        track: tracks[0],
        skills: ["React", "TypeScript", "REST APIs", "Git Workflow", "UI Prototyping"],
      }
    : {
        name: "Wanjiru Mwangi",
        background: backgrounds[1],
        track: tracks[1],
        skills: ["Python", "REST APIs", "SQL", "Unit Testing", "Git Workflow"],
      };
}

export function matchPartner(profile: Profile): { partner: Partner; score: number } {
  const ranked = partners
    .map((partner) => {
      const overlaps = partner.skills.filter((skill) =>
        profile.skills.some((selected) => selected.toLowerCase() === skill.toLowerCase()),
      ).length;
      const aligned = partner.tracks.includes(profile.track);
      return {
        partner,
        rank: overlaps * 6 + (aligned ? 12 : 0),
        score: Math.min(98, 52 + overlaps * 6 + (aligned ? 12 : 0)),
      };
    })
    .sort((a, b) => b.rank - a.rank);
  const best = ranked[0];
  if (!best) throw new Error("No sample hiring partners available");
  return { partner: best.partner, score: best.score };
}

export function readiness(milestones: boolean[]) {
  return milestones.length
    ? Math.round((milestones.filter(Boolean).length / milestones.length) * 100)
    : 0;
}

export function canRefer(milestones: boolean[]) {
  return milestones.length === 3 && milestones.every(Boolean);
}

export const milestones = [
  {
    title: "Local codebase onboarding & PR review",
    detail: "Get familiar with the team. Ship your first reviewed pull request.",
  },
  {
    title: "Partner feature sprint & mentor code audit",
    detail: "Build a real feature, with feedback from your industry mentor.",
  },
  {
    title: "Live demo & soft-skill collaboration sign-off",
    detail: "Present your work and receive your mentor’s endorsement.",
  },
];
