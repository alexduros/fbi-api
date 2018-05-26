import assert from 'assert';
import { createFBISession, authenticateFBISession } from '../src/auth.js';
import { username, password } from './credentials';

describe('Authentication', () => {
  describe('Create a session', () => {
    it('should creates a session on FBI website', (done) => {
      createFBISession().then(({ sessionId }) => {
        assert(!!sessionId);
        done();
      });
    });
    it('should get a redirect to home if authentication is successful', (done) => {
      authenticateFBISession({
        username,
        password
      }).then(({ sessionId }) => {
        assert(!!sessionId);
        done();
      })
    });
  })
})