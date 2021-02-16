import * as Yup from 'yup';
import StatusBudget from '../../models/StatusBudget';

class StatusBudgetController {
  async index(req, res) {
    const statuses = await StatusBudget.findAll();
    return res.json(statuses);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      sequence: Yup.number().required(),
      color: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fields!' });
    }
    const { id, name, sequence, color } = await StatusBudget.create(req.body);
    return res.json({ id, name, sequence, color });
  }

  async destroy(req, res) {
    const status_exist = await StatusBudget.findByPk(req.params.id);
    if (!status_exist) {
      return res.status(400).json({ error: 'Status not exists.' });
    }
    await status_exist.destroy();
    return res.status(204).send();
  }

  async show(req, res) {
    const status_exist = await StatusBudget.findByPk(req.params.id);
    if (!status_exist) {
      return res.status(400).json({ error: 'Nenhum status foi encontrado.' });
    }
    return res.json(status_exist);
  }

  async update(req, res) {
    const schema = Yup.object({
      id: Yup.number().required(),
      name: Yup.string().required(),
      sequence: Yup.number().required(),
      color: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const status_database = await StatusBudget.findByPk(req.body.id);

    if (!status_database) {
      return res.status(404).json({ error: 'Status not exists. ' });
    }

    const { id, name, sequence, color } = await status_database.update(
      req.body
    );
    return res.json({
      id,
      name,
      sequence,
      color,
    });
  }
}
export default new StatusBudgetController();
