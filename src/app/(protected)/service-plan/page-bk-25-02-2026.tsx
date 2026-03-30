// "use client";

// import { useState, useEffect } from "react";
// import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
// import { ChatWidget } from "@/components/chat/ChatWidget";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import Link from "next/link";
// import {
//   ChevronRight,
//   Download,
//   Upload,
//   Calendar,
//   Clock,
//   ArrowRight,
// } from "lucide-react";

// export default function ServicePlanPage() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);
//   const servicePlan = {
//     planName: "Brauz Bronze",
//     status: "suspended" as const,
//     downloadSpeed: "10",
//     uploadSpeed: "10",
//     subscriptionDate: "22nd April 2024",
//     expiryDate: "...",
//     billingCycle: "Monthly",
//     autoRenewal: false,
//   };

//   return (
//     <div className="flex min-h-screen flex-col bg-gray-50">
//       <Header />

//       <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
//         {/* Breadcrumb */}
//         <div className="mb-8 flex items-center space-x-2 text-sm animate-in fade-in duration-300">
//           <Link
//             href="/dashboard"
//             className="text-red-600 hover:text-red-700 font-medium transition-colors"
//           >
//             Dashboard
//           </Link>
//           <ChevronRight className="h-4 w-4 text-gray-400" />
//           <span className="text-gray-600">Service Plan</span>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Plan Overview */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="shadow-sm">
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <CardTitle className="text-3xl font-heading font-bold">
//                       {servicePlan.planName}
//                     </CardTitle>
//                     <p className="text-gray-600 mt-2">Current Service Plan</p>
//                   </div>
//                   <Badge
//                     variant={
//                       servicePlan.status === "active"
//                         ? "default"
//                         : "destructive"
//                     }
//                     className={
//                       servicePlan.status === "active"
//                         ? "bg-green-100 text-green-700 hover:bg-green-100 text-base px-4 py-1"
//                         : "bg-orange-100 text-orange-700 hover:bg-orange-100 text-base px-4 py-1"
//                     }
//                   >
//                     {servicePlan.status}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Bandwidth Details */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-heading font-semibold text-gray-900">
//                     Bandwidth Specifications
//                   </h3>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
//                       <div className="flex items-center space-x-3 mb-3">
//                         <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
//                           <Download className="h-5 w-5 text-white" />
//                         </div>
//                         <p className="text-sm font-medium text-blue-900">
//                           Download Speed
//                         </p>
//                       </div>
//                       <p className="text-4xl font-bold text-blue-900">
//                         {servicePlan.downloadSpeed}
//                         <span className="text-xl ml-2">Mbps</span>
//                       </p>
//                     </div>

//                     <div className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
//                       <div className="flex items-center space-x-3 mb-3">
//                         <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
//                           <Upload className="h-5 w-5 text-white" />
//                         </div>
//                         <p className="text-sm font-medium text-green-900">
//                           Upload Speed
//                         </p>
//                       </div>
//                       <p className="text-4xl font-bold text-green-900">
//                         {servicePlan.uploadSpeed}
//                         <span className="text-xl ml-2">Mbps</span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Plan Features */}
//                 <div className="space-y-4 pt-4 border-t">
//                   <h3 className="text-lg font-heading font-semibold text-gray-900">
//                     Plan Features
//                   </h3>
//                   <ul className="space-y-3">
//                     <li className="flex items-center space-x-3">
//                       <div className="w-2 h-2 rounded-full bg-red-600" />
//                       <span className="text-gray-700">
//                         Unlimited Data Usage
//                       </span>
//                     </li>
//                     <li className="flex items-center space-x-3">
//                       <div className="w-2 h-2 rounded-full bg-red-600" />
//                       <span className="text-gray-700">
//                         24/7 Customer Support
//                       </span>
//                     </li>
//                     <li className="flex items-center space-x-3">
//                       <div className="w-2 h-2 rounded-full bg-red-600" />
//                       <span className="text-gray-700">No Speed Throttling</span>
//                     </li>
//                     <li className="flex items-center space-x-3">
//                       <div className="w-2 h-2 rounded-full bg-red-600" />
//                       <span className="text-gray-700">
//                         Monthly Billing Cycle
//                       </span>
//                     </li>
//                   </ul>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Subscription Details */}
//           <div className="space-y-6">
//             <Card className="shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-xl font-heading">
//                   Subscription Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
//                     <Calendar className="h-5 w-5 text-gray-500" />
//                     <div className="flex-1">
//                       <p className="text-xs text-gray-600">Subscription Date</p>
//                       <p className="text-sm font-semibold text-gray-900">
//                         {servicePlan.subscriptionDate}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
//                     <Clock className="h-5 w-5 text-gray-500" />
//                     <div className="flex-1">
//                       <p className="text-xs text-gray-600">Expiry Date</p>
//                       <p className="text-sm font-semibold text-gray-900">
//                         {servicePlan.expiryDate}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="p-3 rounded-lg bg-gray-50">
//                     <p className="text-xs text-gray-600 mb-1">Billing Cycle</p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       {servicePlan.billingCycle}
//                     </p>
//                   </div>

//                   <div className="p-3 rounded-lg bg-gray-50">
//                     <p className="text-xs text-gray-600 mb-1">Auto Renewal</p>
//                     <Badge
//                       variant="secondary"
//                       className={
//                         servicePlan.autoRenewal
//                           ? "bg-green-100 text-green-700"
//                           : "bg-gray-200 text-gray-700"
//                       }
//                     >
//                       {servicePlan.autoRenewal ? "Enabled" : "Disabled"}
//                     </Badge>
//                   </div>
//                 </div>

//                 <div className="pt-4 space-y-3">
//                   <Link href="/payment/make-payment" className="block">
//                     <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-ui transition-all hover:scale-[1.02] active:scale-[0.98] group">
//                       Renew Service
//                       <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                     </Button>
//                   </Link>
//                   <Button
//                     variant="outline"
//                     className="w-full font-ui transition-all hover:border-red-300 hover:text-red-600"
//                   >
//                     Upgrade Plan
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {servicePlan.status === "suspended" && (
//               <Card className="shadow-sm border-orange-200 bg-orange-50">
//                 <CardContent className="pt-6">
//                   <div className="space-y-2">
//                     <h4 className="font-heading font-semibold text-orange-900">
//                       Service Suspended
//                     </h4>
//                     <p className="text-sm text-orange-800">
//                       Your service has been suspended. Please renew your
//                       subscription to continue using the service.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </main>

//       <Footer />
//       <ChatWidget />
//     </div>
//   );
// }
