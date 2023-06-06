interface Vector2D {
  x: number;
  y: number;
}
const {plot} = require("nodeplotlib")
export default class KMeans {
  private centroids: Vector2D[];
  private vectors: Vector2D[];
  private clusters: { [x: number]: Vector2D[] } = {};
  constructor(private readonly numberOfClusters: number, vectors:Vector2D[]) {
    this.vectors = vectors;
    this.centroids = this.createCentroids();
    this.clusters = { ...new Array(this.numberOfClusters).fill([]) };
    this.calculateDistance();
  }
  public createCentroids(): { x: number; y: number }[] {
    let copyOfArr = [...this.vectors];
    for (var i = copyOfArr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [copyOfArr[i], copyOfArr[j]] = [copyOfArr[j], copyOfArr[i]];
    }
    return copyOfArr.slice(0, this.numberOfClusters);
  }

  public calculateDistance() {
    this.vectors.forEach((vector) => {
      let minusDistance: number | undefined = undefined;
      let minusDistanceCentroidIndex: number = 0;
      this.centroids.forEach((centroid, j) => {
        let addAbsolute =
          Math.pow(Math.abs(vector.x - centroid.x), 2) +
          Math.pow(Math.abs(vector.y - centroid.y), 2);
        let dis = Math.sqrt(addAbsolute);
        if (!minusDistance) {
          minusDistance = dis;
        } else {
          minusDistance = dis < minusDistance ? dis : minusDistance;
          minusDistanceCentroidIndex =
            dis < minusDistance ? minusDistanceCentroidIndex : j;
        }
      });
      const rest = this.clusters[minusDistanceCentroidIndex];
      this.clusters = {
        ...this.clusters,
        [minusDistanceCentroidIndex]: [...rest, vector],
      };
      console.log(this.clusters);
      this.iterate()
      //console.log(this.clusters[`${minusDistanceCentroidIndex}` as keyof typeof this.clusters])
    });
  }

  public iterate() {
    this.centroids.forEach((centroid, index) => {
      const cluster = this.clusters[index];
      if (cluster.length > 0) {
        const sumX = cluster.reduce((sum, vector) => sum + vector.x, 0);
        const sumY = cluster.reduce((sum, vector) => sum + vector.y, 0);
        const meanX = sumX / cluster.length;
        const meanY = sumY / cluster.length;
        centroid.x = meanX;
        centroid.y = meanY;
      }
    });
    this.clusters = {};

    this.vectors.forEach((vector) => {
      let minDistance = Infinity;
      let closestCentroidIndex = 0;

      this.centroids.forEach((centroid, j) => {
        const distance =
          Math.pow(vector.x - centroid.x, 2) +
          Math.pow(vector.y - centroid.y, 2);

        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidIndex = j;
        }
      });

      if (!(closestCentroidIndex in this.clusters)) {
        this.clusters[closestCentroidIndex] = [];
      }

      this.clusters[closestCentroidIndex].push(vector);
    });
  }

  public plotClusters() {
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow']; // Array of colors for different clusters
  
    const data = Object.entries(this.clusters).map(([centroidIndex, vectors], index) => {
      const centroidColor = colors[index % colors.length];
      const xData = vectors.map((vector) => vector.x);
      const yData = vectors.map((vector) => vector.y);
  
      return {
        x: xData,
        y: yData,
        mode: 'markers',
        type: 'scatter',
        marker: {
          color: centroidColor,
          size: 8,
        },
        name: `Cluster ${centroidIndex}`,
      };
    });
  
    plot(data);
  }
}
