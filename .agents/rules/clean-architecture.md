---
trigger: model_decision
description: Clean Architecture Rules for atlas.mika.com.tr
---

This project follows **Clean Architecture** principles to ensure separation of concerns, testability, and maintainability.

## 🏗 Directory Structure

All source code must reside in the `src` directory, organized into the following layers:

1. **`src/domain` (Entities & Enterprise Rules)**
   - Contains pure business logic, entities, and value objects.
   - Defines **interfaces** (contracts) for repositories and external services.
   - **Rule:** This layer MUST NOT depend on any other layer. It should be framework-agnostic.

2. **`src/application` (Use Cases & Application Rules)**
   - Orchestrates the flow of data to and from entities.
   - Contains application-specific business logic (Use Cases/Services).
   - **Rule:** Depends only on the `domain` layer.

3. **`src/infrastructure` (Infrastructure & Adapters)**
   - Contains implementations of interfaces defined in the `domain` or `application` layer.
   - Database persistence (Drizzle/Prisma), external APIs, file storage, etc.
   - **Rule:** Depends on `application` and `domain`.

4. **`src/app` (Presentation & Frameworks)**
   - contains Next.js Pages, Layouts, Server Actions, and Components.
   - This is the "Delivery Mechanism".
   - **Rule:** Depends on `application` to execute use cases.

## 🛡 Dependency Rule

Dependencies must only point **inwards**:
`Presentation` -> `Application` -> `Domain`
`Infrastructure` -> `Application` -> `Domain`

- **Domain** is the center and depends on nothing.
- **Application** depends on Domain.
- **Infrastructure** and **Presentation** depend on Application.

## 📋 General Guidelines

- **Avoid Fat Controllers/Actions:** Keep Next.js Server Actions thin. They should merely call a Use Case in the Application layer.
- **Interface Segregation:** Infrastructure should implement interfaces defined in the Application/Domain layer to allow for easy swapping of implementations.
- **DTOs:** Use Data Transfer Objects when passing data between layers if the internal entity structure shouldn't be exposed.
- **Validation:** 
  - Input validation (e.g., Zod) happens in the **Presentation** or **Application** layer.
  - Business rule validation happens in the **Domain** or **Application** layer.

## 🏷 Naming Conventions

To keep the codebase consistent, follow these naming conventions:

- **Entities:** `Lead.ts`, `Project.ts` (Simple nouns)
- **Interfaces:** `ILeadRepository.ts`, `IEmailService.ts` (Prefix with `I`)
- **Use Cases:** `CreateLeadUseCase.ts`, `GetProjectByIdUseCase.ts` (Suffix with `UseCase`)
- **Repositories:** `DrizzleLeadRepository.ts`, `PrismaProjectRepository.ts` (Implementation-specific prefix)
- **Server Actions:** `create-lead-action.ts` (Descriptive kebab-case)

## 🚀 Example Flow

1. **User clicks button** -> Calls **Server Action** (Presentation).
2. **Server Action** -> Validates input and calls **Use Case** (Application).
3. **Use Case** -> Retrieves **Entity** (Domain) via **Repository Interface** (Domain/Application).
4. **Implementation** -> **Repository Implementation** (Infrastructure) fetches data from DB.
5. **Use Case** -> Performs business logic on **Entity** and saves via **Repository Interface**.
6. **Server Action** -> Returns result to **UI**.
