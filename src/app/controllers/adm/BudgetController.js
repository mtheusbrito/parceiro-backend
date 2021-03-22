import * as Yup from 'yup';
// import puppeteer from 'puppeteer';

import Mail from '../../../lib/Mail';
import Address from '../../models/Address';
import Budget from '../../models/Budget';
import Client from '../../models/Client';
import Configuration from '../../models/Configuration';
import Gratification from '../../models/Gratification';
import Item from '../../models/Item';
import StatusBudget from '../../models/StatusBudget';
import User from '../../models/User';
import Report from '../../../lib/Report';

require('dotenv').config();

class BudgetController {
  async reportServicesDownload(req, res) {
    const { hash } = req.params;
    const budget = await Budget.findOne({
      where: { hash },
      include: [
        { model: Client, as: 'client' },
        { model: Address, as: 'address' },
        { model: Item, as: 'itens' },
      ],
    });
    if (!budget) {
      return res.status(400).json({ error: 'Este orçamento não existe.' });
    }

    await Report.createOrUpdate({
      fileName: 'servicesBudget.ejs',
      data: budget,
    });
    const urlDownload = `${process.env.URL_API}reports/${budget.hash}.pdf`;
    return res.json({ urlDownload });
  }

  static async sendEmailBudgetUpdated(budget_updated) {
    try {
      await Mail.sendMail({
        to: `${budget_updated.user.name} <${budget_updated.user.email}>`,
        subject: 'Alteração de status de orçamento',
        template: 'budgetStatusChanged',
        context: {
          user: budget_updated.user.name,
          client: budget_updated.client.name,
          address: budget_updated.address.label,
          velocity: budget_updated.velocity,
          status: budget_updated.status.name,
          update_for: budget_updated.update_for.name,
        },
      });
    } catch (err) {
      console.log(`Erro ao enviar email: ${err}`);
    }
  }

  async approve(req, res) {
    const budget = await Budget.findByPk(req.params.id, {
      include: [{ all: true }],
    });
    const config = await Configuration.findByPk(1, {
      include: [
        {
          model: StatusBudget,
          as: 'status_completed_sales',
          attributes: ['id'],
        },
        {
          model: StatusBudget,
          as: 'status_analysis_budgets',
          attributes: ['id'],
        },
      ],
    });

    if (!config.status_completed_sales.id) {
      return res
        .status(400)
        .json({ error: 'O status de aprovação ainda não foi definido!.' });
    }

    if (!budget) {
      return res.status(400).json({ error: 'Este orçamento não existe.' });
    }

    await budget.update({
      status_budget_id: config.status_completed_sales.id,
      update_for_id: req.userId,
    });
    const budget_updated = await Budget.findByPk(budget.id, {
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name', 'cnpj'] },
        {
          model: Address,
          as: 'address',
          attributes: ['id', 'name', 'label', 'number', 'city', 'cep'],
        },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        {
          model: StatusBudget,
          as: 'status',
          attributes: ['id', 'name'],
        },
        { model: User, as: 'update_for', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (budget_updated) {
      BudgetController.sendEmailBudgetUpdated(budget_updated);
    }

    return res.json({
      budget: budget_updated,
    });
  }

  async index(req, res) {
    const config = await Configuration.findByPk(1, {
      include: [
        {
          model: StatusBudget,
          as: 'status_completed_sales',
          attributes: ['id'],
        },
        {
          model: StatusBudget,
          as: 'status_analysis_budgets',
          attributes: ['id'],
        },
      ],
    });
    const budgets = await Budget.findAll({
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'cnpj'],
          where: { deleted_at: null },
        },
        { model: Address, as: 'address', attributes: ['id', 'name', 'city'] },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: StatusBudget, as: 'status' },
        { model: User, as: 'update_for', attributes: ['id', 'name'] },
        {
          model: Gratification,
          as: 'gratification',
          attributes: ['id', 'delivery_date', 'payment_date', 'payment'],
        },
        { model: Item, as: 'itens' },
      ],
      order: [['created_at', 'DESC']],
    });
    return res.json({
      budgets,
      approved_status: config.status_completed_sales.id,
    });
  }

  async show(req, res) {
    const user = await User.findByPk(req.userId);
    if (!user.admin) {
      return res.status(400).json({ error: 'Acesso não permitido' });
    }
    const budget_database = await Budget.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'cnpj', 'value', 'label'],
          include: [
            {
              model: Address,
              as: 'addresses',
              attributes: [
                'id',
                'name',
                'label',
                'value',
                'number',
                'city',
                'cep',
              ],
            },
          ],
        },
        {
          model: Address,
          as: 'address',
          attributes: ['id', 'name', 'label', 'value', 'number', 'city', 'cep'],
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
        { model: Item, as: 'itens' },
      ],
    });
    if (!budget_database) {
      return res.status(400).json({ error: 'Este orçamento não existe' });
    }
    return res.json(budget_database);
  }

  async destroy(req, res) {
    const budget_database = await Budget.findByPk(req.params.id);
    if (!budget_database) {
      return res.status(400).json({ error: 'Este orçamento não existe. ' });
    }
    await budget_database.destroy();
    return res.status(204).send();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      velocity: Yup.string().required(),
      client: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required(),
      address: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required(),
      status: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const { status, client, address, velocity } = req.body;
    const user = await User.findByPk(req.userId, {
      attributes: ['name', 'id'],
    });
    const client_database = await Client.findByPk(client.id, {
      include: { model: User, as: 'user', attributes: ['id', 'name'] },
    });
    const { id } = await Budget.create({
      client_id: client.id,
      address_id: address.id,
      user_id: client_database.user.id,
      update_for_id: req.userId,
      status_budget_id: status.id,
      velocity,
    });
    const budget_created = await Budget.findByPk(id, {
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
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: StatusBudget, as: 'status' },
      ],
    });

    if (budget_created) {
      await Mail.sendMail({
        to: `${budget_created.user.name} <${budget_created.user.email}>`,
        subject: 'Novo orçamento',
        template: 'budgetCreatedForAdm',
        context: {
          user: budget_created.user.name,
          client: budget_created.client.name,
          address: budget_created.address.label,
          velocity: budget_created.velocity,
          status: budget_created.status.name,
          created_for: user.name,
        },
      });
    }
    return res.status(201).json(budget_created);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      velocity: Yup.string().required(),
      client: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required(),
      address: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required(),
      status: Yup.object()
        .shape({
          id: Yup.number().required(),
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
        .nullable()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }
    const config = await Configuration.findByPk(1, {
      include: [
        {
          model: StatusBudget,
          as: 'status_completed_sales',
          attributes: ['id'],
        },
        {
          model: StatusBudget,
          as: 'status_analysis_budgets',
          attributes: ['id'],
        },
      ],
    });
    const { status_analysis_budgets } = config;

    const budget = await Budget.findByPk(req.body.id);

    if (!budget) {
      return res.status(404).json({ error: 'Este orçamento não existe. ' });
    }
    const { status, address, velocity } = req.body;

    await budget.update({
      velocity,
      address_id: address.id,
      status_budget_id: status.id,
      update_for_id: req.userId,
    });

    const budget_updated = await Budget.findByPk(budget.id, {
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name', 'cnpj'] },
        {
          model: Address,
          as: 'address',
          attributes: ['id', 'name', 'label', 'number', 'city', 'cep'],
        },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        {
          model: StatusBudget,
          as: 'status',
          attributes: ['id', 'name'],
        },
        { model: User, as: 'update_for', attributes: ['id', 'name'] },
        { model: Gratification, as: 'gratification', attributes: ['id'] },
      ],
    });
    if (budget_updated) {
      if (budget_updated.status.id !== budget.status.id) {
        if (budget_updated.status.id !== status_analysis_budgets.id) {
          if (budget_updated.gratification) {
            await budget_updated.setGratification(null);
            await Gratification.destroy({
              where: { id: budget_updated.gratification.id },
            });
          }
        }
        BudgetController.sendEmailBudgetUpdated(budget_updated);
      }
    }
    return res.status(200).json(budget_updated);
  }
}
export default new BudgetController();
