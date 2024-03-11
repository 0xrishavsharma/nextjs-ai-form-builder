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
import { useState } from "react";
import { generateForm } from "@/actions/generateForm";
import { useFormState } from "react-dom";

type Props = {};
const FormGenerator = (props: Props) => {
    const [isDialogueOpen, setIsDialogueOpen] = useState(false);

    const onSubmit = () => {
        // e.preventDefault();
        setIsDialogueOpen(true);
    };
    return (
        <Dialog open={isDialogueOpen} onOpenChange={setIsDialogueOpen}>
            <Button onClick={onSubmit}>Create Form</Button>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Create a new form</DialogTitle>
                    <form>
                        <div className='grid gap-4 py-4'>
                            <Textarea
                                id='description'
                                name='description'
                                required
                                placeholder="How do you want your form to look like? What's it about? What are the questions you want to ask? and so on..."
                            />
                        </div>
                    </form>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='link'> Create Manually</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default FormGenerator;
