/* eslint-disable no-console */
import * as Yup from 'yup';
import Sequelize from 'sequelize';
import Address from '../../models/Address';
import Client from '../../models/Client';
import User from '../../models/User';
import databaseConfig from '../../../config/database';

const { QueryTypes } = require('sequelize');

const sequelize = new Sequelize(databaseConfig);

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
    console.log(
      '--------------------------------------------------------------------------------'
    );
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const user_database = await User.findByPk(req.body.user_id);
    if (!user_database) {
      return res.status(404).json({ error: 'Este usuário não existe. ' });
    }
    const { id, name, cnpj, company, obs, user_id } = req.body;
    const client_database = await Client.findByPk(id, {
      include: { model: Address, as: 'addresses' },
    });

    if (!client_database) {
      return res.status(404).json({ error: 'Este cliente não existe. ' });
    }

    async function removeAddress(address) {
      console.log(`a ser removido${address.id}`);
      await Address.destroy({ where: { id: address.id } });
    }
    async function createOrUpdate(address, client_id) {
      // a ser criado out atualizado
      console.log(`a ser criado out atualizado${address.id}`);

      try {
        const address_database = await Address.findByPk(address.id);
        if (address_database) {
          address_database.update(address);
        } else {
          const response = await Address.create(address);
          if (response) {
            // const { address_id } = response.id;

            const address_id = response.id;
            const address_client = await sequelize.query(
              `INSERT INTO \`address_clients\` (\`client_id\`,\`address_id\`,\`created_at\`,\`updated_at\`) VALUES (${client_id},${address_id},now(),now());`,
              {
                type: QueryTypes.INSERT,
              }
            );
            if (address_client) {
              console.log('persistiu');
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    const addresses_request = req.body.addresses;
    const addresses_database = client_database.addresses;
    // pesquisando os enderecos do banco e verificando se estao na query de update, caso
    // não esteja signnifica que o usuario removeu
    if (addresses_database !== null && addresses_database.length > 0) {
      addresses_database.forEach((address) => {
        const resp = addresses_request.find((a) => a.id === address.id);
        // console.log(resp);
        if (!resp) {
          removeAddress(address);
        }
      });
    }
    addresses_request.forEach((address) => {
      createOrUpdate(address, client_database.id);
    });

    // return res.json(addresses_request);

    const client = await client_database.update(
      { id, name, cnpj, company, obs, user_id },
      {
        include: [
          {
            model: Address,
            as: 'addresses',
          },
        ],
      }
    );
    return res.json(client);
  }
}
export default new ClientController();
