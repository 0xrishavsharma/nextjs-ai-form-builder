"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";

export default function Home() {
    const [isDialogueOpen, setIsDialogueOpen] = useState(false);
    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            <Button onClick={() => setIsDialogueOpen(!isDialogueOpen)}>
                Click me
            </Button>
            {isDialogueOpen && (
                <div>
                    <Dialog>Something interesting</Dialog>
                </div>
            )}
        </main>
    );
}
