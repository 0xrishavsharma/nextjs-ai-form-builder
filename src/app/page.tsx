import FormGenerator from "./form-generator";
import Header from "@/components/ui/header";
import { SessionProvider } from "next-auth/react";
import { db } from "@/db";
import { forms } from "@/db/schema";

export default async function Home() {
  const forms = await db.query.forms.findMany();
  console.log("Forms: ", forms);

  return (
    <SessionProvider>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <FormGenerator />
      </main>
    </SessionProvider>
  );
}
