import { isFunction } from 'underscore';
import { observable, observe, unobserve } from '@nx-js/observer-util';
import IMOG from '~/lib/imog';
import Ticker from '~/lib/imog/ticker';

export default ({ target, friction = 0.2 } = {}) => {
  const context = IMOG.getContext();
  const reactions = [];

  let targetValue;
  let _friction;

  const result = observable({ value: 0 });

  const tick = () => {
    result.value += (targetValue - result.value) * _friction;
  };

  IMOG.onSetup(() => {
    result.value = target(context.props);
    reactions.push(
      observe(() => {
        targetValue = target(context.props);
      })
    );
    if (isFunction(friction)) {
      reactions.push(
        observe(() => {
          _friction = friction(context.props);
        })
      );
    } else {
      _friction = friction;
    }
    Ticker.add(tick);
  });

  IMOG.onDestroy(() => {
    Ticker.remove(tick);
    reactions.forEach(unobserve);
  });

  return result;
};
