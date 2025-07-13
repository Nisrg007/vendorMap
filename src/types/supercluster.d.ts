declare module 'supercluster' {
  import { Feature, Geometry, GeoJsonProperties } from 'geojson';

  export interface SuperclusterOptions<P = any, C = any> {
    minZoom?: number;
    maxZoom?: number;
    radius?: number;
    extent?: number;
    nodeSize?: number;
    log?: boolean;
    map?: (props: P) => C;
    reduce?: (accumulated: C, props: C) => void;
    minPoints?: number;
  }

  export interface ClusterProperties extends GeoJsonProperties {
    cluster: true;
    cluster_id: number;
    point_count: number;
    point_count_abbreviated?: number | string;
  }

  export interface VendorProperties extends GeoJsonProperties {
    cluster: false;
    vendor: any; // Replace `any` with your Vendor type via generics or module augmentation
  }

  export type ClusterFeature = Feature<Geometry, ClusterProperties | VendorProperties>;

  export default class Supercluster<P = any, C = any> {
    constructor(options?: SuperclusterOptions<P, C>);
    load(points: Array<Feature<Geometry, P>>): void;
    getClusters(
      bbox: [number, number, number, number],
      zoom: number
    ): Array<ClusterFeature>;
    getChildren(clusterId: number): Array<ClusterFeature>;
    getLeaves(clusterId: number, limit?: number, offset?: number): Array<Feature<Geometry, P>>;
    getTile(z: number, x: number, y: number): any;
    getClusterExpansionZoom(clusterId: number): number;
  }
}
