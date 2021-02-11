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
    const { name, cnpj, obs, company, user_id, addresses } = req.body;
    const client = await Client.create(
      {
        name,
        cnpj,
        obs,
        company,
        user_id,
        addresses,
      },
      {
        include: {
          model: Address,
          as: 'addresses',
        },
      }
    );
    return res.json(client);
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     id: Yup.number().required(),
  //     name: Yup.string().required(),
  //     cnpj: Yup.string().required(),
  //     company: Yup.string().required(),
  //     obs: Yup.string().required(),
  //     user_id: Yup.number().required(),
  //     addresses: Yup.array()
  //       .of(
  //         Yup.object().shape({
  //           id: Yup.number(),
  //           name: Yup.string().required(),
  //           city: Yup.string().required(),
  //           number: Yup.string().required(),
  //           state_registration: Yup.string().required(),
  //           complement: Yup.string().required(),
  //           google_maps: Yup.string().required(),
  //         })
  //       )
  //       .required(),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'Validadion fails' });
  //   }

  //   const user_database = await User.findByPk(req.body.user_id);
  //   if (!user_database) {
  //     return res.status(404).json({ error: 'Este usuário não existe. ' });
  //   }

  //   const client_database = await Client.findOne({
  //     id: req.body.id,
  //     include: [{ model: Address, as: 'addresses' }],
  //   });
  //   //   {
  //   //     where: { id: req.body.id },
  //   //   },
  //   //   {
  //   //     include: [
  //   //       {
  //   //         model: Address,
  //   //         as: 'addresses',
  //   //       },
  //   //     ],
  //   //   }
  //   // );
  //   if (!client_database) {
  //     return res.status(404).json({ error: 'Este cliente não existe. ' });
  //   }

  //   // const { addresses } = req.body;
  //   console.log(client_database);
  //   return res.json(client_database);
  //   // const client = await client_database.update(req.body, {
  //   //   include: [
  //   //     {
  //   //       model: Address,
  //   //       as: 'addresses',
  //   //     },
  //   //   ],
  //   // });
  //   // return res.json(client);
  // }
}
export default new ClientController();
