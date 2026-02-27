import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const useDebounceEffect = (effect: EffectCallback, deps: DependencyList, delay: number) => {
  const effectRef = useRef<EffectCallback>(effect);
  effectRef.current = effect;

  useEffect(() => {
    const timer = setTimeout(() => {
      effectRef.current();
    }, delay);

    return () => clearTimeout(timer);
  }, [...deps, delay]);
};

export default useDebounceEffect;
