import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Passoword does not macth' });
    }
    const { id, name, email, admin } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        admin,
      },
      token: jwt.sign({ id, admin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessionController();
