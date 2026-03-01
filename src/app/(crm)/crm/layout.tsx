import { CRMLayout } from "@/modules/crm/components/crm-layout";

export default function CRMLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CRMLayout>{children}</CRMLayout>;
}

