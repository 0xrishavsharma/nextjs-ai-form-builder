"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

// As this function will be used as a form action, this action can take previous data as an argument
export async function generateForm(
    previousData: { message: string },
    formData: FormData
) {
    const formDescriptionSchema = z.object({
        description: z.string().min(10),
    });

    const parsedDescription = formDescriptionSchema.safeParse({
        description: formData.get("description"),
    });

    if (!parsedDescription.success) {
        console.log("Form description is required");
        return {
            message: "Form description is required. Failed to parse data",
        };
    }
    const data = parsedDescription.data;
    const promptExplanation = `Generate a survey based on the provided description. The survey should be in JSON format and contain an array of questions. Each question should have two properties: 'text' and 'fieldType'. The 'fieldType' can be one of the following: 'RadioGroup', 'Select', 'Input', 'Textarea', or 'Switch'.
    For 'RadioGroup' and 'Select' field types, include a 'fieldOptions' array containing objects with 'text' and 'value' properties. For instance, the 'fieldOptions' array could be [{'text': 'Yes', 'value': 'yes'}, {'text': 'No', 'value': 'no'}].
    For 'Input', 'Textarea', and 'Switch' field types, the 'fieldOptions' array should be empty, i.e., [].`;

    if (process.env.OPENAI_API_KEY === undefined) {
        console.error("OpenAI API Key is not set");
    }
    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
                },
                method: "POST",
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `${data.description} ${promptExplanation}`,
                        },
                    ],
                }),
            }
        );
        const json = await response.json();

        revalidatePath("/");
        return {
            message: "success",
            data: json.choices[0],
        };
    } catch (error) {
        console.log(error);
    }
}
