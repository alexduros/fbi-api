import assert from 'assert';
import { authenticateFBISession } from '../src/auth.js';
import { getAppointmentsByDate } from '../src/appointments.js';
import { username, password } from './credentials';

describe('Appointments', () => {
  describe('List appointements by date', () => {
    it('should retrieve appointments given valid dates', (done) => {
      authenticateFBISession({ username, password })
        .then(({ sessionId }) =>
          getAppointmentsByDate(sessionId)({
            startDate: '01/01/2018',
            endDate: '30/06/2018',
          }))
        .then(games => {
          assert(games.length > 0);
          done();
        });
    }).timeout('2s');
  });
});
