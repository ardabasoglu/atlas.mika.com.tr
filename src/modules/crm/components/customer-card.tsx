import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "./common/status-badge";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Customer } from "../types";

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{customer.name}</CardTitle>
        <CardDescription>{customer.company}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{customer.email}</span>
          </div>

          {customer.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
          )}

          {customer.address && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <span className="break-words">{customer.address}</span>
            </div>
          )}

          {customer.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
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

          <div className="pt-2">
            <StatusBadge status={customer.status} type="customer" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
