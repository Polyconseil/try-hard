import 'regenerator-runtime/runtime';
import assert from 'assert';
import tryHard from '../src';

describe('When using promises', () => {
  it('it detects when it is already OK', (done) => {
    const myVar = true;

    tryHard(() => {
      assert.ok(myVar);
    }).then(() => done()).catch((err) => done(err));
  });

  it('it detects when it becomes OK', (done) => {
    let myVar = false;
    setTimeout(() => myVar = true, 100);

    tryHard(() => {
      assert.ok(myVar);
    }).then(() => done()).catch((err) => done(err));
  });

  it('it fails when it waited too long', (done) => {
    let myVar = false;
    setTimeout(() => myVar = true, 1000);

    tryHard(() => {
      assert.ok(myVar);
    }, {timeout: 500}).then(() => done(new Error('It should not have passed'))).catch((err) => done());
  });
});

describe('When using async/await', () => {
  it('it detects when it is already OK', async () => {
    const myVar = true;

    await tryHard(() => {
      assert.ok(myVar);
    });
  });

  it('it detects when it becomes OK', async () => {
    let myVar = false;
    setTimeout(() => myVar = true, 100);

    await tryHard(() => {
      assert.ok(myVar);
    });
  });

  it('it fails when it waited too long', async () => {
    let myVar = false;
    setTimeout(() => myVar = true, 1000);

    try {
      await waitUntilItPasses(() => {
        assert.ok(myVar);
      }, {timeout: 500});
    } catch (err) {
      return; // It worked ! (because it timeouted)
    }

    assert.fail('It should have timeouted above');
  });

  it('it can wait for async testables that goes OK', async () => {
    await tryHard(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 200);
      });
    });
  });

  it('it can wait for async testables that goes KO', async () => {
    try {
      await tryHard(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => reject('Rejected !'), 10);
        });
      }, {timeout: 500});
    } catch (err) {
      return; // It worked ! (because it timeouted)
    }

    assert.fail('It should have timeouted above');
  });
});
