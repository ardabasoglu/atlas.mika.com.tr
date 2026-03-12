import { prisma } from "@/lib/prisma";
import {
  LeadSourcePlatform,
  LeadSourceType,
  LeadStatus,
  TimelineEventEntityType,
  TimelineEventType,
} from "@/generated/prisma/client";
import { runSeed } from "./seed";

const personFirstNames = [
  "Ahmet",
  "Mehmet",
  "Ayse",
  "Fatma",
  "Ali",
  "Zeynep",
  "Murat",
  "Elif",
  "Can",
  "Ece",
];

const personLastNames = [
  "Yilmaz",
  "Kaya",
  "Demir",
  "Sahin",
  "Celik",
  "Aydin",
  "Arslan",
  "Dogan",
  "Kilic",
  "Aslan",
];

const activityTitles = [
  "Ilk gorusme yapildi",
  "Telefonla bilgilendirme",
  "E-posta ile teklif iletildi",
  "Ihtiyac analizi tamamlandi",
  "Takip aramasi gerceklestirildi",
];

const activityDescriptions = [
  "Musteri adayinin temel beklentileri not edildi.",
  "Fiyatlandirma ve surec bilgisi paylasildi.",
  "Gorusme sonrasi notlar sisteme eklendi.",
  "Musteri geri donus tarihi planlandi.",
  "Sonraki adim icin randevu alindi.",
];

const leadStatuses: LeadStatus[] = [
  LeadStatus.new,
  LeadStatus.contacted,
  LeadStatus.qualified,
  LeadStatus.converted,
  LeadStatus.lost,
];

const leadSourceTypes: LeadSourceType[] = [
  LeadSourceType.paid_search,
  LeadSourceType.paid_social,
  LeadSourceType.organic,
  LeadSourceType.referral,
  LeadSourceType.direct,
  LeadSourceType.other,
];

const leadSourcePlatforms: LeadSourcePlatform[] = [
  LeadSourcePlatform.google_ads,
  LeadSourcePlatform.meta_ads,
  LeadSourcePlatform.linkedin_ads,
  LeadSourcePlatform.tiktok_ads,
  LeadSourcePlatform.website_form,
  LeadSourcePlatform.phone_call,
  LeadSourcePlatform.other,
];

const timelineEventTypes: TimelineEventType[] = [
  TimelineEventType.note,
  TimelineEventType.call,
  TimelineEventType.meeting,
  TimelineEventType.email,
  TimelineEventType.status_change,
];

function asThreeDigitString(inputNumber: number): string {
  return inputNumber.toString().padStart(3, "0");
}

function buildCreatedAtDate(recordIndex: number): Date {
  const now = new Date();
  const daysAgo = recordIndex * 2;
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

async function seedDemoCrmData() {
  const lifecycles = await prisma.lifecycle.findMany({
    orderBy: { order: "asc" },
  });

  const leadSources = await prisma.leadSource.findMany({
    orderBy: { order: "asc" },
  });

  if (lifecycles.length === 0 || leadSources.length === 0) {
    throw new Error(
      "Lifecycle or lead source options are missing. Run option seeding first.",
    );
  }

  for (let recordIndex = 1; recordIndex <= 50; recordIndex += 1) {
    const seedSuffix = asThreeDigitString(recordIndex);
    const leadId = `seed_lead_${seedSuffix}`;
    const personId = `seed_person_${seedSuffix}`;
    const timelineEventId = `seed_activity_${seedSuffix}`;

    const firstName =
      personFirstNames[(recordIndex - 1) % personFirstNames.length];
    const lastName = personLastNames[(recordIndex - 1) % personLastNames.length];
    const fullName = `${firstName} ${lastName} ${recordIndex}`;
    const email = `lead.${seedSuffix}@ornekcrm.com`;
    const phone = `+90532${seedSuffix.padStart(6, "0")}`;
    const createdAt = buildCreatedAtDate(recordIndex);

    const leadStatus = leadStatuses[(recordIndex - 1) % leadStatuses.length];
    const lifecycle = lifecycles[(recordIndex - 1) % lifecycles.length];
    const leadSource = leadSources[(recordIndex - 1) % leadSources.length];
    const sourceType =
      leadSourceTypes[(recordIndex - 1) % leadSourceTypes.length];
    const sourcePlatform =
      leadSourcePlatforms[(recordIndex - 1) % leadSourcePlatforms.length];

    await prisma.lead.upsert({
      where: { id: leadId },
      update: {
        name: fullName,
        phone,
        email,
        status: leadStatus,
        lifecycleId: lifecycle.id,
        sourceId: leadSource.id,
        sourceType,
        sourcePlatform,
        notes: `Demo lead kaydi ${recordIndex}`,
      },
      create: {
        id: leadId,
        name: fullName,
        phone,
        email,
        status: leadStatus,
        lifecycleId: lifecycle.id,
        sourceId: leadSource.id,
        sourceType,
        sourcePlatform,
        notes: `Demo lead kaydi ${recordIndex}`,
        createdAt,
      },
    });

    await prisma.person.upsert({
      where: { id: personId },
      update: {
        name: fullName,
        phone,
        email,
        notes: `Demo person kaydi ${recordIndex}`,
      },
      create: {
        id: personId,
        name: fullName,
        phone,
        email,
        notes: `Demo person kaydi ${recordIndex}`,
        createdAt,
      },
    });

    await prisma.person.update({
      where: { id: personId },
      data: { leadId },
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: { personId },
    });

    await prisma.timelineEvent.upsert({
      where: { id: timelineEventId },
      update: {
        entityType:
          recordIndex % 2 === 0
            ? TimelineEventEntityType.lead
            : TimelineEventEntityType.person,
        entityId: recordIndex % 2 === 0 ? leadId : personId,
        type: timelineEventTypes[(recordIndex - 1) % timelineEventTypes.length],
        title: activityTitles[(recordIndex - 1) % activityTitles.length],
        description:
          activityDescriptions[
            (recordIndex - 1) % activityDescriptions.length
          ],
        metadata: { seed: true, sequenceNumber: recordIndex },
      },
      create: {
        id: timelineEventId,
        entityType:
          recordIndex % 2 === 0
            ? TimelineEventEntityType.lead
            : TimelineEventEntityType.person,
        entityId: recordIndex % 2 === 0 ? leadId : personId,
        type: timelineEventTypes[(recordIndex - 1) % timelineEventTypes.length],
        title: activityTitles[(recordIndex - 1) % activityTitles.length],
        description:
          activityDescriptions[
            (recordIndex - 1) % activityDescriptions.length
          ],
        metadata: { seed: true, sequenceNumber: recordIndex },
        createdAt,
      },
    });
  }
}

export async function runDummySeed(): Promise<void> {
  await runSeed();
  await seedDemoCrmData();
}

async function main() {
  await runDummySeed();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
