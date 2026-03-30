import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface UserProfileCardProps {
  userName: string;
  loginId: string;
  accountId: string;
  lastLogin: string;
  avatarUrl?: string;
}

export function UserProfileCard({
  userName,
  loginId,
  accountId,
  lastLogin,
  avatarUrl,
}: UserProfileCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-heading text-gray-700">
          User profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar + Welcome */}
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={avatarUrl || "/images/profile.png"}
              alt={userName}
            />
            <AvatarFallback className="text-xl">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <h3 className="text-xl font-heading font-semibold text-gray-900">
              {userName}
            </h3>
          </div>
        </div>

        {/* User Info – no borders, clean spacing */}
        <div className="space-y-4 pt-2">
          {/* Login ID and Account ID labels on same row */}
          <div className="flex justify-between items-start gap-8">
            <div>
              <span className="text-sm text-gray-600 font-medium">
                Login ID:
              </span>
              {/* No value next to Login ID */}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 font-medium">
                Account ID:
              </span>
              <span className="text-sm font-mono text-gray-900 mt-1">
                {accountId}
              </span>
            </div>
          </div>

          {/* Last Login – separate line below */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">
              Last Login:
            </span>
            <span className="text-sm font-medium text-gray-900 italic">
              {lastLogin}
            </span>
          </div>
        </div>

        {/* View Profile Button – restored original blue color, left-aligned, rounded */}
        <div className="pt-2">
          <Link href="/profile">
            <Button
              className="
                rounded-md px-6 py-2 
                bg-blue-500 hover:bg-blue-600 text-white 
                font-ui group transition-all 
                hover:scale-[1.02] active:scale-[0.98]
              "
            >
              View profile
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
