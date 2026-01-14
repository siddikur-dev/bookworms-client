'use client';

import { useContext, useEffect } from "react";
import { AuthContext } from "@/providers/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { HashLoader } from "react-spinners";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // লগইন না থাকলে লগইন পেজে পাঠাবে এবং আগের লোকেশন মনে রাখবে
      router.push(`/login?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <HashLoader size={80} color="#2d5a27" />
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default PrivateRoute;