import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase } from "../../lib/supabase";

export const ProtectedRoute = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Could use a proper loader component here
  }

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};