import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, DollarSign, Calendar } from "lucide-react";
import { getPersons, getDeals, getTimelineEvents } from "@/modules/crm/services";
import { EVENT_TYPE_LABELS } from "@/modules/crm/constants";
import { formatMoneyCompact } from "@/lib/currency";
import { PersonTable } from "@/modules/crm/components/person-table";
import { OverviewChart } from "@/modules/crm/components/overview-chart";

export default async function CRMDashboardPage() {
  const persons = await getPersons();
  const deals = await getDeals();
  const timelineEvents = await getTimelineEvents();


  const totalRevenue = deals.reduce((sum, deal) => {
    if (deal.stage === "won") {
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
              Toplam Kişi
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{persons.length}</div>
            <p className="text-xs text-muted-foreground">Kayıtlı kişi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Fırsat
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
            <p className="text-xs text-muted-foreground">Açık fırsatlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kazanılan Değer</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMoneyCompact(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Kazanılan fırsatlar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Aktivite
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timelineEvents.length}</div>
            <p className="text-xs text-muted-foreground">Kayıtlı aktivite</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <OverviewChart />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Son Kişiler</h2>
          <span className="text-sm text-muted-foreground">Son 5</span>
        </div>
        <PersonTable persons={persons.slice(0, 5)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fırsat Aşamaları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Sorgulama</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "inquiry").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Toplantı</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "meeting").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Teklif</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "offer").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Müzakere</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "negotiation").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kazanıldı</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "won").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kaybedildi</span>
                <span className="font-medium">
                  {deals.filter((deal) => deal.stage === "lost").length}
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
              {timelineEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="font-medium">
                    {EVENT_TYPE_LABELS[event.type]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {event.title ?? event.description ?? "-"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(event.createdAt).toLocaleDateString()}
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
