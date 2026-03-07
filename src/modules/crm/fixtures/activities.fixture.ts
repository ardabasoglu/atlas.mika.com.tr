import { Activity } from "../types";

const baseActivities = [
  { type: "call" as const, subject: "İlk Danışma", description: "Potansiyel müşteri ile ilk görüşme", duration: 30, customerIndex: 0, contactIndex: 0, dealIndex: undefined, assignedTo: "sales-team", completed: true, date: "2026-02-01" },
  { type: "meeting" as const, subject: "Teklif Sunumu", description: "Teklif sunumu ve soru-cevap", duration: 60, customerIndex: 1, contactIndex: 1, dealIndex: 0, assignedTo: "tech-team", completed: true, date: "2026-02-02" },
  { type: "email" as const, subject: "Takip Soruları", description: "Müşteri sorularına yanıt", duration: undefined, customerIndex: 2, contactIndex: 2, dealIndex: 1, assignedTo: "legal-team", completed: true, date: "2026-02-03" },
  { type: "task" as const, subject: "Demo Hazırlığı", description: "Demo ortamı ve senaryo hazırlığı", duration: 45, customerIndex: 3, contactIndex: 3, dealIndex: 2, assignedTo: "account-management", completed: false, date: "2026-02-04" },
  { type: "note" as const, subject: "Sözleşme Müzakere", description: "Müzakere notları", duration: undefined, customerIndex: 4, contactIndex: 4, dealIndex: 3, assignedTo: "sales-team", completed: true, date: "2026-02-05" },
  { type: "call" as const, subject: "Müşteri İlgi Düzeyi", description: "İlgi düzeyi değerlendirme görüşmesi", duration: 20, customerIndex: 0, contactIndex: 5, dealIndex: 4, assignedTo: "tech-team", completed: true, date: "2026-02-06" },
  { type: "meeting" as const, subject: "Satış Sonrası Görüşme", description: "Proje kick-off toplantısı", duration: 90, customerIndex: 1, contactIndex: 6, dealIndex: undefined, assignedTo: "account-management", completed: false, date: "2026-02-07" },
  { type: "email" as const, subject: "Teknik İnceleme", description: "Teknik gereksinimler özeti", duration: undefined, customerIndex: 2, contactIndex: 7, dealIndex: 5, assignedTo: "tech-team", completed: true, date: "2026-02-08" },
  { type: "task" as const, subject: "Başlangıç Toplantısı", description: "Proje başlangıç planlaması", duration: 60, customerIndex: 3, contactIndex: 8, dealIndex: 6, assignedTo: "sales-team", completed: true, date: "2026-02-09" },
  { type: "note" as const, subject: "Durum Güncellemesi", description: "Haftalık durum notları", duration: undefined, customerIndex: 4, contactIndex: 9, dealIndex: 7, assignedTo: "legal-team", completed: false, date: "2026-02-10" },
];

function buildActivities(): Activity[] {
  return baseActivities.map((activity, index) => {
    const customerId = String(activity.customerIndex + 1);
    const contactId = String(activity.contactIndex + 1);
    const dealId = activity.dealIndex !== undefined ? String(activity.dealIndex + 1) : undefined;
    const date = `${activity.date}T10:00:00Z`;
    return {
      id: String(index + 1),
      type: activity.type,
      subject: activity.subject,
      description: activity.description,
      date,
      duration: activity.duration,
      customerId,
      contactId,
      dealId,
      assignedTo: activity.assignedTo,
      completed: activity.completed,
      createdAt: activity.date,
      updatedAt: activity.date,
    };
  });
}

export const activities: Activity[] = buildActivities();
