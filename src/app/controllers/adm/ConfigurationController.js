import * as Yup from 'yup';
import Configuration from '../../models/Configuration';
import StatusBudget from '../../models/StatusBudget';

class ConfigurationController {
  async show(req, res) {
    const configuration = await Configuration.findByPk(1, {
      include: [
        { model: StatusBudget, as: 'status_analysis_budgets' },
        { model: StatusBudget, as: 'status_completed_sales' },
      ],
    });
    if (!configuration) {
      return res.status(400).json({ error: 'Ainda não há configuração salva' });
    }

    return res.json(configuration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      status_analysis_budgets: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .required(),
      status_completed_sales: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const status_completed_sales_id = req.body.status_completed_sales.id;
    const status_analysis_budgets_id = req.body.status_analysis_budgets.id;
    const { email } = req.body;

    const configuration_database = await Configuration.findByPk(1, {
      include: [
        { model: StatusBudget, as: 'status_analysis_budgets' },
        { model: StatusBudget, as: 'status_completed_sales' },
      ],
    });

    if (!configuration_database) {
      const confiration_created = await Configuration.create(
        {
          status_completed_sales_id,
          status_analysis_budgets_id,
          email,
        },
        {
          include: [
            { model: StatusBudget, as: 'status_analysis_budgets' },
            { model: StatusBudget, as: 'status_completed_sales' },
          ],
        }
      );

      return res.json(confiration_created);
    }

    const configuration_updated = await configuration_database.update(
      {
        status_completed_sales_id,
        status_analysis_budgets_id,
        email,
      },
      {
        include: [
          { model: StatusBudget, as: 'status_analysis_budgets' },
          { model: StatusBudget, as: 'status_completed_sales' },
        ],
      }
    );

    return res.json(configuration_updated);
  }
}

export default new ConfigurationController();
