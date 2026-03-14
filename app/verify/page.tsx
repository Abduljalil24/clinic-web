import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{padding:40,textAlign:"center"}}>جاري التحميل...</div>}>
      <VerifyClient />
    </Suspense>
  );
}