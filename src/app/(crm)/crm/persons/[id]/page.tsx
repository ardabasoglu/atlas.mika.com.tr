import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { PersonCard } from "@/modules/crm/components/person-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { getPersonById, getDealsByPersonId, getTimelineEvents } from "@/modules/crm/services";
import { formatMoney, DEFAULT_CURRENCY_CODE } from "@/lib/currency";
import { StatusBadge } from "@/modules/crm/components/common/status-badge";
import { EVENT_TYPE_LABELS } from "@/modules/crm/constants";
import { PersonDetailActions } from "./person-detail-actions";

interface PersonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonDetailPage({
  params,
}: PersonDetailPageProps) {
  const { id: personId } = await params;
  const person = await getPersonById(personId);

  if (!person) {
    notFound();
  }

  const [deals, timelineEvents] = await Promise.all([
    getDealsByPersonId(personId),
    getTimelineEvents(),
  ]);

  const personTimelineEvents = timelineEvents.filter(
    (event) => event.entityType === "person" && event.entityId === personId,
  );

  return (
    <CRMPageLayout
      actions={
        <PersonDetailActions
          personId={person.id}
          archivedAt={person.archivedAt}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PersonCard person={person} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="deals">Fırsatlar</TabsTrigger>
              <TabsTrigger value="activities">Aktiviteler</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hakkında</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Oluşturulma
                      </h4>
                      <p>
                        {new Date(person.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        E-posta
                      </h4>
                      <p>{person.email}</p>
                    </div>

                    {person.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Telefon
                        </h4>
                        <p>{person.phone}</p>
                      </div>
                    )}

                    {person.notes && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Notlar
                        </h4>
                        <p>{person.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Özet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-center mx-auto">
                        <Banknote className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{deals.length}</p>
                      <p className="text-xs text-muted-foreground">
                        Fırsatlar
                      </p>
                    </div>

                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-center mx-auto">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{personTimelineEvents.length}</p>
                      <p className="text-xs text-muted-foreground">
                        Aktiviteler
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deals" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fırsatlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deals.length > 0 ? (
                      deals.map((deal) => (
                        <div key={deal.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{deal.title}</p>
                              <div className="text-sm text-muted-foreground mt-1">
                                <StatusBadge status={deal.stage} type="deal" />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatMoney(deal.value, DEFAULT_CURRENCY_CODE)}
                              </p>
                              {deal.expectedCloseDate && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    deal.expectedCloseDate,
                                  ).toLocaleDateString("tr-TR")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        Bu kişi için fırsat bulunamadı
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Aktiviteler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personTimelineEvents.length > 0 ? (
                      personTimelineEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {EVENT_TYPE_LABELS[event.type]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {event.title ?? event.description ?? "-"}
                            </p>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(
                                event.createdAt,
                              ).toLocaleDateString("tr-TR")}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        Bu kişi için aktivite bulunamadı
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CRMPageLayout>
  );
}
