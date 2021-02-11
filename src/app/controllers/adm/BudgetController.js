import * as Yup from 'yup';
import Address from '../../models/Address';
import Budget from '../../models/Budget';
import Client from '../../models/Client';
import StatusBudget from '../../models/StatusBudget';
import User from '../../models/User';
// import Client from '../../models/Client';
// import StatusBudget from '../../models/StatusBudget';
// import Address from '../../models/Address';
// import User from '../../models/User';

class BudgetController {
  async index(req, res) {
    const budgets = await Budget.findAll({ include: [{ all: true }] });
    return res.json(budgets);
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
    const schema = Yup.object().shape({
      velocity: Yup.string().required(),
      client_id: Yup.number().required(),
      user_id: Yup.number().required(),
      address_id: Yup.number().required(),
      status_budget_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const { client_id, user_id, address_id } = req.body;
    let { status_budget_id } = req.body;
    const client_database = await Client.findByPk(client_id);
    if (!client_database) {
      return res.status(400).json({ error: 'Este cliente não existe! ' });
    }
    const user_database = await User.findByPk(user_id);
    if (!user_database) {
      return res.status(400).json({ error: 'Este usuário não existe! ' });
    }

    if (!status_budget_id) {
      const statuses_database = await StatusBudget.findAll();

      // pesquisando o status do estado de inicio
      const status = statuses_database.reduce((resp, obj) =>
        obj.sequence < resp.sequence ? obj : resp
      );
      status_budget_id = status.id;
    }
    const address_database = await Address.findByPk(address_id);
    if (!address_database) {
      return res.status(400).json({ error: 'Este endereço não existe! ' });
    }
    const budget = await Budget.create({
      client_id,
      user_id,
      address_id,
      status_budget_id,
    });
    return res.json(budget);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      velocity: Yup.string().required(),
      client_id: Yup.number().required(),
      user_id: Yup.number().required(),
      address_id: Yup.number().required(),
      status_budget_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const budget = await Budget.findByPk(req.body.id);

    if (!budget) {
      return res.status(404).json({ error: 'Este orçamento não existe. ' });
    }
    const { client_id, user_id, address_id } = req.body;
    let { status_budget_id } = req.body;
    const client_database = await Client.findByPk(client_id);
    if (!client_database) {
      return res.status(400).json({ error: 'Este cliente não existe! ' });
    }
    const user_database = await User.findByPk(user_id);
    if (!user_database) {
      return res.status(400).json({ error: 'Este usuário não existe! ' });
    }

    if (!status_budget_id) {
      const statuses_database = await StatusBudget.findAll();

      // pesquisando o status do estado de inicio
      const status = statuses_database.reduce((resp, obj) =>
        obj.sequence < resp.sequence ? obj : resp
      );
      status_budget_id = status.id;
    }
    const address_database = await Address.findByPk(address_id);
    if (!address_database) {
      return res.status(400).json({ error: 'Este endereço não existe! ' });
    }
    const budget_response = await Budget.update({
      client_id,
      user_id,
      address_id,
      status_budget_id,
    });
    return res.json(budget_response);
  }
}
export default new BudgetController();
