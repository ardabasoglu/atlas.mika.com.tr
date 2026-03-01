import { Activity } from "../types";

const types: Activity["type"][] = ["call", "meeting", "email", "task", "note"];
const subjects = [
  "Initial Consultation",
  "Proposal Presentation",
  "Follow-up Questions",
  "Prepare Demo",
  "Contract Negotiation",
  "Prospect Interest Level",
  "Post-Sale Check-in",
  "Technical Review",
  "Kickoff Meeting",
  "Status Update",
];
const assigned = ["sales-team", "tech-team", "legal-team", "account-management"];

function buildActivities(): Activity[] {
  const items: Activity[] = [];
  for (let index = 1; index <= 50; index++) {
    const type = types[(index - 1) % types.length];
    const day = String(1 + (index % 28)).padStart(2, "0");
    const month = index <= 25 ? "02" : "01";
    const date = `2026-${month}-${day}T10:00:00Z`;
    items.push({
      id: String(index),
      type,
      subject: `${subjects[(index - 1) % subjects.length]} #${index}`,
      description: `Activity ${index} description`,
      date,
      duration: type === "email" || type === "note" ? undefined : 30 + (index % 60),
      customerId: String((index % 5) + 1),
      contactId: String((index % 7) + 1),
      dealId: index % 3 === 0 ? undefined : String((index % 5) + 1),
      assignedTo: assigned[(index - 1) % assigned.length],
      completed: index % 4 !== 0,
      createdAt: date.slice(0, 10),
      updatedAt: date.slice(0, 10),
    });
  }
  return items;
}

export const activities: Activity[] = buildActivities();
