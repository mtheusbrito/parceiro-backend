import * as Yup from 'yup';
import Mail from '../../../lib/Mail';
import Address from '../../models/Address';
import Budget from '../../models/Budget';
import Client from '../../models/Client';
import Configuration from '../../models/Configuration';
import StatusBudget from '../../models/StatusBudget';
import User from '../../models/User';

class BudgetController {
  async approve(req, res) {
    const budget = await Budget.findByPk(req.params.id, {
      include: [{ all: true }],
    });
    const config = await Configuration.findByPk(1);
    const { status_completed_sales_id } = config;

    if (!status_completed_sales_id) {
      return res
        .status(400)
        .json({ error: 'O status de aprovação ainda não foi definido!.' });
    }

    if (!budget) {
      return res.status(400).json({ error: 'Este orçamento não existe.' });
    }

    await budget.update({
      status_budget_id: status_completed_sales_id,
      update_for_id: req.userId,
    });
    const budget_updated = await Budget.findByPk(budget.id, {
      include: [{ all: true }],
    });
    if (budget_updated) {
      await Mail.sendMail({
        to: `${budget_updated.user.name} <${budget_updated.user.email}>`,
        subject: 'Alteração de status de orçamento',
        template: 'budgetStatusChanged',
        context: {
          user: budget_updated.user.name,
          client: budget_updated.client.name,
          address: budget_updated.address.name,
          velocity: budget_updated.velocity,
          status: budget_updated.status.name,
          update_for: budget_updated.update_for.name,
        },
      });
      return res.json({ approved: true });
    }

    return res.json({ approved: false });
  }

  async index(req, res) {
    const budgets = await Budget.findAll({
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name', 'cnpj'] },
        { model: Address, as: 'address', attributes: ['id', 'name', 'city'] },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: StatusBudget, as: 'status' },
        { model: User, as: 'update_for', attributes: ['id', 'name'] },
      ],
    });
    return res.json(budgets);
  }

  async show(req, res) {
    const user = await User.findByPk(req.userId);
    if (!user.admin) {
      return res.status(400).json({ error: 'Acesso não permitido' });
    }
    const budget_database = await Budget.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'cnpj', 'value', 'label'],
          include: [
            {
              model: Address,
              as: 'addresses',
              attributes: ['id', 'name', 'label', 'value'],
            },
          ],
        },
        {
          model: Address,
          as: 'address',
          attributes: ['id', 'name', 'city', 'label', 'value'],
        },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: StatusBudget, as: 'status' },
        {
          model: User,
          as: 'update_for',
          attributes: ['id', 'name', 'value', 'label'],
        },
      ],
    });
    if (!budget_database) {
      return res.status(400).json({ error: 'Este orçamento não existe' });
    }
    return res.json(budget_database);
  }

  async destroy(req, res) {
    const budget_database = await Budget.findByPk(req.params.id);
    if (!budget_database) {
      return res.status(400).json({ error: 'Este orçamento não existe. ' });
    }
    await budget_database.destroy();
    return res.status(204).send();
  }

  async store(req, res) {
    return res
      .status(200)
      .json({ error: 'Funcionalidade em desenvolvimento!' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
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
      status: Yup.object()
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

    const budget = await Budget.findByPk(req.body.id);

    if (!budget) {
      return res.status(404).json({ error: 'Este orçamento não existe. ' });
    }
    const { status, address, velocity } = req.body;
    const status_budget_id_database = budget.status_budget_id;

    await budget.update({
      velocity,
      address_id: address.id,
      status_budget_id: status.id,
      update_for_id: req.userId,
    });

    const budget_updated = await Budget.findByPk(budget.id, {
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
    if (budget_updated) {
      if (budget_updated.status_budget_id !== status_budget_id_database) {
        await Mail.sendMail({
          to: `${budget_updated.user.name} <${budget_updated.user.email}>`,
          subject: 'Alteração de status de orçamento',
          template: 'budgetStatusChanged',
          context: {
            user: budget_updated.user.name,
            client: budget_updated.client.name,
            address: budget_updated.address.label,
            velocity: budget_updated.velocity,
            status: budget_updated.status.name,
            update_for: budget_updated.update_for.name,
          },
        });
      }
    }
    return res.json(budget_updated);
  }
}
export default new BudgetController();
