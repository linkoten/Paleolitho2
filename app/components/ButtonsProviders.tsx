import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ButtonsProviders() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <Button
          onClick={async () => await signIn()}
          className="flex items-center gap-2"
        >
          <span>Se connecter</span>
        </Button>
      </div>
    </>
  );
}
