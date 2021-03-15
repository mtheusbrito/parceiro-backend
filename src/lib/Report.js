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

  sendReport(report, response) {
    const viewsPath = resolve(
      __dirname,
      '..',
      'app',
      'views',
      'reports',
      report.fileName
    );
    const { data } = report;

    data.current_date = moment().format('DD/MM/YYYY');
    ejs.renderFile(viewsPath, { data }, (err, html) => {
      response(html ?? err);
      if (!err) {
        const options = {
          height: '11.25in',
          width: '8.5in',
          header: {
            height: '20mm',
          },
          footer: {
            height: '20mm',
          },
        };
        // pdf
        //   .create(html, options)
        //   .toFile('report.pdf', (errCreatePdf, filePdf) => {
        //     if (!errCreatePdf) {
        //       response(html);
        //     }
        //   });
      }
    });
  }
}
export default new Report();
