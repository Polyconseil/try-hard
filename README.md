# Try Hard

**tryHard** is a convenient tool when writing your Javascript tests
and you need to test asynchronous state changes with no control on the timing.  
It is particularly useful for integration tests.

## API

**tryHard** takes as a first argument a function that can fail (ie. that throws) or that can pass (ie. that doesn't throw)

It calls the function many times (by default every 25ms) until:
* it finally passes
* or it reached the timeout (by default 2 seconds), in which case it fails and rethrow the error of the inner function

**tryHard** returns a promise. You can use the .then() and .catch() to end your test.  
The easiest way is to use ES7 async/await and simply **await tryHard()** in your test

```javascript
async function tryHard(testable: Function, options?: TryHardOptions)

type TryHardOptions = {
  interval?: number, // time in milliseconds between each try
  timeout?: number, // time in milliseconds to wait before failing
}
```

## Examples

Typical example when writing an integration test:
```javascript
it('updates the application state', async () => {
  assert(myApplicationState.dataIsFetched === false);
  myApplicationState.fetchSomeData();

  await tryHard(() => {
    assert(myApplicationState.dataIsFetched === true);
  });
});
```

Very useful also when testing the DOM, here an example with [Enzyme](https://github.com/airbnb/enzyme):
```javascript
it('updates the DOM', async () => {
  assert(wrapper.find('ListOfItems').length === 0);
  myReduxStore.dispatch(fetchTheItems());

  await tryHard(() => {
    assert(wrapper.find('ListOfItems').length === 10);
  });
});
```

Old school promises also work of course :
```javascript
it('updates the application state', (done) => {
  assert(myApplicationState.dataIsFetched === false);
  myApplicationState.fetchSomeData();

  tryHard(() => {
    assert(myApplicationState.dataIsFetched === true);
  }).then(() => done()).catch(err => done(err));
});
```

## Prerequisites

You can require directly the function in src/index.js
if you are in a ES2016 environment that support async/await (or if you use Babel)

Otherwise don't forget to include regenerator-runtime:
```
npm install --save regenerator-runtime
```

And then in your entry-point:
```javascript
require('regenerator-runtime/runtime');
```
