import { DealDetailClient } from "./deal-detail-client";

interface DealDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id: dealId } = await params;
  return <DealDetailClient dealId={dealId} />;
}
