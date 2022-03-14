import { isFunction } from 'underscore';
import { observable, observe, unobserve } from '@nx-js/observer-util';
import { clamp } from '~/lib/math';
import IMOG from '~/lib/imog';

export default ({ bounds = { x: null, y: null } } = {}) => {
  const context = IMOG.getContext();
  const reactions = [];

  let dragTouchOrigin = { x: 0, y: 0 };
  let dragValOrigin = { x: 0, y: 0 };

  const result = observable({
    dragging: false,
    x: 0,
    y: 0,
    bounds: isFunction(bounds) ? null : bounds,
  });

  IMOG.onSetup(() => {
    if (isFunction(bounds)) {
      reactions.push(
        observe(() => {
          result.bounds = bounds(context.props);
        })
      );
    }
  });

  IMOG.onDestroy(() => {
    reactions.forEach(unobserve);
  });

  const onTouchStart = ({ touches }) => {
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    result.dragging = true;

    const { pageX, pageY } = touches[0];
    dragTouchOrigin = { x: pageX, y: pageY };
    dragValOrigin = { x: result.x, y: result.y };
  };

  const onTouchMove = ({ touches }) => {
    const { pageX, pageY } = touches[0];
    const current = { x: pageX, y: pageY };
    const diff = {
      x: current.x - dragTouchOrigin.x,
      y: current.y - dragTouchOrigin.y,
    };
    result.x = result.bounds.x
      ? clamp(dragValOrigin.x - diff.x, result.bounds.x[0], result.bounds.x[1])
      : dragValOrigin.x - diff.x;
    result.y = result.bounds.y
      ? clamp(dragValOrigin.y + diff.y, result.bounds.y[0], result.bounds.y[1])
      : dragValOrigin.y + diff.y;
  };

  const onTouchEnd = () => {
    result.dragging = false;
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  };

  IMOG.onSetup(() => {
    window.addEventListener('touchstart', onTouchStart);
  });

  IMOG.onDestroy(() => {
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  });

  return result;
};
