import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CrmBreadcrumbs } from "@/modules/crm/components/crm-breadcrumbs";
import { SiteHeaderLogo } from "@/components/site-header-logo";

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-5 data-[orientation=vertical]:self-center"
        />
        <div className="min-w-0 flex-1">
          <CrmBreadcrumbs />
        </div>
        <SiteHeaderLogo />
      </div>
    </header>
  );
}
