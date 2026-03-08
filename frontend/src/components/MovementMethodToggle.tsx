import { MovementMethod } from '@/constants/movementMethod';
import useMapStore from '@/stores/useMapStore';

const METHODS = [MovementMethod.Teleport, MovementMethod.Route] as const;

function MovementMethodToggle() {
  const { movementMethod, setMovementMethod } = useMapStore();

  return (
    <div className="absolute right-2 top-2 z-[1000] flex overflow-hidden rounded-lg shadow-md ring-1 ring-black/10">
      {METHODS.map((method) => (
        <button
          key={method}
          onClick={() => setMovementMethod(method)}
          className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-colors ${
            movementMethod === method
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {method}
        </button>
      ))}
    </div>
  );
}

export default MovementMethodToggle;
