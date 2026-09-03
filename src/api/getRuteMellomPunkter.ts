export const getRuteMellomPunkter = async (
  startX: number,
  startY: number,
  stoppX: number,
  stoppY: number
) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const query = `https://www.webatlas.no/WAAPI-Ferd/Route/Expanded`;

  const postData = {
    Start: { X: startX, Y: startY, FeatureSnapRestriction: ['Road', 'Motorway'] },
    Stop: { X: stoppX, Y: stoppY, FeatureSnapRestriction: ['Road', 'Motorway'] },
    ViaPoints: [],
    SrsId: 4326,
    GraphName: 'ta-norden-dynamic',
    CostFunction: 'time',
    RouteFeatures: [
      'TerminalInfo',
      'JunctionInfo',
      'RoundaboutInfo',
      'RoadInfo',
      'UTurnInfo',
      'FerryInfo',
      'TollInfo',
    ],
    ZoomLevel: 14,
  };

  // TODO: Fullfør/endre koden for å hente og returnere en kjørerute mellom to punkter

  // Hint: Du kan se på getHoydeFromPunkt for å få en idé om hvordan dette kan gjøres.
  // Dette er en POST request, akkurat som getHoydeFromPunkt.

  // Responsen inneholder bl.a. RouteGeometry (en GeoJSON MultiLineString) som kan vises i
  // kartet, og en liste med kostnader (CostList) for ruten.

  // Når du har fått til kallet til API-et kan du se i Network-taben i nettleseren eller i
  // konsollen for å se hvordan responsen ser ut.
};
