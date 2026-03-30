// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          const res = await axios.post(
            "/api/auth/refresh",
            {},
            { withCredentials: true },
          );
          if (res.data.success) {
            localStorage.setItem("access_token", res.data.data.accessToken);
            setUser(res.data.data.user);
          } else {
            router.push("/login");
          }
        } else {
          setUser({}); // or fetch user info if you want
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { user, loading };
}
