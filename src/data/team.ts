/**
 * The people shown on the Home and About pages.
 *
 * Photos live in public/team. To show a name and role under a photo, just add them:
 *   { photo: `${import.meta.env.BASE_URL}team/member-01.jpg`, name: "Full Name", role: "Founder" }
 * Entries without a name show the photo only.
 */
export type TeamMember = {
  photo: string;
  name?: string;
  role?: string;
};

export const team: TeamMember[] = [
  { photo: `${import.meta.env.BASE_URL}team/member-01.jpg` },
  { photo: `${import.meta.env.BASE_URL}team/member-02.jpg` },
  { photo: `${import.meta.env.BASE_URL}team/member-03.jpg` },
  { photo: `${import.meta.env.BASE_URL}team/member-04.jpg` },
  { photo: `${import.meta.env.BASE_URL}team/member-05.jpg` },
  { photo: `${import.meta.env.BASE_URL}team/member-06.jpg` },
  { photo: `${import.meta.env.BASE_URL}team/member-07.jpg` },
  { photo: `${import.meta.env.BASE_URL}team/member-08.jpg` },
];
