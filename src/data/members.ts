import { memberSeed } from "./memberSeed.ts";
import type { MemberDetails } from "./waiver.ts";

export type Role =
  | "Licensed"
  | "Instructor"
  | "Student"
  | "Tandem instructor"
  | "Tandem student"
  | "Tandem camera"
  | "SIL-Coach"
  | "Pilot";
export type MembershipType =
  "Default" | "Honorary" | "Super honorary" | "Non-jumping" | "Tandem";
export type Member = {
  id: string;
  name: string;
  city: string;
  email: string;
  membershipStartDate: string;
  details?: MemberDetails;
  roles: Role[];
  weight: number;
  membershipType: MembershipType;
  fictional: boolean;
};
export const todayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
// Clone the committed snapshot so local edits never mutate the baseline.
export const members: Member[] = structuredClone(memberSeed);
export const membersById = new Map(
  members.map((member) => [member.id, member]),
);
export const skydivers = members.filter((member) =>
  member.roles.some((role) => role !== "Pilot"),
);
export const pilots = members.filter((member) =>
  member.roles.includes("Pilot"),
);
// Group each person once while displaying all their qualifications as tags.
export const primaryRole = (member: Member): Role => {
  return (
    [
      "Tandem instructor",
      "Instructor",
      "SIL-Coach",
      "Tandem student",
      "Student",
      "Tandem camera",
      "Licensed",
      "Pilot",
    ] as Role[]
  ).find((role) => member.roles.includes(role))!;
};
