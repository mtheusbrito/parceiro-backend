/* eslint-disable no-console */
import * as Yup from 'yup';
import Address from '../../models/Address';
import Client from '../../models/Client';
import User from '../../models/User';

class ClientController {
  async index(req, res) {
    const budgets = await Client.findAll({ include: [{ all: true }] });
    return res.json(budgets);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cnpj: Yup.string().required(),
      company: Yup.string().required(),
      obs: Yup.string().required(),
      user_id: Yup.number().required(),
      addresses: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required(),
          city: Yup.string().required(),
          number: Yup.string().required(),
          state_registration: Yup.string().required(),
          complement: Yup.string().required(),
          google_maps: Yup.string().required(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const user_database = await User.findByPk(req.body.user_id);
    if (!user_database) {
      return res.status(404).json({ error: 'Este usuário não existe. ' });
    }
    // const { addresses } = req.body;
    const client = await Client.create(req.body, {
      include: { model: Address, as: 'addresses' },
    });
    // await client.addAddress();
    // await Promise.all(
    //   addresses.map(async (address) => {
    //     const results = await Address.create(address);
    //     const response = await client.addAddress(results);
    //     return response;
    //   })
    // );
    return res.json(client);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      cnpj: Yup.string().required(),
      company: Yup.string().required(),
      obs: Yup.string().required(),
      user_id: Yup.number().required(),
      addresses: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.number(),
            name: Yup.string().required(),
            city: Yup.string().required(),
            number: Yup.string().required(),
            state_registration: Yup.string().required(),
            complement: Yup.string().required(),
            google_maps: Yup.string().required(),
          })
        )
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const user_database = await User.findByPk(req.body.user_id);
    if (!user_database) {
      return res.status(404).json({ error: 'Este usuário não existe. ' });
    }
    // const { id, name, cnpj, company, obs, user_id } = ;

    const client_database = await Client.findByPk(req.body.id, {
      include: { model: Address, as: 'addresses' },
    });
    const addresses_request = req.body.addresses;
    const addresses_database = await client_database.getAddresses();

    await Promise.all(
      addresses_database.map(async (address) => {
        const deleted = addresses_request.find((a) => a.id === address.id);
        if (!deleted) {
          await client_database.removeAddress(address);
        }
        return deleted;
      })
    );
    await Promise.all(
      addresses_request.map(async (address) => {
        if (address.id !== null && address.id !== undefined) {
          const address_exist = await Address.findByPk(address.id);
          if (address_exist) {
            const {
              name,
              city,
              number,
              state_registration,
              complement,
              google_maps,
            } = address;
            await address_exist.update({
              name,
              city,
              number,
              state_registration,
              complement,
              google_maps,
            });
          }
        } else {
          await client_database.createAddress(address);
        }
      })
    );
    const { id, name, cnpj, company, obs, user_id } = req.body;

    await client_database.update({
      id,
      name,
      cnpj,
      company,
      obs,
      user_id,
    });

    const client_response = await Client.findByPk(id, {
      include: { model: Address, as: 'addresses' },
    });

    return res.json(client_response);

    // await Promise.all(
    //   addresses.map(async (address) => {
    //     const results = await Address.create(address);
    //     const response = await client.addAddress(results);
    //     return response;
    //   })
    // );
  }
}
export default new ClientController();
