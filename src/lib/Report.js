/* eslint-disable no-unused-vars */
import ejs from 'ejs';
import { resolve } from 'path';
import pdf from 'html-pdf';
import moment from 'moment';
import { Promise, reject } from 'bluebird';

class Report {
  // constructor() {
  //   // this.transporter = ejs;
  //   // this.configuration();
  // }

  // configuration() {
  //   const viewsPath = resolve(__dirname, '..', 'app', 'views', 'reports');
  //   this.transporter.renderFile(viewsPath, {})
  // }

  async gethtmltopdf(report) {
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
      return await pdf
        .create(ejsData, options)
        .toFile(reportPath, (err, response) => {
          if (err) return console.log(err);
          return response;
        });
    } catch (err) {
      console.log(`Error processing request: ${err}`);
    }
    return null;
  }

  async createUpdate(report) {
    const { data } = report;
    data.current_date = moment().format('DD/MM/YYYY');
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

    await ejs.renderFile(viewsPath, { data }, async (err, html) => {
      if (!err) {
        const options = {
          format: 'A4',
          orientation: 'portrait',
          height: '11.25in',
        };

        await pdf
          .create(html, options)
          .toFile(reportPath, (errCreated, filePdf) => {});
      }
    });
  }
}
export default new Report();
