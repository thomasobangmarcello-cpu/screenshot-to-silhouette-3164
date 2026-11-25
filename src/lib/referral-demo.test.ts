import { describe, expect, it } from "vitest";
import { canRefer, getProfile, matchPartner, readiness } from "./referral-demo";

describe("ReferralBridge demo rules", () => {
  it("starts the PLP junior with Brian Kamau and a 94% SavannahPay fit", () => {
    const profile = getProfile("junior");
    expect(profile.name).toBe("Brian Kamau");
    expect(matchPartner(profile).partner.company).toBe("SavannahPay");
    expect(matchPartner(profile).score).toBe(94);
  });
  it("shows 67% readiness with two of three milestones complete", () => {
    expect(readiness([true, true, false])).toBe(67);
  });
  it("unlocks referrals only when all three milestones are complete", () => {
    expect(canRefer([true, true, false])).toBe(false);
    expect(canRefer([true, true, true])).toBe(true);
    expect(readiness([true, true, true])).toBe(100);
  });
  it("matches the career returner with the backend fellowship", () => {
    expect(getProfile("returner").background).toBe("Career Returner (3-Yr Caregiving Break)");
    expect(matchPartner(getProfile("returner")).partner.company).toBe("AfriHealth Tech");
  });
  it("changes matches when the role and verified skills change", () => {
    const profile = {
      ...getProfile("junior"),
      track: "Mobile App Development (Flutter)",
      skills: ["Flutter", "SQL", "Unit Testing"],
    };
    expect(matchPartner(profile).partner.company).toBe("KaziCloud");
  });
});
