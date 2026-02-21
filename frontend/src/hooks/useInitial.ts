import useMount from './useMount';

import { useLocationStore } from '@/stores/useLocationStore';

const useInitial = () => {
  useMount(() => {
    // 這裡可以放一些初始化的邏輯，例如載入使用者位置、設定全局狀態等
    console.log('App initialized');

    useLocationStore.getState().init(); // 初始化位置資訊
  });
};

export default useInitial;
