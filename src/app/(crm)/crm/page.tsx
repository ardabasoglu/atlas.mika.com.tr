import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, DollarSign, Calendar } from "lucide-react";
import { crmServices } from "@/modules/crm/services";
import { CustomerTable } from "@/modules/crm/components/customer-table";
import { OverviewChart } from "@/modules/crm/components/overview-chart";

export default async function CRMDashboardPage() {
  const customers = await crmServices.getCustomers();
  const companies = await crmServices.getCompanies();
  const deals = await crmServices.getDeals();
  const activities = await crmServices.getActivities();

  const activeCustomers = customers.filter((customer) => customer.status === "active").length;
  const prospectCustomers = customers.filter(
    (customer) => customer.status === "prospect"
  ).length;
  const totalRevenue = deals.reduce((sum, deal) => {
    if (deal.stage === "closed-won") {
      return sum + deal.value;
    }
    return sum;
  }, 0);

  return (
    <CRMPageLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Müşteri
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Geçen aydan +2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Müşteriler
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Geçen aydan +1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground">
              Geçen aydan %15
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Yaklaşan Aktiviteler
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.filter((activity) => !activity.completed).length}
            </div>
            <p className="text-xs text-muted-foreground">Bugün</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <OverviewChart />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Son Müşteriler</h2>
          <Badge variant="outline">Son 30 gün</Badge>
        </div>
        <CustomerTable customers={customers.slice(0, 5)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Aktif</span>
                <span className="font-medium">{activeCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span>Potansiyel Müşteriler</span>
                <span className="font-medium">{prospectCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span>Pasif</span>
                <span className="font-medium">
                  {customers.length - activeCustomers - prospectCustomers}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fırsat Hunisi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Aday Müşteri</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "prospecting").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Nitelik</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "qualification").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Teklif</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "proposal").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Müzakere</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "negotiation").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="font-medium">{activity.subject}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.description}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.date).toLocaleDateString()} •{" "}
                    {activity.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMPageLayout>
  );
}

