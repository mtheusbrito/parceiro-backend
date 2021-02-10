import * as Yup from 'yup';
import User from '../../models/User';
import File from '../../models/File';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      include: { model: File, as: 'avatar' },
    });
    return res.json(users);
  }

  async destroy(req, res) {
    const user_exist = await User.findByPk(req.params.id);
    if (!user_exist) {
      return res.status(400).json({ error: 'User not exists. ' });
    }
    await user_exist.destroy();
    return res.status(204).send();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      login: Yup.string().required(),
      cpf: Yup.string().required(),
      rg: Yup.string().required(),
      phone: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      ativo: Yup.boolean().required(),
      admin: Yup.boolean().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const user_exist = await User.findOne({ where: { login: req.body.login } });
    if (user_exist) {
      return res.status(400).json({ error: 'User already exists. ' });
    }
    const {
      id,
      name,
      login,
      email,
      cpf,
      rg,
      phone,
      admin,
      ativo,
    } = await User.create(req.body);
    return res.json({ id, name, login, email, cpf, rg, phone, admin, ativo });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      login: Yup.string().required(),
      cpf: Yup.string().required(),
      rg: Yup.string().required(),
      phone: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6),
      ativo: Yup.boolean().required(),
      admin: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const user = await User.findByPk(req.body.id);

    if (!user) {
      return res.status(404).json({ error: 'User not exists. ' });
    }
    const user_database = await User.findOne({
      where: { login: req.body.login },
    });
    if (user_database) {
      return res.status(404).json({ error: 'User login exists. ' });
    }

    const {
      id,
      name,
      login,
      email,
      cpf,
      rg,
      phone,
      admin,
      ativo,
    } = await user.update(req.body);

    return res.json({
      id,
      name,
      login,
      email,
      cpf,
      rg,
      phone,
      admin,
      ativo,
    });
  }
}
export default new UserController();
