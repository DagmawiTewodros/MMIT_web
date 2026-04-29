import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AdminAuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "not-admin"; session: Session }
  | { status: "admin"; session: Session };

/**
 * Hook: returns auth + admin-role status, kept in sync with auth changes.
 * Always sets up onAuthStateChange BEFORE getSession (per Supabase guidance).
 */
export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({ status: "loading" });

  useEffect(() => {
    let mounted = true;

    const checkRole = async (session: Session | null) => {
      if (!session) {
        if (mounted) setState({ status: "unauthenticated" });
        return;
      }
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (!mounted) return;
      if (error || !data) {
        setState({ status: "not-admin", session });
      } else {
        setState({ status: "admin", session });
      }
    };

    // 1) Subscribe FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer Supabase calls (avoid deadlock per docs)
      setTimeout(() => checkRole(session), 0);
    });

    // 2) Then check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkRole(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
