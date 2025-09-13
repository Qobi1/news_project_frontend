import { useState, useEffect } from 'react';

export function useHydration() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

// Alternative approach: use a more robust hydration check
export function useIsomorphicLayoutEffect(callback: () => void, deps: any[]) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      callback();
    }
  }, [mounted, ...deps]);

  return mounted;
}
