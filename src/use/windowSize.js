import { observable } from '@nx-js/observer-util';
import IMOG from '~/lib/imog';

export default () => {
  const result = observable({ width: innerWidth, height: innerHeight });

  const resize = () => {
    result.width = innerWidth;
    result.height = innerHeight;
  };

  IMOG.onSetup(() => {
    window.addEventListener('resize', resize, false);
  });
  IMOG.onDestroy(() => {
    window.removeEventListener('resize', resize, false);
  });

  return result;
};
