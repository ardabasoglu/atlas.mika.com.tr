import {
  Customer,
  Company,
  Contact,
  Deal,
  Activity,
  Lead,
  Lifecycle,
  Team,
} from "../types";
import {
  customers as customerFixtures,
  companies as companyFixtures,
  contacts as contactFixtures,
  deals as dealFixtures,
  activities as activityFixtures,
  leads as leadFixtures,
  lifecycles as lifecycleFixtures,
  teams as teamFixtures,
} from "../fixtures";

function nextId(items: { id: string }[]): string {
  const numbers = items
    .map((item) => parseInt(item.id, 10))
    .filter((number) => !Number.isNaN(number));
  return String((numbers.length ? Math.max(...numbers) : 0) + 1);
}

export const crmServices = {
  // Customer services
  getCustomers: (): Promise<Customer[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(customerFixtures), 200);
    });
  },

  getCustomerById: (id: string): Promise<Customer | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = customerFixtures.find((c) => c.id === id);
        resolve(customer);
      }, 200);
    });
  },

  // Company services
  getCompanies: (): Promise<Company[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(companyFixtures), 200);
    });
  },

  getCompanyById: (id: string): Promise<Company | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const company = companyFixtures.find((c) => c.id === id);
        resolve(company);
      }, 200);
    });
  },

  // Contact services
  getContacts: (): Promise<Contact[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(contactFixtures), 200);
    });
  },

  getContactById: (id: string): Promise<Contact | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contact = contactFixtures.find((c) => c.id === id);
        resolve(contact);
      }, 200);
    });
  },

  // Deal services
  getDeals: (): Promise<Deal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(dealFixtures), 200);
    });
  },

  getDealById: (id: string): Promise<Deal | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deal = dealFixtures.find((d) => d.id === id);
        resolve(deal);
      }, 200);
    });
  },

  // Activity services
  getActivities: (): Promise<Activity[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(activityFixtures), 200);
    });
  },

  getActivityById: (id: string): Promise<Activity | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activity = activityFixtures.find((a) => a.id === id);
        resolve(activity);
      }, 200);
    });
  },

  // Lead services
  getLeads: (): Promise<Lead[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...leadFixtures]), 200);
    });
  },

  getLeadById: (id: string): Promise<Lead | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lead = leadFixtures.find((leadItem) => leadItem.id === id);
        resolve(lead);
      }, 200);
    });
  },

  // Lifecycle services
  getLifecycles: (): Promise<Lifecycle[]> => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([...lifecycleFixtures].sort((a, b) => a.order - b.order)),
        200
      );
    });
  },

  getLifecycleById: (id: string): Promise<Lifecycle | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lifecycle = lifecycleFixtures.find((lifecycleItem) => lifecycleItem.id === id);
        resolve(lifecycle);
      }, 200);
    });
  },

  // Team services
  getTeams: (): Promise<Team[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...teamFixtures]), 200);
    });
  },

  getTeamById: (id: string): Promise<Team | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const team = teamFixtures.find((teamItem) => teamItem.id === id);
        resolve(team);
      }, 200);
    });
  },

  convertLead: (
    leadId: string,
    options?: { createDeal?: boolean }
  ): Promise<{
    contactId: string;
    companyId: string;
    customerId: string;
    dealId?: string;
  }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lead = leadFixtures.find((leadItem) => leadItem.id === leadId);
        if (!lead) {
          reject(new Error("Lead not found"));
          return;
        }
        if (lead.status === "converted" || lead.status === "disqualified") {
          reject(
            new Error(
              `Lead cannot be converted: status is ${lead.status}`
            )
          );
          return;
        }

        const now = new Date().toISOString().slice(0, 10);

        const companyId = lead.companyName
          ? (() => {
              const existing = companyFixtures.find(
                (company) =>
                  company.name.trim().toLowerCase() ===
                  lead.companyName!.trim().toLowerCase()
              );
              if (existing) return existing.id;
              const newId = nextId(companyFixtures);
              const newCompany: Company = {
                id: newId,
                name: lead.companyName,
                website: lead.website,
                industry: lead.industry,
                createdAt: now,
                updatedAt: now,
              };
              companyFixtures.push(newCompany);
              return newId;
            })()
          : (() => {
              const newId = nextId(companyFixtures);
              const placeholderName = `Bireysel - ${lead.firstName} ${lead.lastName}`;
              companyFixtures.push({
                id: newId,
                name: placeholderName,
                createdAt: now,
                updatedAt: now,
              });
              return newId;
            })();

        const customerId = (() => {
          const existing = customerFixtures.find(
            (customer) => customer.id === companyId
          );
          if (existing) return existing.id;
          const company = companyFixtures.find((company) => company.id === companyId)!;
          const newCustomer: Customer = {
            id: companyId,
            name: company.name,
            email: lead.email,
            phone: lead.phone,
            company: company.name,
            status: "prospect",
            createdAt: now,
            updatedAt: now,
          };
          customerFixtures.push(newCustomer);
          return companyId;
        })();

        const contactId = nextId(contactFixtures);
        const newContact: Contact = {
          id: contactId,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          position: lead.position,
          customerId,
          companyId,
          createdAt: now,
          updatedAt: now,
        };
        contactFixtures.push(newContact);

        let dealId: string | undefined;
        if (options?.createDeal) {
          dealId = nextId(dealFixtures);
          dealFixtures.push({
            id: dealId,
            title: lead.propertyInterest
              ? `Fırsat - ${lead.propertyInterest}`
              : "Yeni fırsat",
            value: 0,
            currency: "TRY",
            stage: "prospecting",
            probability: 10,
            customerId,
            contactId,
            companyId,
            createdAt: now,
            updatedAt: now,
          });
        }

        lead.status = "converted";
        lead.convertedAt = now;
        lead.convertedCompanyId = companyId;
        lead.convertedContactId = contactId;
        lead.updatedAt = now;

        resolve({
          contactId,
          companyId,
          customerId,
          ...(dealId && { dealId }),
        });
      }, 200);
    });
  },
};
