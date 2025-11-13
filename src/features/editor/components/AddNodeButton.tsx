"use client";

import NodeSelector from "@/components/react-flow/NodeSelector";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

const AddNodeButton = memo(() => {
  const [open, setOpen] = useState(false);
  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <Button size={"icon"} variant={"outline"} className="bg-background">
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

export default AddNodeButton;
