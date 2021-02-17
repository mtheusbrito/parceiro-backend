import * as Yup from 'yup';

import User from '../../models/User';
import File from '../../models/File';
import Address from '../../models/Address';
import Pix from '../../models/Pix';
import BankAccount from '../../models/BankAccount';

const { Op } = require('sequelize');

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      include: { model: File, as: 'avatar' },
    });
    return res.json(users);
  }

  async show(req, res) {
    const user_exist = await User.findByPk(req.params.id, {
      include: [
        { model: Address, as: 'addresses' },
        { model: Pix, as: 'pixes' },
        { model: BankAccount, as: 'accounts' },
      ],
    });
    if (!user_exist) {
      return res.status(400).json({ error: 'Usuário não encontrado!' });
    }
    const {
      id,
      name,
      login,
      email,
      admin,
      cpf,
      rg,
      phone,
      addresses,
      accounts,
      pixes,
      ativo,
    } = user_exist;
    return res.json({
      id,
      name,
      login,
      email,
      admin,
      ativo,
      cpf,
      rg,
      phone,
      addresses,
      accounts,
      pixes,
    });
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
      addresses: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required(),
            city: Yup.string().required(),
            number: Yup.string().required(),
            state_registration: Yup.string(),
            cep: Yup.string().required(),
            complement: Yup.string(),
            google_maps: Yup.string(),
          })
        )
        .required(),
      accounts: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required(),
            type: Yup.string().required(),
            agency: Yup.string().required(),
            number: Yup.string().required(),
            operation: Yup.string(),
          })
        )
        .required(),
      pixes: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required(),
        })
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const login_exist = await User.findOne({
      where: { login: { [Op.like]: `%${req.body.login}%` } },
    });
    if (login_exist) {
      return res.status(404).json({ error: 'Este login já esta em uso. ' });
    }

    const user = await User.create(req.body, {
      include: [
        { model: Address, as: 'addresses' },
        { model: Pix, as: 'pixes' },
        { model: BankAccount, as: 'accounts' },
      ],
    });
    return res.json(user);
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
      password: Yup.string().notRequired().min(6),
      ativo: Yup.boolean().required(),
      admin: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const user_database = await User.findByPk(req.body.id, {
      include: [
        { model: Address, as: 'addresses' },
        { model: Pix, as: 'pixes' },
        { model: BankAccount, as: 'accounts' },
      ],
    });

    if (!user_database) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    // const id_request = req.body.id;
    const login_request = req.body.login;

    const login_exist = await User.findOne({
      where: {
        login: { [Op.like]: `%${login_request}%` },
      },
    });
    if (login_exist) {
      if (login_exist.id !== parseInt(req.body.id, 10)) {
        return res.status(404).json({ error: 'Este login já esta em uso. ' });
      }
    }

    const {
      addresses: addresses_request,
      pixes: pixes_request,
      accounts: accounts_request,
    } = req.body;
    // atualizar enderecos
    const addresses_database = await user_database.getAddresses();
    if (addresses_database.length > 0) {
      await Promise.all(
        addresses_database.map(async (address) => {
          const deleted = addresses_request.find((a) => a.id === address.id);
          if (!deleted) {
            await user_database.removeAddress(address);
          }
          return deleted;
        })
      );
    }
    const pixes_database = await user_database.getPixes();
    if (pixes_database.length > 0) {
      await Promise.all(
        pixes_database.map(async (pix) => {
          if (pixes_request) {
            const deleted = pixes_request.find((p) => p.id === pix.id);
            if (!deleted) {
              await user_database.removePix(pix);
              // return deleted;
            }
          }
        })
      );
    }
    const accounts_database = await user_database.getAccounts();
    if (accounts_database.length > 0) {
      await Promise.all(
        accounts_database.map(async (account) => {
          const deleted = accounts_request.find((a) => a.id === account.id);
          if (!deleted) {
            await user_database.removeAccount(account);
          }
          return deleted;
        })
      );
    }

    if (addresses_request) {
      await Promise.all(
        addresses_request.map(async (address) => {
          if (address.id !== null && address.id !== undefined) {
            const address_exist = await Address.findByPk(address.id);
            if (address_exist) {
              await address_exist.update(address);
            }
          } else {
            await user_database.createAddress(address);
          }
        })
      );
    }

    if (pixes_request) {
      await Promise.all(
        pixes_request.map(async (pix) => {
          if (pix.id !== null && pix.id !== undefined) {
            const pix_exist = await Pix.findByPk(pix.id);
            if (pix_exist) {
              await pix_exist.update(pix);
            }
          } else {
            await user_database.createPix(pix);
          }
        })
      );
    }
    if (accounts_request) {
      await Promise.all(
        accounts_request.map(async (account) => {
          if (account.id !== null && account.id !== undefined) {
            const account_exist = await BankAccount.findByPk(account.id);
            if (account_exist) {
              await account_exist.update(account);
            }
          } else {
            await user_database.createAccount(account);
          }
        })
      );
    }

    await user_database.update(req.body);

    const {
      id,
      name,
      login,
      email,
      admin,
      cpf,
      rg,
      phone,
      addresses,
      accounts,
      pixes,
      ativo,
    } = await User.findByPk(user_database.id, {
      include: [
        { model: Address, as: 'addresses' },
        { model: Pix, as: 'pixes' },
        { model: BankAccount, as: 'accounts' },
      ],
    });

    return res.json({
      id,
      name,
      login,
      email,
      admin,
      cpf,
      rg,
      phone,
      addresses,
      accounts,
      pixes,
      ativo,
    });
  }
}
export default new UserController();
