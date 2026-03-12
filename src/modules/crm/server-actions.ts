"use server";

import { revalidatePath } from "next/cache";
import {
  archiveLead,
  createLead,
  createLeadSource,
  updateLeadDetails,
  updateLeadSource,
  deleteLeadSource,
  unarchiveLead,
} from "./services";
import {
  createLeadPayloadSchema,
  createLeadSourcePayloadSchema,
  updateLeadSourcePayloadSchema,
  updateLeadDetailsPayloadSchema,
} from "./schemas";
import type { z } from "zod";

type CreateLeadActionInput = z.input<typeof createLeadPayloadSchema>;
type CreateLeadSourceActionInput = z.input<typeof createLeadSourcePayloadSchema>;
type UpdateLeadSourceActionInput = z.input<typeof updateLeadSourcePayloadSchema>;
type UpdateLeadDetailsActionInput = z.input<typeof updateLeadDetailsPayloadSchema>;

interface CreateLeadActionErrorFields {
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

interface UpdateLeadDetailsActionErrorFields {
  name?: string;
  email?: string;
  phone?: string;
}

interface UpdateLeadDetailsActionResult {
  success: boolean;
  message?: string;
  fieldErrors?: UpdateLeadDetailsActionErrorFields;
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

