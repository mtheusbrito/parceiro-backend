import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';
import Address from '../models/Address';
import Pix from '../models/Pix';
import BankAccount from '../models/BankAccount';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const { login, password } = req.body;

    const user = await User.findOne({
      where: { login },
      include: [
        { model: Address, as: 'addresses' },
        { model: Pix, as: 'pixes' },
        { model: BankAccount, as: 'accounts' },
      ],
    });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado!' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta!' });
    }
    const {
      id,
      name,
      email,
      cpf,
      rg,
      phone,
      admin,
      addresses,
      pixes,
      accounts,
    } = user;

    return res.json({
      profile: {
        id,
        name,
        email,
        cpf,
        rg,
        login,
        phone,
        admin,
        addresses,
        pixes,
        accounts,
      },
      token: jwt.sign({ id, admin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessionController();
