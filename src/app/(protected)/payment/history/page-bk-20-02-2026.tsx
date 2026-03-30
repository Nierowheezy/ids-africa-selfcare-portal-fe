// "use client";

// import { useState, useEffect } from "react";
// import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
// import { ChatWidget } from "@/components/chat/ChatWidget";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import Link from "next/link";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Filter,
//   Download,
//   CreditCard,
//   Building2,
//   ArrowUpDown,
// } from "lucide-react";

// interface Payment {
//   id: string;
//   date: string;
//   amount: number;
//   method: "bank_transfer" | "paystack";
//   reference: string;
//   status: "success" | "pending" | "failed";
//   plan: string;
// }

// const mockPayments: Payment[] = [
//   {
//     id: "1",
//     date: "2024-01-15",
//     amount: 12000,
//     method: "paystack",
//     reference: "PAY-2024011512345",
//     status: "success",
//     plan: "Brauz Bronze",
//   },
//   {
//     id: "2",
//     date: "2023-12-15",
//     amount: 12000,
//     method: "bank_transfer",
//     reference: "BNK-2023121567890",
//     status: "success",
//     plan: "Brauz Bronze",
//   },
//   {
//     id: "3",
//     date: "2023-11-15",
//     amount: 12000,
//     method: "paystack",
//     reference: "PAY-2023111523456",
//     status: "success",
//     plan: "Brauz Bronze",
//   },
//   {
//     id: "4",
//     date: "2023-10-15",
//     amount: 15000,
//     method: "bank_transfer",
//     reference: "BNK-2023101534567",
//     status: "success",
//     plan: "Brauz Silver",
//   },
//   {
//     id: "5",
//     date: "2023-09-15",
//     amount: 12000,
//     method: "paystack",
//     reference: "PAY-2023091545678",
//     status: "failed",
//     plan: "Brauz Bronze",
//   },
//   {
//     id: "6",
//     date: "2023-08-15",
//     amount: 12000,
//     method: "paystack",
//     reference: "PAY-2023081556789",
//     status: "success",
//     plan: "Brauz Bronze",
//   },
//   {
//     id: "7",
//     date: "2023-07-15",
//     amount: 12000,
//     method: "bank_transfer",
//     reference: "BNK-2023071567890",
//     status: "success",
//     plan: "Brauz Bronze",
//   },
//   {
//     id: "8",
//     date: "2023-06-15",
//     amount: 12000,
//     method: "paystack",
//     reference: "PAY-2023061578901",
//     status: "pending",
//     plan: "Brauz Bronze",
//   },
// ];

// export default function PaymentHistoryPage() {
//   const [loading, setLoading] = useState(true);
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [methodFilter, setMethodFilter] = useState<string>("all");
//   const [sortField, setSortField] = useState<keyof Payment>("date");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     // Simulate loading
//     const timer = setTimeout(() => {
//       setPayments(mockPayments);
//       setLoading(false);
//     }, 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   const filteredPayments = payments
//     .filter((payment) => {
//       const matchesSearch =
//         payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         payment.plan.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus =
//         statusFilter === "all" || payment.status === statusFilter;
//       const matchesMethod =
//         methodFilter === "all" || payment.method === methodFilter;
//       return matchesSearch && matchesStatus && matchesMethod;
//     })
//     .sort((a, b) => {
//       const aValue = a[sortField];
//       const bValue = b[sortField];
//       if (sortDirection === "asc") {
//         return aValue > bValue ? 1 : -1;
//       }
//       return aValue < bValue ? 1 : -1;
//     });

//   const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
//   const paginatedPayments = filteredPayments.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   const handleSort = (field: keyof Payment) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("desc");
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       success: "bg-green-100 text-green-700 hover:bg-green-100",
//       pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
//       failed: "bg-red-100 text-red-700 hover:bg-red-100",
//     };
//     return styles[status as keyof typeof styles] || styles.pending;
//   };

//   const getMethodIcon = (method: string) => {
//     return method === "paystack" ? (
//       <CreditCard className="h-4 w-4 text-blue-600" />
//     ) : (
//       <Building2 className="h-4 w-4 text-green-600" />
//     );
//   };

//   return (
//     <div className="flex min-h-screen flex-col bg-gray-50">
//       <Header />

//       <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
//         {/* Breadcrumb */}
//         <div className="mb-8 flex items-center justify-between">
//           <div className="flex items-center space-x-2 text-sm">
//             <Link
//               href="/dashboard"
//               className="text-red-600 hover:text-red-700 font-medium transition-colors"
//             >
//               Dashboard
//             </Link>
//             <ChevronRight className="h-4 w-4 text-gray-400" />
//             <span className="text-gray-600">Payment History</span>
//           </div>
//           <Link href="/payment/make-payment">
//             <Button className="bg-red-600 hover:bg-red-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
//               Make Payment
//             </Button>
//           </Link>
//         </div>

//         <Card className="shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
//           <CardHeader className="border-b">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <CardTitle className="text-2xl font-heading">
//                 Payment History
//               </CardTitle>
//               <Button variant="outline" size="sm" className="w-fit">
//                 <Download className="h-4 w-4 mr-2" />
//                 Export
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="p-6">
//             {/* Filters */}
//             <div className="flex flex-col md:flex-row gap-4 mb-6">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by reference or plan..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 h-11"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-[140px] h-11">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="success">Success</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="failed">Failed</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={methodFilter} onValueChange={setMethodFilter}>
//                   <SelectTrigger className="w-[160px] h-11">
//                     <SelectValue placeholder="Method" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Methods</SelectItem>
//                     <SelectItem value="paystack">Paystack</SelectItem>
//                     <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="rounded-lg border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50 hover:bg-gray-50">
//                     <TableHead
//                       className="cursor-pointer select-none"
//                       onClick={() => handleSort("date")}
//                     >
//                       <div className="flex items-center space-x-1">
//                         <span>Date</span>
//                         <ArrowUpDown className="h-4 w-4" />
//                       </div>
//                     </TableHead>
//                     <TableHead>Reference</TableHead>
//                     <TableHead>Plan</TableHead>
//                     <TableHead>Method</TableHead>
//                     <TableHead
//                       className="cursor-pointer select-none"
//                       onClick={() => handleSort("amount")}
//                     >
//                       <div className="flex items-center space-x-1">
//                         <span>Amount</span>
//                         <ArrowUpDown className="h-4 w-4" />
//                       </div>
//                     </TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {loading ? (
//                     // Skeleton Loading
//                     Array.from({ length: 5 }).map((_, index) => (
//                       <TableRow key={index}>
//                         <TableCell>
//                           <Skeleton className="h-5 w-24" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-5 w-32" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-5 w-24" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-5 w-20" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-5 w-20" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-6 w-16 rounded-full" />
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : paginatedPayments.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         className="h-32 text-center text-gray-500"
//                       >
//                         No payments found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     paginatedPayments.map((payment, index) => (
//                       <TableRow
//                         key={payment.id}
//                         className="animate-in fade-in slide-in-from-left-2"
//                         style={{ animationDelay: `${index * 50}ms` }}
//                       >
//                         <TableCell className="font-medium">
//                           {new Date(payment.date).toLocaleDateString("en-GB", {
//                             day: "numeric",
//                             month: "short",
//                             year: "numeric",
//                           })}
//                         </TableCell>
//                         <TableCell className="font-mono text-sm">
//                           {payment.reference}
//                         </TableCell>
//                         <TableCell>{payment.plan}</TableCell>
//                         <TableCell>
//                           <div className="flex items-center space-x-2">
//                             {getMethodIcon(payment.method)}
//                             <span className="capitalize">
//                               {payment.method.replace("_", " ")}
//                             </span>
//                           </div>
//                         </TableCell>
//                         <TableCell className="font-semibold">
//                           ₦{payment.amount.toLocaleString()}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             className={`${getStatusBadge(
//                               payment.status,
//                             )} capitalize`}
//                           >
//                             {payment.status}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination */}
//             {!loading && filteredPayments.length > 0 && (
//               <div className="flex items-center justify-between mt-6">
//                 <p className="text-sm text-gray-600">
//                   Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                   {Math.min(
//                     currentPage * itemsPerPage,
//                     filteredPayments.length,
//                   )}{" "}
//                   of {filteredPayments.length} payments
//                 </p>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                   </Button>
//                   {Array.from({ length: totalPages }).map((_, index) => (
//                     <Button
//                       key={index}
//                       variant={
//                         currentPage === index + 1 ? "default" : "outline"
//                       }
//                       size="sm"
//                       onClick={() => setCurrentPage(index + 1)}
//                       className={
//                         currentPage === index + 1
//                           ? "bg-red-600 hover:bg-red-700"
//                           : ""
//                       }
//                     >
//                       {index + 1}
//                     </Button>
//                   ))}
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       setCurrentPage((p) => Math.min(totalPages, p + 1))
//                     }
//                     disabled={currentPage === totalPages}
//                   >
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </main>

//       <Footer />
//       <ChatWidget />
//     </div>
//   );
// }
