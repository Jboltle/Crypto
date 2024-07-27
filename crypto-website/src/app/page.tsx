"use client";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDemo
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogProvider } from "@/components/DialogContext";

export default function Home() {
  const [change, setChange] = useState('');

  const onchange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setChange(event.target.value);
  };

  return (
    <main>
      <div id="dialogue-popup">
        <DialogProvider>
          <DialogDemo />
        </DialogProvider>
      </div>
    </main>
  );
}
