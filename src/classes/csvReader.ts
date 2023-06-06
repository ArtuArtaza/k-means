const ExcelJS = require('exceljs');
export default class CSVReader {
  constructor(private readonly reader: any) {
    this.reader = ExcelJS
  }
  async read(filename:string): Promise<{x:number,y:number}[] | null> {
    const workbook = new this.reader.Workbook();
    try {
      await workbook.csv.readFile(filename);
      const worksheet = workbook.getWorksheet(1);

      let data: {x:number,y:number}[] = [];

      worksheet.eachRow((row:any, rowNumber:any) => {
        const inputs: {x:number,y:number} = {
          x:row.getCell(1).value as number,
          y:row.getCell(2).value as number,
        };
        data = [...data, {...inputs}];
      });
      return data;
    } catch (error) {
      console.log("Error reading the CSV file:", error);
      return null;
    }
  }
}
