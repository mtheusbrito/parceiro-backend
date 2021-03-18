/* eslint-disable no-unused-vars */
import ejs from 'ejs';
import { resolve } from 'path';
import pdf from 'html-pdf';
import moment from 'moment';
import { Promise, reject } from 'bluebird';

class Report {
  async createOrUpdate(report) {
    try {
      const { data } = report;
      data.current_date = moment().format('DD/MM/YYYY');
      const options = {
        format: 'A4',
        orientation: 'portrait',
        height: '11.25in',
      };
      const viewsPath = resolve(
        __dirname,
        '..',
        'app',
        'views',
        'reports',
        report.fileName
      );
      const reportPath = resolve(
        __dirname,
        '..',
        '..',
        'tmp',
        'reports',
        `${data.hash}.pdf`
      );

      const ejsData = await ejs.renderFile(viewsPath, { data });

      const retorno = await new Promise((ok, notok) => {
        pdf.create(ejsData, options).toFile(reportPath, (err, response) => {
          if (err) notok(err);
          ok(response);
        });
      });
      return retorno;
    } catch (err) {
      console.log(`Error processing request: ${err}`);
    }
    return null;
  }
}
export default new Report();
