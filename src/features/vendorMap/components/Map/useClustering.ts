// src/features/vendorMap/hooks/useClustering.ts
import { useMemo } from 'react';
import Supercluster from 'supercluster';
import { Vendor } from '../../../../types/vendor';

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface ClusterPoint {
  type: 'Feature';
  properties: {
    cluster: boolean;
    cluster_id?: number;
    point_count?: number;
    vendor?: Vendor;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const useClustering = (vendors: Vendor[], region: MapRegion, mapZoom: number) => {
  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 40, // Cluster radius in pixels
      maxZoom: 20, // Maximum zoom level for clustering
      minZoom: 0, // Minimum zoom level
      minPoints: 2, // Minimum points to form a cluster
    });

    // Convert vendors to GeoJSON points
    const points: ClusterPoint[] = vendors.map((vendor) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        vendor,
      },
      geometry: {
        type: 'Point',
        coordinates: [vendor.longitude, vendor.latitude],
      },
    }));

    cluster.load(points);
    return cluster;
  }, [vendors]);

  const clusteredPoints = useMemo(() => {
    if (!region) return [];

    // Calculate map bounds
    const bbox: [number, number, number, number] = [
      region.longitude - region.longitudeDelta / 2, // westLng
      region.latitude - region.latitudeDelta / 2,   // southLat
      region.longitude + region.longitudeDelta / 2, // eastLng
      region.latitude + region.latitudeDelta / 2,   // northLat
    ];

    // Get clusters for current map bounds and zoom
    const clusters = supercluster.getClusters(bbox, mapZoom);
    
    return clusters.map((cluster) => {
      const geometry = cluster.geometry;
      if (geometry.type === 'Point') {
      const [longitude, latitude] = geometry.coordinates;
      
      if (cluster.properties.cluster) {
        // This is a cluster
        return {
          id: `cluster-${cluster.properties.cluster_id}`,
          latitude,
          longitude,
          isCluster: true,
          count: cluster.properties.point_count || 0,
          clusterId: cluster.properties.cluster_id,
        };
      } else {
        // This is a single vendor
        return {
          id: `vendor-${cluster.properties.vendor?.id}`,
          latitude,
          longitude,
          isCluster: false,
          vendor: cluster.properties.vendor,
        };
      }
    }
    return null;
    }).filter(Boolean); // Remove any `null`s from fallback
  }, [supercluster, region, mapZoom]);

  const getClusterExpansionZoom = (clusterId: number): number => {
    return supercluster.getClusterExpansionZoom(clusterId);
  };

  const getClusterLeaves = (clusterId: number): Vendor[] => {
    const leaves = supercluster.getLeaves(clusterId, Infinity);
    return leaves.map((leaf) => leaf.properties.vendor).filter(Boolean) as Vendor[];
  };

  return {
    clusteredPoints,
    getClusterExpansionZoom,
    getClusterLeaves,
  };
};