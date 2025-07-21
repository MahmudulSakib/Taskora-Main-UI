import { Suspense } from "react";
import VerifyPage from "@/components/VerifyPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPage />
    </Suspense>
  );
}
