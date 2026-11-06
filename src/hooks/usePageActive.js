import { useEffect, useRef } from "react";
export function usePageActive(id = "page") {
  const active = useRef(null);
  useEffect(() => { active.current = id; return () => { active.current = null; }; }, [id]);
  return active;
}
