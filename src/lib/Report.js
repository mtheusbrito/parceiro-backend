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

  createUpdate(report) {
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

    ejs.renderFile(viewsPath, { data }, (err, html) => {
      if (!err) {
        const options = {
          format: 'A4',
          orientation: 'portrait',
          height: '11.25in',
        };

        pdf
          .create(html, options)
          .toFile(reportPath, (errCreated, filePdf) => {});
      }
    });
  }
}
export default new Report();
