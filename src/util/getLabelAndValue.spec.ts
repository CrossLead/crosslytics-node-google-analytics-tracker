import test from 'ava';
import { TrackedEvent } from 'crosslytics';
import { getLabelAndValue } from './getLabelAndValue';

interface LightsaberArgs {
  'Blades'?: number;
  'Color'?: string;
  'Inscription'?: string;
}

class LightsaberBuilt implements TrackedEvent<LightsaberArgs> {
  public name = 'Lightsaber Built';
  public category = 'Lightsabers';
  public argPriority = new Array<keyof LightsaberArgs>('Inscription', 'Color', 'Blades');
  constructor(public args: LightsaberArgs) {}
}

test('Should use first number arg as value', (t) => {
  const inscription = `Obi-wan's lightsaber`;
  const event = new LightsaberBuilt({
    Blades: 2,
    Color: 'Blue',
    Inscription: inscription,
  });

  const labelAndVal = getLabelAndValue(event);
  t.is(labelAndVal[0], inscription);
  t.is(labelAndVal[1], 2);
});

test('Should work for label but no val', (t) => {
  const event = new LightsaberBuilt({
    Inscription: 'Legendary',
  });

  const labelAndVal = getLabelAndValue(event);
  t.is(labelAndVal[0], 'Legendary');
  t.is(labelAndVal[1], undefined);
});

test('Should work for val but no label', (t) => {
  const event = new LightsaberBuilt({
    Blades: 1,
  });

  const labelAndVal = getLabelAndValue(event);
  t.is(labelAndVal[0], undefined);
  t.is(labelAndVal[1], 1);
});

test('Should work for no args', (t) => {
  const event = new LightsaberBuilt({});

  const labelAndVal = getLabelAndValue(event);
  t.is(labelAndVal[0], undefined);
  t.is(labelAndVal[1], undefined);
});
