import { OUTLAW_PERSONALITIES_ARR } from '../constants/textLoopups';

export default function boostLookup(outlawsPersonalityArray) {
  if (!outlawsPersonalityArray || outlawsPersonalityArray?.length == 0) {
    return {
      boostType: 'NONE',
      boostBp: 0,
    };
  }
  console.log(outlawsPersonalityArray);
  if (
    OUTLAW_PERSONALITIES_ARR.every((id) => outlawsPersonalityArray.includes(id))
  ) {
    return {
      boostType: 'STRAIGHT',
      boostBp: 40000,
    };
  }

  if (outlawsPersonalityArray.length == 0) {
    return {
      boostType: 'NONE',
      boostBp: 0,
    };
  }

  let sortedIds = outlawsPersonalityArray.slice().sort();
  let highestFreq = [sortedIds[0], 1];
  let i = 1;
  sortedIds.reduce((prev, curr) => {
    prev == curr ? ++i > highestFreq[1] && (highestFreq = [curr, i]) : (i = 1);
    return curr;
  });

  if (highestFreq[1] == 1) {
    return {
      boostType: 'SINGLE',
      boostBp: 2500,
    };
  }

  if (highestFreq[1] == 2) {
    return {
      boostType: 'DOUBLE',
      boostBp: 5000,
    };
  }

  if (highestFreq[1] == 3) {
    return {
      boostType: '3 OF A KIND',
      boostBp: 10000,
    };
  }

  if (highestFreq[1] == 4) {
    return {
      boostType: '4 OF A KIND',
      boostBp: 20000,
    };
  }

  if (highestFreq[1] == 5) {
    return {
      boostType: '5 OF A KIND',
      boostBp: 30000,
    };
  }

  return {
    boostType: 'NONE',
    boostBp: 0,
  };
}
