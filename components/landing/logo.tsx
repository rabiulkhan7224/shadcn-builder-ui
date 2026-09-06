import { BlocksIcon } from "lucide-react";

export default function Logo() {
  return (
    <>
      <BlocksIcon className="h-6 w-6" strokeWidth={2} />

      <span className="text-lg font-semibold">
        Shadcn <span className="font-normal">Builder UI</span>
        <sup className="ml-1 text-xs font-normal text-muted-foreground">
          Beta
        </sup>
      </span>
    </>
  );
}
