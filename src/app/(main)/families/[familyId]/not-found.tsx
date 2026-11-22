import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FamilyNotFound() {
  return (
    <div className="my-6 space-y-4 rounded-xl border p-6">
      <h1 className="text-xl font-semibold">Familia no disponible</h1>
      <Button asChild variant="outline">
        <Link href="/families">Volver a familias</Link>
      </Button>
    </div>
  );
}
