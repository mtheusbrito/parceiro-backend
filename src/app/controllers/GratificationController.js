import Budget from '../models/Budget';
import Gratification from '../models/Gratification';
import StatusBudget from '../models/StatusBudget';
import Address from '../models/Address';
import Client from '../models/Client';

import User from '../models/User';

class GratificationController {
  async index(req, res) {
    const limit = parseInt(req.params.limit, 10);
    const budgets = await Budget.findAll({
      where: { user_id: req.userId },
      include: [
        { model: StatusBudget, as: 'status', where: { deleted_at: null } },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          where: { deleted_at: null },
        },
        { model: Address, as: 'address', where: { deleted_at: null } },
        {
          model: Client,
          as: 'client',
          include: [
            {
              model: Address,
              as: 'addresses',
              where: { deleted_at: null },
              attributes: ['id', 'value', 'label', 'number'],
            },
          ],
        },
        {
          model: Gratification,
          as: 'gratification',
          where: { delete_ad: null },
        },
      ],
      limit: Number.isNaN(limit) ? null : limit,
      order: [['created_at', 'DESC']],
    });

    return res.json(budgets);
  }
}
export default new GratificationController();
