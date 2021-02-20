import StatusBudget from '../models/StatusBudget';

class StatusBudgetController {
  async index(req, res) {
    const statuses = await StatusBudget.findAll();
    return res.json(statuses);
  }
}
export default new StatusBudgetController();
