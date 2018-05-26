import assert from 'assert';
import { createFBISession } from '../src/auth.js';

describe('Authentication', () => {
  describe('Create a session', () => {
    it('should creates a session on FBI website', (done) => {
      createFBISession().then(({ cookie }) => {
        assert(!!cookie);
        done();
      });
    }).timeout('5s');
  })
})