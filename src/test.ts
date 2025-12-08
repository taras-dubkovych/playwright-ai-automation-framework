console.log('TEST TS STARTED');

const add = (a: number, b: number): number => {
  console.log(`Adding ${a} + ${b}`);
  return a + b;
};

console.log('Result =', add(2, 3));
console.log('TEST TS FINISHED');
