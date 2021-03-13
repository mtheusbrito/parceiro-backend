import * as Yup from 'yup';
import Budget from '../../models/Budget';
import Item from '../../models/Item';

class ItemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      budget_id: Yup.number().required(),
      unit: Yup.string().required(),
      amount: Yup.number().required(),
      description: Yup.string().required(),
      unit_value: Yup.string().nullable().required(),
      instalation_value: Yup.string().nullable().required(),
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
      await budget_database.addItem(item);
    }
    return res.json(item);
  }
}
export default new ItemController();
