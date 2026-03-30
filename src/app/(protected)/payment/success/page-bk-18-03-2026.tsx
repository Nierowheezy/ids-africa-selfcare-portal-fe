// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
// import { ChatWidget } from "@/components/chat/ChatWidget";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

// export default function PaymentSuccessPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const reference = searchParams.get("reference");
//   const [status, setStatus] = useState<"loading" | "success" | "failed">(
//     "loading",
//   );

//   useEffect(() => {
//     if (!reference) {
//       setStatus("failed");
//       return;
//     }

//     // Optional: verify payment again (call your backend /verify endpoint if you add it)
//     // For now, assume success if reference exists
//     setTimeout(() => {
//       setStatus("success");
//     }, 1500);
//   }, [reference]);

//   return (
//     <div className="flex min-h-screen flex-col bg-gray-50">
//       <Header />

//       <main className="flex-1 flex items-center justify-center py-12">
//         <Card className="max-w-lg w-full mx-4 shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-2xl font-heading">
//               Payment Status
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-center space-y-6 py-8">
//             {status === "loading" && (
//               <>
//                 <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto" />
//                 <p className="text-lg text-gray-600">
//                   Verifying your payment...
//                 </p>
//               </>
//             )}

//             {status === "success" && (
//               <>
//                 <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto" />
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   Payment Successful!
//                 </h2>
//                 <p className="text-lg text-gray-600">
//                   Your payment has been processed. Your account balance will
//                   reflect shortly.
//                 </p>
//                 <div className="pt-4">
//                   <Button
//                     className="bg-red-600 hover:bg-red-700"
//                     onClick={() => router.push("/payment/history")}
//                   >
//                     View Payment History
//                   </Button>
//                 </div>
//                 <div className="pt-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => router.push("/dashboard")}
//                   >
//                     Back to Dashboard
//                   </Button>
//                 </div>
//               </>
//             )}

//             {status === "failed" && (
//               <>
//                 <AlertTriangle className="h-20 w-20 text-red-600 mx-auto" />
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   Payment Issue
//                 </h2>
//                 <p className="text-lg text-gray-600">
//                   We couldn't verify your payment or something went wrong.
//                 </p>
//                 <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
//                   <Button
//                     variant="outline"
//                     onClick={() => router.push("/payment/make-payment")}
//                   >
//                     Try Again
//                   </Button>
//                   <Button onClick={() => router.push("/dashboard")}>
//                     Back to Dashboard
//                   </Button>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </main>

//       <Footer />
//       <ChatWidget />
//     </div>
//   );
// }
