"use server";

import { revalidatePath } from "next/cache";
import {
  archiveLead,
  archivePerson,
  createPerson,
  createLead,
  createLeadSource,
  updateLeadDetails,
  updatePersonDetails,
  updateLeadSource,
  deleteLeadSource,
  createLifecycle,
  updateLifecycle,
  deleteLifecycle,
  unarchiveLead,
  unarchivePerson,
} from "./services";
import {
  createPersonPayloadSchema,
  createLeadPayloadSchema,
  createLeadSourcePayloadSchema,
  updateLeadSourcePayloadSchema,
  createLifecyclePayloadSchema,
  updateLifecyclePayloadSchema,
  updateLeadDetailsPayloadSchema,
  updatePersonDetailsPayloadSchema,
} from "./schemas";
import type { z } from "zod";

type CreateLeadActionInput = z.input<typeof createLeadPayloadSchema>;
type CreatePersonActionInput = z.input<typeof createPersonPayloadSchema>;
type CreateLeadSourceActionInput = z.input<typeof createLeadSourcePayloadSchema>;
type UpdateLeadSourceActionInput = z.input<typeof updateLeadSourcePayloadSchema>;
type CreateLifecycleActionInput = z.input<typeof createLifecyclePayloadSchema>;
type UpdateLifecycleActionInput = z.input<typeof updateLifecyclePayloadSchema>;
type UpdateLeadDetailsActionInput = z.input<typeof updateLeadDetailsPayloadSchema>;
type UpdatePersonDetailsActionInput = z.input<typeof updatePersonDetailsPayloadSchema>;

interface CreateLeadActionErrorFields {
  name?: string;
  email?: string;
  phone?: string;
}

interface CreatePersonActionErrorFields {
  name?: string;
  email?: string;
  phone?: string;
}

interface CreateLeadActionResult {
  success: boolean;
  leadId?: string;
  message?: string;
  fieldErrors?: CreateLeadActionErrorFields;
}

interface CreatePersonActionResult {
  success: boolean;
  personId?: string;
  message?: string;
  fieldErrors?: CreatePersonActionErrorFields;
}

interface UpdateLeadDetailsActionErrorFields {
  name?: string;
  email?: string;
  phone?: string;
}

interface UpdatePersonDetailsActionErrorFields {
  name?: string;
  email?: string;
  phone?: string;
}

interface UpdateLeadDetailsActionResult {
  success: boolean;
  message?: string;
  fieldErrors?: UpdateLeadDetailsActionErrorFields;
}

interface UpdatePersonDetailsActionResult {
  success: boolean;
  message?: string;
  fieldErrors?: UpdatePersonDetailsActionErrorFields;
}

export async function createLeadAction(
  input: CreateLeadActionInput,
): Promise<CreateLeadActionResult> {
  const parseResult = createLeadPayloadSchema.safeParse(input);

  if (!parseResult.success) {
    const fieldErrors: CreateLeadActionErrorFields = {};

    for (const issue of parseResult.error.issues) {
      if (issue.path[0] === "name" && !fieldErrors.name) {
        fieldErrors.name = issue.message;
      }
      if (issue.path[0] === "email" && !fieldErrors.email) {
        fieldErrors.email = issue.message;
      }
      if (issue.path[0] === "phone" && !fieldErrors.phone) {
        fieldErrors.phone = issue.message;
      }
    }

    return {
      success: false,
      message: "Lütfen formdaki hataları düzeltin",
      fieldErrors,
    };
  }

  try {
    const lead = await createLead(parseResult.data);

    return {
      success: true,
      leadId: lead.id,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Lead kaydedilirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function createPersonAction(
  input: CreatePersonActionInput,
): Promise<CreatePersonActionResult> {
  const parseResult = createPersonPayloadSchema.safeParse(input);

  if (!parseResult.success) {
    const fieldErrors: CreatePersonActionErrorFields = {};

    for (const issue of parseResult.error.issues) {
      if (issue.path[0] === "name" && !fieldErrors.name) {
        fieldErrors.name = issue.message;
      }
      if (issue.path[0] === "email" && !fieldErrors.email) {
        fieldErrors.email = issue.message;
      }
      if (issue.path[0] === "phone" && !fieldErrors.phone) {
        fieldErrors.phone = issue.message;
      }
    }

    return {
      success: false,
      message: "Lütfen formdaki hataları düzeltin",
      fieldErrors,
    };
  }

  try {
    const person = await createPerson(parseResult.data);

    return {
      success: true,
      personId: person.id,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Kişi kaydedilirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function updateLeadDetailsAction(
  id: string,
  input: UpdateLeadDetailsActionInput,
): Promise<UpdateLeadDetailsActionResult> {
  const parseResult = updateLeadDetailsPayloadSchema.safeParse(input);

  if (!parseResult.success) {
    const fieldErrors: UpdateLeadDetailsActionErrorFields = {};

    for (const issue of parseResult.error.issues) {
      if (issue.path[0] === "name" && !fieldErrors.name) {
        fieldErrors.name = issue.message;
      }
      if (issue.path[0] === "email" && !fieldErrors.email) {
        fieldErrors.email = issue.message;
      }
      if (issue.path[0] === "phone" && !fieldErrors.phone) {
        fieldErrors.phone = issue.message;
      }
    }

    return {
      success: false,
      message: "Lütfen formdaki hataları düzeltin",
      fieldErrors,
    };
  }

  try {
    await updateLeadDetails(id, parseResult.data);
    revalidatePath("/crm/leads");
    revalidatePath(`/crm/leads/${id}`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Lead güncellenirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function updatePersonDetailsAction(
  id: string,
  input: UpdatePersonDetailsActionInput,
): Promise<UpdatePersonDetailsActionResult> {
  const parseResult = updatePersonDetailsPayloadSchema.safeParse(input);

  if (!parseResult.success) {
    const fieldErrors: UpdatePersonDetailsActionErrorFields = {};

    for (const issue of parseResult.error.issues) {
      if (issue.path[0] === "name" && !fieldErrors.name) {
        fieldErrors.name = issue.message;
      }
      if (issue.path[0] === "email" && !fieldErrors.email) {
        fieldErrors.email = issue.message;
      }
      if (issue.path[0] === "phone" && !fieldErrors.phone) {
        fieldErrors.phone = issue.message;
      }
    }

    return {
      success: false,
      message: "Lütfen formdaki hataları düzeltin",
      fieldErrors,
    };
  }

  try {
    await updatePersonDetails(id, parseResult.data);
    revalidatePath("/crm/persons");
    revalidatePath(`/crm/persons/${id}`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Kişi güncellenirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function createLeadSourceAction(
  input: CreateLeadSourceActionInput,
): Promise<{ success: boolean; id?: string; message?: string }> {
  const parseResult = createLeadSourcePayloadSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Geçersiz veri. Ad ve sıra zorunludur.",
    };
  }
  try {
    const source = await createLeadSource(parseResult.data);
    revalidatePath("/crm/lead-sources");
    revalidatePath("/crm/leads");
    revalidatePath("/crm/leads/new");
    return { success: true, id: source.id };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Kaynak eklenirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function updateLeadSourceAction(
  id: string,
  input: UpdateLeadSourceActionInput,
): Promise<{ success: boolean; message?: string }> {
  const parseResult = updateLeadSourcePayloadSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Geçersiz veri.",
    };
  }
  try {
    await updateLeadSource(id, parseResult.data);
    revalidatePath("/crm/lead-sources");
    revalidatePath("/crm/lead-sources/" + id);
    revalidatePath("/crm/leads");
    revalidatePath("/crm/leads/new");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Kaynak güncellenirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function deleteLeadSourceAction(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await deleteLeadSource(id);
    revalidatePath("/crm/lead-sources");
    revalidatePath("/crm/leads");
    revalidatePath("/crm/leads/new");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Kaynak silinirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function createLifecycleAction(
  input: CreateLifecycleActionInput,
): Promise<{ success: boolean; id?: string; message?: string }> {
  const parseResult = createLifecyclePayloadSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Geçersiz veri. Ad ve sıra zorunludur.",
    };
  }
  try {
    const lifecycle = await createLifecycle(parseResult.data);
    revalidatePath("/crm/lifecycle");
    revalidatePath("/crm/leads");
    revalidatePath("/crm/leads/new");
    revalidatePath("/crm/deals");
    return { success: true, id: lifecycle.id };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Yaşam döngüsü eklenirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function updateLifecycleAction(
  id: string,
  input: UpdateLifecycleActionInput,
): Promise<{ success: boolean; message?: string }> {
  const parseResult = updateLifecyclePayloadSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Geçersiz veri.",
    };
  }
  try {
    await updateLifecycle(id, parseResult.data);
    revalidatePath("/crm/lifecycle");
    revalidatePath("/crm/lifecycle/" + id);
    revalidatePath("/crm/leads");
    revalidatePath("/crm/leads/new");
    revalidatePath("/crm/deals");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Yaşam döngüsü güncellenirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function deleteLifecycleAction(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await deleteLifecycle(id);
    revalidatePath("/crm/lifecycle");
    revalidatePath("/crm/leads");
    revalidatePath("/crm/leads/new");
    revalidatePath("/crm/deals");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Yaşam döngüsü silinirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function archiveLeadAction(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await archiveLead(id);
    revalidatePath("/crm/leads");
    revalidatePath(`/crm/leads/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Aday arşivlenirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function unarchiveLeadAction(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await unarchiveLead(id);
    revalidatePath("/crm/leads");
    revalidatePath("/crm/leads/archived");
    revalidatePath(`/crm/leads/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Aday arşivden çıkarılırken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function archivePersonAction(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await archivePerson(id);
    revalidatePath("/crm/persons");
    revalidatePath(`/crm/persons/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Kişi arşivlenirken beklenmeyen bir hata oluştu.",
    };
  }
}

export async function unarchivePersonAction(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await unarchivePerson(id);
    revalidatePath("/crm/persons");
    revalidatePath("/crm/persons/archived");
    revalidatePath(`/crm/persons/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Kişi arşivden çıkarılırken beklenmeyen bir hata oluştu.",
    };
  }
}

