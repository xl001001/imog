import { observable } from '@nx-js/observer-util';
import IMOG from '~/lib/imog';

export default ({ normalized = false } = {}) => {
  const result = observable({ x: 0, y: 0 });

  const onMouseMove = ({ pageX, pageY }) => {
    const x = pageX - innerWidth / 2;
    const y = -pageY + innerHeight / 2;

    if (!normalized) {
      result.x = x;
      result.y = y;
    } else {
      result.x = x / innerWidth;
      result.y = y / innerHeight;
    }
  };

  IMOG.onSetup(() => {
    window.addEventListener('mousemove', onMouseMove);
  });
  IMOG.onDestroy(() => {
    window.removeEventListener('mousemove', onMouseMove);
  });

  return result;
};
