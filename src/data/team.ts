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
  { photo: `${import.meta.env.BASE_URL}team/member-01.jpg`,name:"Subhaankar",role:"founder" },
  { photo: `${import.meta.env.BASE_URL}team/member-02.jpg`, name:"Dhrubojoti",role:"CTO"},
  { photo: `${import.meta.env.BASE_URL}team/member-03.jpg`, name:"Swapnil",role:"Operations Expert"},
  { photo: `${import.meta.env.BASE_URL}team/member-04.jpg` ,name:"Subhodeep",role:"Content Specialist"},
  { photo: `${import.meta.env.BASE_URL}team/member-05.jpg`,name:"Sukreet",role:'CPO' },
  { photo: `${import.meta.env.BASE_URL}team/member-06.jpg`,name:"Ratnadip",role:"Operations Specialist" },
  { photo: `${import.meta.env.BASE_URL}team/member-07.jpg` ,name:"Rahul" ,role:"Operations Expert"},
  { photo: `${import.meta.env.BASE_URL}team/member-08.jpg` ,name:"Gaurav",role:"Operations Head"},
  { photo: `${import.meta.env.BASE_URL}team/member-09.jpg`, name: "Ritupriya",role:"Content Specialist" },
  { photo: `${import.meta.env.BASE_URL}team/member-10.jpg` ,name:"",role:""},
  { photo: `${import.meta.env.BASE_URL}team/member-11.jpg`,name:"",role:"" },
];
