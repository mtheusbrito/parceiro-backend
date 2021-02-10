import Budget from '../../models/Budget';
import Client from '../../models/Client';
import StatusBudget from '../../models/StatusBudget';
import Address from '../../models/Address';

class BudgetController {
  async index(req, res) {
    const budgets = Budget.findAll({
      include: [Client, StatusBudget, Address],
    });
    return res.json({ budgets });
  }
}
export default new BudgetController();
