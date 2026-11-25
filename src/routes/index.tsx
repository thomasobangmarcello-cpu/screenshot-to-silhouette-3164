import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  ChevronDown,
  CircleCheck,
  Cloud,
  CodeXml,
  Copy,
  Equal,
  FileBadge,
  Handshake,
  HeartPulse,
  LockKeyhole,
  MapPin,
  Network,
  Plus,
  Printer,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import mentorAsset from "@/assets/referral-mentor.asset.json";
import {
  availableSkills,
  backgrounds,
  canRefer,
  getProfile,
  matchPartner,
  milestones,
  partners,
  readiness,
  tracks,
  type Persona,
  type Profile,
} from "@/lib/referral-demo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReferralBridge — Micro-Fellowships & Warm Referrals" },
      {
        name: "description",
        content:
          "Bridge the network gap with industry mentors, practical micro-fellowships, and verified warm referrals. An interactive civic-tech prototype aligned with SDGs 8, 10, and 17.",
      },
      { property: "og:title", content: "ReferralBridge — Skills Meet Opportunity" },
      {
        property: "og:description",
        content:
          "Explore mentor matching, three-week micro-fellowships, and a verified referral pass in the ReferralBridge demo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [persona, setPersona] = useState<Persona>("junior");
  const [profile, setProfile] = useState<Profile>(() => getProfile("junior"));
  const [match, setMatch] = useState(() => matchPartner(getProfile("junior")));
  const [completed, setCompleted] = useState([true, true, false]);
  const [introRequested, setIntroRequested] = useState(false);
  const [referred, setReferred] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [extraSkills, setExtraSkills] = useState<string[]>([]);
  const [passOpen, setPassOpen] = useState(false);
  const [matchedName, setMatchedName] = useState("Brian Kamau");
  const ready = canRefer(completed);
  const percent = readiness(completed);
  const { partner, score } = match;
  const verificationId = `RB-2026-${persona === "junior" ? "PLP-409" : "RET-712"}`;
  const skillOptions = [...availableSkills, ...extraSkills];

  function switchPersona(next: Persona) {
    const nextProfile = getProfile(next);
    setPersona(next);
    setProfile(nextProfile);
    setMatchedName(nextProfile.name);
    setMatch(matchPartner(nextProfile));
    setCompleted([true, true, false]);
    setIntroRequested(false);
    setReferred([]);
    setCustomSkill("");
    setExtraSkills([]);
    setPassOpen(false);
    toast.dismiss();
  }

  function updateProfile(key: "name" | "background" | "track", value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function toggleSkill(skill: string) {
    setProfile((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill],
    }));
  }

  function addSkill() {
    const value = customSkill.trim();
    if (!value) return;
    const existing = skillOptions.find((skill) => skill.toLowerCase() === value.toLowerCase());
    const skill = existing ?? value;
    if (!existing) setExtraSkills((current) => [...current, skill]);
    setProfile((current) => ({
      ...current,
      skills: current.skills.includes(skill) ? current.skills : [...current.skills, skill],
    }));
    setCustomSkill("");
  }

  function runMatch() {
    if (!profile.name.trim()) {
      toast.error("Enter a candidate name to find your match.");
      return;
    }
    if (!profile.skills.length) {
      toast.error("Select at least one practical skill to find your match.");
      return;
    }
    const nextMatch = matchPartner(profile);
    if (partner.id !== nextMatch.partner.id || matchedName !== profile.name.trim()) {
      setCompleted([true, true, false]);
      setIntroRequested(false);
      setReferred([]);
    }
    setMatch(nextMatch);
    setMatchedName(profile.name.trim());
    toast.success(`Matched with ${nextMatch.partner.mentor} at ${nextMatch.partner.company}`, {
      description: `${nextMatch.score}% skills-to-sprint fit · ${nextMatch.partner.sprint}`,
    });
  }

  function toggleMilestone(index: number) {
    const next = completed.map((value, itemIndex) => (itemIndex === index ? !value : value));
    setCompleted(next);
    if (canRefer(next))
      toast.success("Verified Warm Referral Unlocked!", {
        description: "Your mentor-endorsed referral pass is ready.",
      });
  }

  async function copyReferral() {
    const url = `${window.location.origin}/#demo-referral=${verificationId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Referral link copied to clipboard!", {
        description: "Demo link — public verification is not available in this prototype.",
      });
    } catch {
      toast.error("Clipboard access is unavailable. Please try again in a secure browser.");
    }
  }

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand">
            <div className="brand-mark">
              <Network size={24} strokeWidth={2} />
            </div>
            <div>
              <div className="brand-name">
                Referral<span className="text-primary">Bridge</span>
              </div>
              <div className="brand-caption">
                SDGs 8, 10 & 17 <span className="mx-1">|</span> Micro-Fellowship & Referral Engine
              </div>
            </div>
          </div>
          <div className="personas" aria-label="Demo personas">
            <Button
              variant={persona === "junior" ? "persona" : "ghost"}
              size="sm"
              aria-pressed={persona === "junior"}
              onClick={() => switchPersona("junior")}
            >
              <CodeXml />
              Demo: PLP Junior Dev
            </Button>
            <Button
              variant={persona === "returner" ? "persona" : "ghost"}
              size="sm"
              aria-pressed={persona === "returner"}
              onClick={() => switchPersona("returner")}
            >
              <UserRound />
              Demo: Career Returner
            </Button>
            <span className="persona-separator" />
            <Button variant="ghost" size="sm" onClick={() => switchPersona(persona)}>
              <RotateCcw />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="shell page">
        <section className="intro">
          <div>
            <div className="eyebrow">
              <span className="live-dot" />
              Skills meet opportunity
            </div>
            <h1>
              Turn practical skills into verified
              <br className="hidden lg:block" /> local experience & <span>warm referrals.</span>
            </h1>
            <p>
              A little experience. The right connection. Micro-fellowships with industry mentors
              <br className="hidden lg:block" /> bridge the network gap — and open doors to your
              next opportunity.
            </p>
          </div>
          <div
            className="sdg-section"
            aria-label="Aligned with UN Sustainable Development Goals 8, 10 and 17"
          >
            <div className="sdg-caption">Built for impact. Aligned with the UN SDGs.</div>
            <div className="sdg-list">
              <div className="sdg-tile sdg-work">
                <strong>8</strong>
                <span>
                  Decent work &<br />
                  economic growth
                </span>
                <TrendingUp />
              </div>
              <div className="sdg-tile sdg-equality">
                <strong>10</strong>
                <span>
                  Reduced
                  <br />
                  inequalities
                </span>
                <Equal />
              </div>
              <div className="sdg-tile sdg-partner">
                <strong>17</strong>
                <span>
                  Partnerships
                  <br />
                  for the goals
                </span>
                <Network />
              </div>
            </div>
          </div>
        </section>

        <div className="workspace">
          <aside>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2 className="section-title">
                    <span className="step-number">1</span>Your candidate profile
                  </h2>
                  <p className="small-caption">Your skills are the starting point.</p>
                </div>
                <UserRound size={18} className="text-muted-foreground" />
              </div>
              <form
                className="profile-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  runMatch();
                }}
              >
                <div className="field">
                  <label className="field-label" htmlFor="candidate-name">
                    Candidate name
                  </label>
                  <input
                    id="candidate-name"
                    className="field-control"
                    value={profile.name}
                    onChange={(event) => updateProfile("name", event.target.value)}
                    maxLength={80}
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="background">
                    Background / cohort track
                  </label>
                  <div className="select-wrap">
                    <select
                      id="background"
                      className="field-control"
                      value={profile.background}
                      onChange={(event) => updateProfile("background", event.target.value)}
                    >
                      {backgrounds.map((background) => (
                        <option key={background}>{background}</option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="role-track">
                    Primary tech / role track
                  </label>
                  <div className="select-wrap">
                    <select
                      id="role-track"
                      className="field-control"
                      value={profile.track}
                      onChange={(event) => updateProfile("track", event.target.value)}
                    >
                      {tracks.map((track) => (
                        <option key={track}>{track}</option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                </div>
                <div className="field skills-field">
                  <div className="flex items-center justify-between">
                    <label className="field-label">Verified practical skills</label>
                    <span className="text-[9px] text-muted-foreground mb-2">
                      {profile.skills.length} selected
                    </span>
                  </div>
                  <div className="skill-list" aria-label="Verified practical skills">
                    {skillOptions.map((skill) => (
                      <Button
                        type="button"
                        variant={profile.skills.includes(skill) ? "selected" : "skill"}
                        aria-pressed={profile.skills.includes(skill)}
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                      >
                        {profile.skills.includes(skill) && <Check />}
                        {skill}
                      </Button>
                    ))}
                  </div>
                  <div className="custom-skill">
                    <input
                      className="field-control"
                      aria-label="Custom skill"
                      placeholder="Add another skill…"
                      value={customSkill}
                      maxLength={30}
                      onChange={(event) => setCustomSkill(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Add skill"
                      aria-label="Add skill"
                      onClick={addSkill}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="match-button">
                  <Sparkles />
                  Match Mentor & Micro-Fellowship
                  <ArrowRight />
                </Button>
                <p className="profile-note">
                  <ShieldCheck />
                  Potential over pedigree. Always.
                </p>
              </form>
            </section>
            <div className="network-note">
              <Handshake />
              <div>
                <h3>A network shouldn’t be a prerequisite.</h3>
                <p>
                  Real work, trusted mentors, and an introduction
                  <br />
                  that speaks louder than a line on your CV.
                </p>
              </div>
            </div>
          </aside>

          <div className="dashboard">
            <section className="panel" aria-label="Matched industry mentor">
              <div className="panel-head">
                <h2 className="section-title">
                  <span className="step-number">2</span>Your mentor & hiring partner
                </h2>
                <span className="badge badge-blue">
                  <Sparkles />
                  {score}% Skills-to-Sprint Fit
                </span>
              </div>
              <div className="mentor-body">
                <div>
                  <div className="mentor-person">
                    {partner.id === "savannah" ? (
                      <img
                        className="mentor-photo"
                        src={mentorAsset.url}
                        alt="Grace Wanjiku, sample industry mentor"
                      />
                    ) : (
                      <div className="mentor-avatar">{partner.initials}</div>
                    )}
                    <div>
                      <h3 className="mentor-name">{partner.mentor}</h3>
                      <p className="mentor-role">{partner.mentorTitle}</p>
                      <p className="mentor-company">
                        @ {partner.company} <BadgeCheck size={12} className="inline text-primary" />
                      </p>
                    </div>
                  </div>
                  <div className="mentor-verified">
                    <ShieldCheck />
                    Verified industry mentor <span className="text-border mx-1">|</span>
                    <MapPin />
                    Kenya
                  </div>
                </div>
                <div className="partner-brief">
                  <div className="overline">Your micro-fellowship sprint</div>
                  <h3>{partner.sprint}</h3>
                  <p>{partner.need}</p>
                </div>
              </div>
              <div className="mentor-bottom">
                <span className={`badge ${introRequested ? "badge-green" : "badge-amber"}`}>
                  {introRequested ? <CircleCheck /> : <BriefcaseBusiness />}
                  {introRequested ? "Fellowship Active" : "3-week sprint · Mentor-led"}
                </span>
                <Button
                  variant={introRequested ? "selected" : "outline"}
                  aria-pressed={introRequested}
                  onClick={() => {
                    setIntroRequested((value) => !value);
                    toast.success(
                      introRequested
                        ? "Warm intro request withdrawn"
                        : `Warm intro requested with ${partner.mentor}`,
                      {
                        description: introRequested
                          ? "Your sample fellowship is ready when you are."
                          : "Fellowship Active — your mentor is ready to connect.",
                      },
                    );
                  }}
                >
                  {introRequested ? <Check /> : <Handshake />}
                  {introRequested ? "Intro Requested" : "Request Warm Intro"}
                  {!introRequested && <ArrowUpRight />}
                </Button>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head tracker-head">
                <div>
                  <h2 className="section-title">
                    <span className="step-number">3</span>Build experience. Earn your referral.
                  </h2>
                  <p className="small-caption">
                    A 3-week micro-fellowship. Three milestones. One open door.
                  </p>
                </div>
                <span className={`badge ${ready ? "badge-green" : "badge-amber"}`}>
                  {ready ? <CircleCheck /> : <span className="h-1 w-1 rounded-full bg-warning" />}
                  {ready ? "Completed" : "In progress"}
                </span>
              </div>
              <div className="tracker-content">
                <div className="readiness-top">
                  <span className="readiness-label">Warm Referral Readiness</span>
                  <div className="readiness-score" aria-live="polite">
                    {percent}
                    <span>%</span>
                  </div>
                </div>
                <progress
                  className="readiness-progress"
                  value={percent}
                  max={100}
                  aria-label="Warm Referral Readiness"
                />
                <div className="readiness-detail">
                  <span>{completed.filter(Boolean).length} of 3 milestones completed</span>
                  <span>Mentor-verified. Partner-recognized.</span>
                </div>
                <div className="milestone-list">
                  {milestones.map((milestone, index) => (
                    <label className="milestone" key={milestone.title}>
                      <input
                        type="checkbox"
                        checked={completed[index] ?? false}
                        onChange={() => toggleMilestone(index)}
                        aria-label={`Week ${index + 1}: ${milestone.title}`}
                      />
                      <span className="milestone-box">
                        {completed[index] ? (
                          <Check strokeWidth={3} />
                        ) : (
                          <span className="text-[9px]">{index + 1}</span>
                        )}
                      </span>
                      <div className="milestone-text">
                        <div className="milestone-title">
                          <span className="week">Week {index + 1}</span>
                          {milestone.title}
                        </div>
                        <p className="milestone-description">{milestone.detail}</p>
                      </div>
                      <span className={`milestone-status ${completed[index] ? "" : "pending"}`}>
                        {completed[index] ? "Completed" : "Up next"}
                      </span>
                    </label>
                  ))}
                </div>
                {ready && (
                  <div className="unlock-banner" role="status">
                    <Award />
                    <div>
                      <strong>Verified Warm Referral Unlocked!</strong>
                      <p>You’ve earned the experience. Now let’s open some doors.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="tracker-footer">
                <p>
                  {ready ? <ShieldCheck /> : <LockKeyhole />}
                  {ready
                    ? "Your mentor-endorsed pass is ready."
                    : "Complete all milestones to unlock your verified referral."}
                </p>
                <Button variant="outline" onClick={() => setPassOpen(true)}>
                  <FileBadge />
                  View Verified Referral Pass
                  <ArrowUpRight />
                </Button>
              </div>
            </section>
          </div>
        </div>

        <section className="opportunities">
          <div className="opportunities-heading">
            <div>
              <h2 className="section-title">
                <BriefcaseBusiness />
                Your next opportunity starts here.
              </h2>
              <p className="small-caption">
                Local hiring partners who see your potential — not just your past.
              </p>
            </div>
            <span className="opportunity-count">
              <Users />3 hiring partners
            </span>
          </div>
          <div className="opportunity-grid">
            {partners.map((job) => {
              const applied = referred.includes(job.id);
              return (
                <article
                  className={`panel opportunity-card ${job.id === partner.id ? "best-fit" : ""}`}
                  key={job.id}
                >
                  <div className="opportunity-brand-row">
                    <div className={`company-mark ${job.id}`}>
                      {job.id === "savannah" ? (
                        <Sprout />
                      ) : job.id === "afrihealth" ? (
                        <HeartPulse />
                      ) : (
                        <Cloud />
                      )}
                    </div>
                    <div>
                      <div className="company-name">{job.company}</div>
                      <div className="company-category">{job.category}</div>
                    </div>
                    {job.id === partner.id && (
                      <span className="badge badge-blue best-fit-label">
                        <Sparkles />
                        Best fit
                      </span>
                    )}
                  </div>
                  <h3>{job.role}</h3>
                  <div className="job-meta">
                    <MapPin />
                    {job.location}
                    <span className="dot">·</span>Early career
                  </div>
                  <div className="job-skills">
                    {job.skills.slice(0, 4).map((skill) => (
                      <span
                        className={`job-skill ${profile.skills.includes(skill) ? "matched" : ""}`}
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {job.localCvWaived && (
                    <div className="cv-badge">
                      <ShieldCheck />
                      <span>No prior local CV required — ReferralBridge accepted</span>
                    </div>
                  )}
                  <Button
                    variant={applied ? "success" : "outline"}
                    className="opportunity-action"
                    disabled={!ready || applied}
                    onClick={() => {
                      if (!canRefer(completed)) return;
                      setReferred((current) => [...current, job.id]);
                      toast.success(`Referred & Shortlisted at ${job.company}!`, {
                        description: `${matchedName}’s verified referral has been submitted for ${job.role}. Demo application only.`,
                      });
                    }}
                  >
                    {applied ? <CheckCheck /> : ready ? <ArrowUpRight /> : <LockKeyhole />}
                    {applied ? "Referred & Shortlisted" : "Apply with Verified Referral"}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
        <footer className="footer">
          <span>
            <Network />
            ReferralBridge <span className="mx-1">·</span>Bridging the gap between skills and
            opportunity.
          </span>
          <span>
            <ShieldCheck />
            Frontend demo · Sample profiles & simulated referrals
          </span>
        </footer>
      </main>

      <Dialog open={passOpen} onOpenChange={setPassOpen}>
        <DialogContent className="pass-modal">
          <div className="pass-top">
            <div className="brand-mark">
              <Network size={23} />
            </div>
            <div>
              <div className="brand-name">
                Referral<span className="text-primary">Bridge</span>
              </div>
              <div className="brand-caption">Practical skills. Trusted connections.</div>
            </div>
          </div>
          <div className="pass-heading">
            <Award />
            <DialogTitle>Verified Warm Referral Pass</DialogTitle>
            <DialogDescription>
              {ready
                ? "Mentor-endorsed local experience. A stronger next step."
                : "Preview pass · Complete your micro-fellowship to earn verification."}
            </DialogDescription>
          </div>
          <div className="pass-recipient">
            <div className="overline">Awarded to</div>
            <h3>{matchedName}</h3>
            <p>{profile.background}</p>
            <span className={`badge mt-3 ${ready ? "badge-green" : "badge-amber"}`}>
              {ready ? <ShieldCheck /> : <LockKeyhole />}
              {ready ? "Verified & referral-ready" : "Pending final milestone"} · {percent}%
              readiness
            </span>
          </div>
          <div className="pass-details">
            <div>
              <div className="overline">Endorsing industry mentor</div>
              <p>
                <strong>{partner.mentor}</strong>
                <br />
                {partner.mentorTitle}
              </p>
            </div>
            <div>
              <div className="overline">Partner organization</div>
              <p>
                <strong>{partner.company}</strong>
                <br />
                {partner.location}
              </p>
            </div>
            <div className="pass-summary">
              <div className="overline">Primary role track</div>
              <p>{profile.track}</p>
            </div>
            <div className="pass-summary">
              <div className="overline">
                Micro-sprint summary · {completed.filter(Boolean).length}/3 complete
              </div>
              <p>
                {partner.sprint}
                <br />
                {milestones.map((milestone, index) => (
                  <span className="block" key={milestone.title}>
                    {completed[index] ? "✓" : "○"} Week {index + 1}: {milestone.title}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="pass-verification">
            <div>
              <div className="overline mb-2">Demo verification ID</div>
              <strong>{verificationId}</strong>
              <p>
                Three weeks of practical work. One trusted endorsement.
                <br />
                QR placeholder · No public verification in this prototype.
              </p>
            </div>
            <QrCode
              className="qr-placeholder"
              strokeWidth={1.4}
              aria-label="Demo QR code placeholder"
            />
          </div>
          <div className="pass-actions">
            <Button onClick={() => window.print()}>
              <Printer />
              Print / Save PDF
            </Button>
            <Button variant="outline" onClick={copyReferral}>
              <Copy />
              Copy Referral Link
            </Button>
          </div>
          <p className="demo-disclaimer">
            Demonstration certificate. Not a real professional endorsement.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
