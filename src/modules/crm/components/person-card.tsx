import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { Person } from "../types";

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{person.name}</CardTitle>
        <CardDescription>{person.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{person.email}</span>
          </div>

          {person.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{person.phone}</span>
            </div>
          )}

          {person.notes && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">{person.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
