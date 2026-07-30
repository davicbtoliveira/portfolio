import type { PageServerLoad } from "./$types";
import { getProjectEntries } from "../../lib/projects";

export const prerender = true;

export const load: PageServerLoad = async () => {
  const allProjects = await getProjectEntries();
  const statuses = Array.from(new Set(allProjects.map((entry) => entry.data.status))).sort();
  const techs = Array.from(new Set(allProjects.flatMap((entry) => entry.data.tech))).sort();
  return { projects: allProjects, statuses, techs };
};
