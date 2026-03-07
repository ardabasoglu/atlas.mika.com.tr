import { redirect } from "next/navigation";

interface CustomerDetailRedirectProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailRedirectPage({
  params,
}: CustomerDetailRedirectProps) {
  const { id } = await params;
  redirect(`/crm/persons/${id}`);
}
