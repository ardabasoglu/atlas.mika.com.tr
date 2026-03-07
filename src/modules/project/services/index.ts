import { Project, Unit } from "../types";
import { projects as projectFixtures, units as unitFixtures } from "../fixtures";

export const projectServices = {
  getProjects: (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...projectFixtures]), 200);
    });
  },

  getProjectById: (id: string): Promise<Project | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = projectFixtures.find((item) => item.id === id);
        resolve(project);
      }, 200);
    });
  },

  getUnits: (): Promise<Unit[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...unitFixtures]), 200);
    });
  },

  getUnitsByProjectId: (projectId: string): Promise<Unit[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = unitFixtures.filter(
          (unit) => unit.projectId === projectId
        );
        resolve([...filtered]);
      }, 200);
    });
  },

  getUnitById: (id: string): Promise<Unit | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const unit = unitFixtures.find((item) => item.id === id);
        resolve(unit ? { ...unit } : undefined);
      }, 200);
    });
  },

  updateUnit: (
    unitId: string,
    payload: {
      status?: Unit["status"];
      dealId?: string | null;
      personId?: string | null;
    }
  ): Promise<Unit | undefined> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const unit = unitFixtures.find((item) => item.id === unitId);
        if (!unit) {
          reject(new Error("Unit not found"));
          return;
        }
        if (payload.status !== undefined) unit.status = payload.status;
        if (payload.dealId !== undefined) unit.dealId = payload.dealId ?? undefined;
        if (payload.personId !== undefined) unit.personId = payload.personId ?? undefined;
        unit.updatedAt = new Date().toISOString().slice(0, 10);
        resolve({ ...unit });
      }, 200);
    });
  },
};
