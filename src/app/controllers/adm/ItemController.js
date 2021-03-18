import * as Yup from 'yup';
import Budget from '../../models/Budget';
import Item from '../../models/Item';

class ItemController {
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      unit: Yup.string().required(),
      amount: Yup.number().required(),
      description: Yup.string().required(),
      unit_value: Yup.string().nullable().required(),
      instalation_value: Yup.string(),
      contract_time: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const {
      id,
      unit,
      amount,
      description,
      unit_value,
      contract_time,
    } = req.body;
    const item_database = await Item.findByPk(id);
    if (!item_database) {
      return res.status(400).json({ error: 'Este serviço não existe' });
    }
    await item_database.update({
      unit,
      amount,
      description,
      unit_value,
      contract_time,
    });

    const item_updated = await Item.findByPk(id);

    return res.status(200).json(item_updated);
  }

  async delete(req, res) {
    const item_database = await Item.findByPk(req.params.id);
    if (!item_database) {
      return res.status(400).json({ error: 'Este serviço não existe' });
    }
    await item_database.destroy();
    return res.status(204).send();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      budget_id: Yup.number().required(),
      unit: Yup.string().required(),
      amount: Yup.number().required(),
      description: Yup.string().required(),
      unit_value: Yup.string().nullable().required(),
      instalation_value: Yup.string(),
      contract_time: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const budget_database = await Budget.findByPk(req.body.budget_id);
    if (!budget_database) {
      return res.status(400).json({ error: 'Este orçamento não existe' });
    }
    const {
      unit,
      amount,
      description,
      contract_time,
      unit_value,
      instalation_value,
    } = req.body;
    const item = await Item.create({
      unit,
      amount,
      description,
      contract_time,
      unit_value,
      instalation_value,
    });
    if (item) {
      await budget_database.addItens(item);
    }
    return res.json(item);
  }
}
export default new ItemController();
