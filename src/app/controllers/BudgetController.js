import * as Yup from 'yup';
import Mail from '../../lib/Mail';
import Address from '../models/Address';
import Budget from '../models/Budget';
import Client from '../models/Client';
import StatusBudget from '../models/StatusBudget';
import User from '../models/User';

class BudgetController {
  async show(req, res) {
    const budget = await Budget.findByPk(req.params.id, {
      include: [
        { model: StatusBudget, as: 'status' },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Address, as: 'address' },
        {
          model: Client,
          as: 'client',
          include: { model: Address, as: 'addresses' },
        },
      ],
    });

    if (!budget) {
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    return res.json(budget);
  }

  async index(req, res) {
    const limit = parseInt(req.params.limit, 10);
    const budgets = await Budget.findAll({
      where: { user_id: req.userId },
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name', 'cnpj'] },
        { model: Address, as: 'address', attributes: ['id', 'name', 'city'] },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: StatusBudget, as: 'status' },
        { model: User, as: 'update_for', attributes: ['id', 'name'] },
      ],
      limit: Number.isNaN(limit) ? null : limit,
      order: [['created_at', 'DESC']],
    });
    return res.json(budgets);
  }

  // async destroy(req, res) {
  //   const budget_database = await Budget.findByPk(req.params.id);
  //   if (!budget_database) {
  //     return res.status(400).json({ error: 'Este orçamento não existe. ' });
  //   }
  //   await budget_database.destroy();
  //   return res.status(204).send();
  // }

  async store(req, res) {
    const schema = Yup.object().shape({
      velocity: Yup.string().required(),
      client: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required(),
      address: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const client_id = req.body.client.id;
    const address_id = req.body.address.id;
    const user_id = req.userId;
    const { velocity } = req.body;
    let status_budget_id = null;
    const status_initial = await StatusBudget.findOne({
      where: { sequence: 1 },
    });

    if (status_initial) {
      status_budget_id = status_initial.id;
    }

    const client_database = await Client.findByPk(client_id);
    if (!client_database) {
      return res.status(400).json({ error: 'Este cliente não existe! ' });
    }
    const user_database = await User.findByPk(user_id);
    if (!user_database) {
      return res.status(400).json({ error: 'Este usuário não existe! ' });
    }

    const address_database = await Address.findByPk(address_id);
    if (!address_database) {
      return res.status(400).json({ error: 'Este endereço não existe! ' });
    }
    const { id } = await Budget.create({
      client_id,
      user_id,
      address_id,
      status_budget_id,
      velocity,
    });
    const budgetCreated = await Budget.findByPk(id, {
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name', 'cnpj'] },
        {
          model: Address,
          as: 'address',
          attributes: ['id', 'name', 'label', 'number', 'city', 'cep'],
        },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        {
          model: StatusBudget,
          as: 'status',
          attributes: ['id', 'name'],
        },
        { model: User, as: 'update_for', attributes: ['id', 'name'] },
      ],
    });
    const usersAdm = await User.findAll({ where: { admin: true } });
    await Promise.all(
      usersAdm.map(async (admin) => {
        await Mail.sendMail({
          to: `${admin.name} <${admin.email}>`,
          subject: 'Nova solicitação de orçamento',
          template: 'budgetCreated',
          context: {
            user: admin.name,
            requestingUser: budgetCreated.user.name,
            client: budgetCreated.client.name,
            address: budgetCreated.address.label,
            velocity: budgetCreated.velocity,
            status: budgetCreated.status.name,
          },
        });
      })
    );

    return res.json(budgetCreated);
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     id: Yup.number().required(),
  //     velocity: Yup.string().required(),
  //     client_id: Yup.number().required(),
  //     user_id: Yup.number().required(),
  //     address_id: Yup.number().required(),
  //     status_budget_id: Yup.number(),
  //   });
  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'Validadion fails' });
  //   }

  //   const budget = await Budget.findByPk(req.body.id);

  //   if (!budget) {
  //     return res.status(404).json({ error: 'Este orçamento não existe. ' });
  //   }
  //   const { client_id, user_id, address_id } = req.body;
  //   let { status_budget_id } = req.body;
  //   const client_database = await Client.findByPk(client_id);
  //   if (!client_database) {
  //     return res.status(400).json({ error: 'Este cliente não existe! ' });
  //   }
  //   const user_database = await User.findByPk(user_id);
  //   if (!user_database) {
  //     return res.status(400).json({ error: 'Este usuário não existe! ' });
  //   }

  //   if (!status_budget_id) {
  //     const statuses_database = await StatusBudget.findAll();

  //     // pesquisando o status do estado de inicio
  //     const status = statuses_database.reduce((resp, obj) =>
  //       obj.sequence < resp.sequence ? obj : resp
  //     );
  //     status_budget_id = status.id;
  //   }
  //   const address_database = await Address.findByPk(address_id);
  //   if (!address_database) {
  //     return res.status(400).json({ error: 'Este endereço não existe! ' });
  //   }
  //   const budget_response = await Budget.update(
  //     {
  //       client_id,
  //       user_id,
  //       address_id,
  //       status_budget_id,
  //     },
  //     { include: [{ all: true }] }
  //   );
  //   return res.json(budget_response);
  // }
}
export default new BudgetController();
