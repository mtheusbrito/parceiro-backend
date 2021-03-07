import * as Yup from 'yup';
import Budget from '../../models/Budget';
import Gratification from '../../models/Gratification';

class GratificationController {
  async store(req, res) {
    // data.payment_date = moment(data.payment_date).format("YYYY-MM-DD HH:mm:ss");

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
    });
    if (gratification) {
      await budget_database.setGratification(gratification);
    }
    return res.json(gratification);
  }
}
export default new GratificationController();
