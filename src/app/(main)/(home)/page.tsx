import { verifySession } from "@/lib/auth-utils";
import { HomeHeader } from "./_components/home-header";

export default async function Home() {
  const session = await verifySession();

  return (
    <>
      <HomeHeader />

      <div className="overflow-hidden">
        <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px *:-mt-px -m-px">
          <pre>
            <code>{JSON.stringify(session, null, 2)}</code>
          </pre>
        </div>
      </div>
    </>
  );
}
