/* eslint-disable no-unused-vars */
import ejs from 'ejs';
import { resolve } from 'path';
import pdf from 'html-pdf';
import moment from 'moment';

class Report {
  // constructor() {
  //   // this.transporter = ejs;
  //   // this.configuration();
  // }

  // configuration() {
  //   const viewsPath = resolve(__dirname, '..', 'app', 'views', 'reports');
  //   this.transporter.renderFile(viewsPath, {})
  // }

  sendReport(report) {
    const viewsPath = resolve(
      __dirname,
      '..',
      'app',
      'views',
      'reports',
      report.fileName
    );
    const reportPath = resolve(__dirname, '..', '..', 'tmp', 'reports');
    const { data } = report;

    data.current_date = moment().format('DD/MM/YYYY');
    ejs.renderFile(viewsPath, { data }, (err, html) => {
      // response(html ?? err);
      if (!err) {
        const options = {
          format: 'A4',
        };
        pdf
          .create(html)
          .toFile(
            resolve(
              __dirname,
              '..',
              '..',
              'tmp',
              'reports',
              `${data.hash}.pdf`
            ),
            (errCreatePdf, filePdf) => {
              if (!errCreatePdf) {
                // response(html);
              }
            }
          );
      }
    });
  }
}
export default new Report();
