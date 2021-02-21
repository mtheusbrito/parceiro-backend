import * as Yup from 'yup';
import Address from '../models/Address';
import BankAccount from '../models/BankAccount';
import Pix from '../models/Pix';
import User from '../models/User';

const { Op } = require('sequelize');

class ProfileController {
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      login: Yup.string().required(),
      cpf: Yup.string().required(),
      rg: Yup.string().required(),
      phone: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().notRequired().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const user_database = await User.findByPk(req.userId, {
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
      if (login_exist.id !== parseInt(req.userId, 10)) {
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

export default new ProfileController();
