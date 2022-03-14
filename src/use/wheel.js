import { observable } from '@nx-js/observer-util';
import IMOG from '~/lib/imog';
import { clamp } from '~/lib/math';

export default ({ min = -Infinity, max = +Infinity, mult = 1 } = {}) => {
  const result = observable({ y: 0 });

  const onWheel = ({ deltaY }) => {
    result.y = clamp(result.y + deltaY * mult, min, max);
  };

  IMOG.onSetup(() => {
    window.addEventListener('wheel', onWheel, false);
  });
  IMOG.onDestroy(() => {
    window.removeEventListener('wheel', onWheel, false);
  });

  return result;
};
