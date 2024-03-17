"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { generateForm } from "@/actions/generateForm";
import { useFormState, useFormStatus } from "react-dom";
import { set } from "zod";

type Props = {};

const initialState: { message: string; data?: any } = {
  message: "",
};

export function HandleFormSubmit() {
  console.log("HandleFormSubmit");
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}

const FormGenerator = (props: Props) => {
  const [state, formAction] = useFormState(generateForm, initialState);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  useEffect(() => {
    if (state.message === "success") {
      setIsDialogueOpen(false);
    }
    console.log("Form state: ", state.data);
  }, [state.message, state.data]);

  const handleFormCreate = () => {
    setIsDialogueOpen(true);
  };

  return (
    <Dialog open={isDialogueOpen} onOpenChange={setIsDialogueOpen}>
      <Button onClick={handleFormCreate}>Create Form</Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <Textarea
              id="description"
              name="description"
              required
              placeholder="How do you want your form to look like? What's it about? What are the questions you want to ask? and so on..."
            />
          </div>
          <DialogFooter>
            <HandleFormSubmit />
            <Button variant="link">Create Manually</Button>{" "}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default FormGenerator;
