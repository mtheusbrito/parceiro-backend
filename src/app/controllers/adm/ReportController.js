import Budget from '../../models/Budget';
import Client from '../../models/Client';
import Configuration from '../../models/Configuration';
// import StatusBudget from '../../models/StatusBudget';

class ReportController {
  async index(req, res) {
    const configuration = await Configuration.findByPk(1);
    const {
      status_analysis_budgets_id,
      status_completed_sales_id,
    } = configuration;
    let clientsDatabase;
    let budgetsInAnalize;
    let completedSales;
    const admin = req.userAdmin;
    if (admin) {
      clientsDatabase = await (await Client.findAndCountAll()).count;
      budgetsInAnalize = await (
        await Budget.findAndCountAll({
          where: { status_budget_id: status_analysis_budgets_id },
        })
      ).count;
      completedSales = await (
        await Budget.findAndCountAll({
          where: { status_budget_id: status_completed_sales_id },
        })
      ).count;
    } else {
      clientsDatabase = await (
        await Client.findAndCountAll({ where: { user_id: req.userId } })
      ).count;
      budgetsInAnalize = await (
        await Budget.findAndCountAll({
          where: {
            status_budget_id: status_analysis_budgets_id,
            user_id: req.userId,
          },
          include: [
            {
              model: Client,
              as: 'client',
              attributes: [],
              where: { deleted_at: null },
            },
          ],
        })
      ).count;
      completedSales = await (
        await Budget.findAndCountAll({
          where: {
            status_budget_id: status_completed_sales_id,
            user_id: req.userId,
          },
          include: [
            {
              model: Client,
              as: 'client',
              attributes: [],
              where: { deleted_at: null },
            },
          ],
        })
      ).count;
    }

    return res.json({
      clients: clientsDatabase,
      budgets_in_analize: budgetsInAnalize,
      completed_sales: completedSales,
    });
  }
}
export default new ReportController();
