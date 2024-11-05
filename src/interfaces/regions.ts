export interface IRegionCoordinates {
  type: string;
  coordinates: number[][][] | undefined;
}

export interface IRegion {
  user: string;
  name: string;
  coordinates: IRegionCoordinates;
}

export interface IGetRegions {
  lat?: string;
  lng?: string;
  distance?: string;
  user?: string;
}
