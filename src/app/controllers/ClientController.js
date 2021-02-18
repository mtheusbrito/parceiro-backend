/* eslint-disable no-console */
import * as Yup from 'yup';
import Address from '../models/Address';
import Client from '../models/Client';

class ClientController {
  async index(req, res) {
    const clients = await Client.findAll({
      where: { user_id: req.userId },
      include: { model: Address, as: 'addresses' },
    });
    return res.json(clients);
  }

  async show(req, res) {
    const client_database = await Client.findByPk(req.params.id, {
      include: { model: Address, as: 'addresses' },
    });
    if (!client_database) {
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }
    if (client_database.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: `Não autorizado!${client_database}` });
    }
    return res.json(client_database);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cnpj: Yup.string().required(),
      phone: Yup.string(),
      company: Yup.string(),
      obs: Yup.string(),
      addresses: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required(),
          city: Yup.string().required(),
          cep: Yup.string().required(),
          number: Yup.string().required(),
          state_registration: Yup.string(),
          complement: Yup.string().required(),
          google_maps: Yup.string(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const client = await Client.create(
      { user_id: req.userId, ...req.body },
      {
        include: { model: Address, as: 'addresses' },
      }
    );
    return res.json(client);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      cnpj: Yup.string().required(),
      phone: Yup.string(),
      company: Yup.string(),
      obs: Yup.string(),
      addresses: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required(),
          city: Yup.string().required(),
          cep: Yup.string().required(),
          number: Yup.string().required(),
          state_registration: Yup.string(),
          complement: Yup.string().required(),
          google_maps: Yup.string(),
        })
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const client_database = await Client.findByPk(req.body.id, {
      include: { model: Address, as: 'addresses' },
    });

    if (!client_database) {
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }
    if (client_database.user_id !== req.userId) {
      return res.status(400).json({ error: 'Não autorizado!' });
    }

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
            await address_exist.update(address);
          }
        } else {
          await client_database.createAddress(address);
        }
      })
    );

    await client_database.update(req.body);

    const client_response = await Client.findByPk(client_database.id, {
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

  async destroy(req, res) {
    const client_database = await Client.findByPk(req.params.id);
    if (!client_database) {
      return res.status(400).json({ error: 'Cliente não encontrado.' });
    }

    if (client_database.user_id !== req.userId) {
      return res.status(400).json({ error: 'Não autorizado!' });
    }

    await client_database.destroy();
    return res.status(204).send();
  }
}
export default new ClientController();
