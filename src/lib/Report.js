/* eslint-disable no-unused-vars */
import ejs from 'ejs';
import { resolve } from 'path';
import pdf from 'html-pdf';
import moment from 'moment';
import { Promise, reject } from 'bluebird';
import PDFMerger from 'pdf-merger-js';

class Report {
  async createOrUpdate(report) {
    try {
      const { data } = report;
      data.current_date = moment().format('DD/MM/YYYY');
      const options = {
        format: 'Letter',
        orientation: 'landscape',
        // height: '11.25in',
        width: '11.69in',
        height: '8.27in',
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

      if (retorno) {
        const part1 = resolve(
          __dirname,
          '..',
          'app',
          'views',
          'reports',
          'partials',
          'part1.pdf'
        );
        const part2 = resolve(
          __dirname,
          '..',
          'app',
          'views',
          'reports',
          'partials',
          'part2.pdf'
        );
        const merger = new PDFMerger();
        merger.add(part1);
        merger.add(reportPath);
        merger.add(part2);
        await merger.save(reportPath);
      }

      return retorno;
    } catch (err) {
      console.log(`Error processing request: ${err}`);
    }
    return null;
  }
}
export default new Report();
