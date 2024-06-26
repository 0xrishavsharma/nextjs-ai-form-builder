import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

export const formElementTypes = pgEnum("form_element_type", [
  "RadioGroup",
  "Textarea",
  "Select",
  "Switch",
]);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// To keep a track of forms a user has created through out their user journey
export const forms = pgTable("forms", {
  id: serial("id").notNull().primaryKey(),
  name: text("name"),
  description: text("description"),
  userId: text("userId").notNull(),
  published: boolean("published"),
});

// Defining the RELATIONS between FORM and other tables like questions and field options
//  - First argument of the relations function is the table we are defining the relations for (forms)
//  - Second argument is a callback function that receives the relations object as an argument
export const formRelations = relations(forms, ({ many, one }) => ({
  questions: many(questions), // First relation is a one-to-many relation between a form and questions
  user: one(users, {
    fields: [forms.userId],
    references: [users.id],
  }), // Second relation is a one-to-one relation between a form and the user. Here the one function is accepting two arguments. First is the table we are defining the relation for and second is defining how this connection work, it's an object that defines the fields and references for the relation to be established between the two tables (forms and users)
}));

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text"),
  fieldType: formElementTypes("fieldType"),
  formId: integer("formId"),
});

// Defining the RELATIONS between QUESTION and other tables like field options and forms
export const questionRelations = relations(questions, ({ many, one }) => ({
  form: one(forms, {
    fields: [questions.formId],
    references: [forms.id],
  }),
  fieldOptions: many(fieldOptions), // This is a one-to-many relation between a question and field options
}));

export const fieldOptions = pgTable("field_options", {
  id: serial("id").primaryKey(),
  text: text("text"),
  value: text("value"),
  questionId: integer("question_id"),
});

// Defining the RELATIONS between FIELD_OPTION and questions
export const fieldOptionsRelations = relations(fieldOptions, ({ one }) => ({
  question: one(questions, {
    fields: [fieldOptions.questionId],
    references: [questions.id],
  }),
}));
