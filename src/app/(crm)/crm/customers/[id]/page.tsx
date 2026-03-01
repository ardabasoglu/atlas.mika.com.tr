import { CRMPageLayout } from "@/modules/crm/components/crm-page-layout";
import { CustomerCard } from "@/modules/crm/components/customer-card";
import { StatusBadge } from "@/modules/crm/components/common/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, User, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { crmServices } from "@/modules/crm/services";
import { Contact } from "@/modules/crm/types";
import { customers } from "@/modules/crm/fixtures";

interface CustomerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id: customerId } = await params;
  const customer = await crmServices.getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  const relatedContacts = customers
    .flatMap((customerItem) =>
      customerItem.id === customer.id ? [customerItem] : [],
    )
    .map((customerItem) => ({
      id: customerItem.id,
      name: customerItem.name,
      email: customerItem.email,
    }));

  const allContacts = await import("@/modules/crm/fixtures/contacts.fixture");
  const allDeals = await import("@/modules/crm/fixtures/deals.fixture");
  const allActivities =
    await import("@/modules/crm/fixtures/activities.fixture");

  const contacts = allContacts.contacts.filter(
    (contact: Contact) => contact.customerId === customerId,
  );
  const deals = allDeals.deals.filter((deal) => deal.customerId === customerId);
  const activities = allActivities.activities.filter(
    (activity) => activity.customerId === customerId,
  );

  return (
    <CRMPageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CustomerCard customer={customer} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="contacts">Kişiler</TabsTrigger>
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
                        Durum
                      </h4>
                      <StatusBadge status={customer.status} type="customer" />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Oluşturulma
                      </h4>
                      <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        E-posta
                      </h4>
                      <p>{customer.email}</p>
                    </div>

                    {customer.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Telefon
                        </h4>
                        <p>{customer.phone}</p>
                      </div>
                    )}

                    {customer.website && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Web Sitesi
                        </h4>
                        <a
                          href={`https://${customer.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {customer.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Müşteri Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-center mx-auto">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{contacts.length}</p>
                      <p className="text-xs text-muted-foreground">Kişiler</p>
                    </div>

                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-center mx-auto">
                        <DollarSign className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{deals.length}</p>
                      <p className="text-xs text-muted-foreground">Fırsatlar</p>
                    </div>

                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-center mx-auto">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{activities.length}</p>
                      <p className="text-xs text-muted-foreground">
                        Aktiviteler
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Kişiler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts.length > 0 ? (
                      contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {contact.position}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{contact.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {contact.phone}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        Bu müşteri için kişi bulunamadı
                      </p>
                    )}
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
                              <p className="text-sm text-muted-foreground">
                                {deal.stage}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${deal.value.toLocaleString()}
                              </p>
                              <Badge variant="outline">
                                {deal.probability}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        Bu müşteri için fırsat bulunamadı
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
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="p-3 border rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{activity.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {activity.description}
                              </p>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(activity.date).toLocaleDateString()}
                              </div>
                            </div>
                            <StatusBadge
                              status={
                                activity.completed ? "completed" : "pending"
                              }
                              type="activity"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        Bu müşteri için aktivite bulunamadı
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
