import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      return;
    }

    try {
      const users = dbClient.db.collection('users');
      const user = await users.findOne({ email });

      if (user) {
        response.status(400).json({ error: 'Already exist' });
      }
      const hashedPassword = sha1(password);
      const result = await users.insertOne({ email, password: hashedPassword });

      response.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = UsersController;
