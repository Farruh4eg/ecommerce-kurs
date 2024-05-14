const api = 'https://ecommerce-kurs.vercel.app/v1';

describe('app unit tests', () => {
  describe('users GET endpoint', () => {
    it("should get existing user's info", async () => {
      const existinguserid = '53efdb65-f10c-4660-8293-01c362ec147a';
      const response = await fetch(`${api}/user?q=${existinguserid}`);
      const data = await response.json();
      expect(data).toBeTruthy();
    });

    it('get non-existing user info', async () => {
      const userid = 'some-string';
      const response = await fetch(`${api}/user?q=${userid}`);
      const data = await response.json();
      expect(data).toBeFalsy();
    });
  });

  describe('users POST endpoint', () => {
    it('should create a user', async () => {
      const crypto = require('crypto');
      const username = crypto.randomBytes(20).toString('hex');
      const password = '12345678';

      const response = await fetch(`${api}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      expect(response.status).toEqual(200);
    });

    it('should not create user with existing username', async () => {
      const username = 'Farruh4eg';
      const password = '11111111';

      const response = await fetch(`${api}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      expect(response.status).toEqual(409);
    });
  });

  describe('users DELETE endpoint', () => {
    it('should not let delete a user to a non-admin user', async () => {
      const userid = '2c0635ba-86f7-4361-84cf-2b25ee2c0061';

      const response = await fetch(`${api}/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(response.status).toEqual(403);
    });
  });
});
