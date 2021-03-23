import * as Yup from 'yup';
import Address from '../../models/Address';
import Budget from '../../models/Budget';
import Client from '../../models/Client';
import Gratification from '../../models/Gratification';
import StatusBudget from '../../models/StatusBudget';
import User from '../../models/User';

class GratificationController {
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      budget_id: Yup.number().required(),
      payment: Yup.string().nullable().required(),
      payment_date: Yup.date()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .required(),
      delivery_date: Yup.date()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const { id, budget_id, payment, payment_date, delivery_date } = req.body;

    const budget_database = await Budget.findByPk(budget_id);
    if (!budget_database) {
      return res.status(400).json({ error: 'Este orçamento não existe' });
    }

    const gratification_database = await Gratification.findByPk(id);
    if (!gratification_database) {
      return res.status(400).json({ error: 'Esta gratificação não existe' });
    }
    await gratification_database.update({
      payment,
      payment_date,
      delivery_date,
    });
    const budget_updated = await Budget.findByPk(budget_id, {
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
        {
          model: Gratification,
          as: 'gratification',
          attributes: ['id', 'delivery_date', 'payment_date', 'payment'],
        },
      ],
    });
    return res.json(budget_updated);
  }

  async store(req, res) {
    // data.payment_date = moment(data.payment_date).format("YYYY-MM-DD HH:mm:ss");
    const created_for_id = req.userId;
    const schema = Yup.object().shape({
      budget_id: Yup.number().required(),
      payment: Yup.string().nullable().required(),
      payment_date: Yup.date()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .required(),
      delivery_date: Yup.date()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const budget_database = await Budget.findByPk(req.body.budget_id);
    if (!budget_database) {
      return res.status(400).json({ error: 'Este orçamento não existe' });
    }
    const { payment, payment_date, delivery_date } = req.body;
    const gratification = await Gratification.create({
      payment,
      payment_date,
      delivery_date,
      created_for_id,
    });
    if (gratification) {
      await budget_database.setGratification(gratification);
    }
    return res.json(gratification);
  }
}
export default new GratificationController();
