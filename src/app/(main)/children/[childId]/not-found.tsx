import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChildNotFound() {
  return (
    <div className="my-6 space-y-4 rounded-xl border p-6">
      <h1 className="text-xl font-semibold">Perfil no disponible</h1>
      <Button asChild variant="outline">
        <Link href="/children">Volver a niños</Link>
      </Button>
    </div>
  );
}
