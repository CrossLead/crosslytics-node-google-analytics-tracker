import { TrackedEvent } from 'crosslytics';
import { isNumber } from 'util';

export function getLabelAndValue<T>(event: TrackedEvent<T>): [string, number] {
  const ret: [string, number] = [undefined, undefined];
  // Find suitable args for Label and Value
  const argPri = event.argPriority;
  if (argPri.length > 0) {
    // Anything can become Label
    const label = event.args[argPri[0]];
    if (label !== undefined) {
      ret[0] = String(label);
    }
  }

  if (argPri.length > 1) {
    for (let i = 1; i < argPri.length; i++) {
      const argVal = event.args[argPri[i]];
      if (isNumber(argVal)) {
        ret[1] = argVal;
        break;
      }
    }
  }
  return ret;
}
