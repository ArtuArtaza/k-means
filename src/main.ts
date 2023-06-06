import CSVReader from "./classes/csvReader";
import KMeans from "./classes/kmeans";
const exceljs = require("exceljs")
const reader = new CSVReader(exceljs);
const main = async () => {
    const data = await reader.read("./database.csv")
    if(!data) return;
    const kmeans = new KMeans(3,data);
    kmeans.plotClusters()
}
main()