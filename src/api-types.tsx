export interface JourneyResponse {
  journeys: Journey[];
  lines: Line[];
  cycleHireDockingStationData: CycleHireDockingStationData;
  stopMessages: string[];
  recommendedMaxAgeMinutes: number;
  searchCriteria: SearchCriteria;
  journeyVector: JourneyVector;
}

interface JourneyVector {
  from: string;
  to: string;
  via: string;
  uri: string;
}

interface SearchCriteria {
  dateTime: string;
  dateTimeType: string;
  timeAdjustments: TimeAdjustments;
}

interface TimeAdjustments {
  earliest: Earliest;
  earlier: Earliest;
  later: Earliest;
  latest: Earliest;
}

interface Earliest {
  date: string;
  time: string;
  timeIs: string;
  uri: string;
}

interface CycleHireDockingStationData {
  originNumberOfBikes: number;
  destinationNumberOfBikes: number;
  originNumberOfEmptySlots: number;
  destinationNumberOfEmptySlots: number;
  originId: string;
  destinationId: string;
}

interface Line {
  id: string;
  name: string;
  modeName: string;
  disruptions: Disruption[];
  created: string;
  modified: string;
  lineStatuses: LineStatus[];
  routeSections: RouteSection[];
  serviceTypes: ServiceType[];
  crowding: Crowding;
}

interface ServiceType {
  name: string;
  uri: string;
}

interface RouteSection {
  routeCode: string;
  name: string;
  direction: string;
  originationName: string;
  destinationName: string;
  originator: string;
  destination: string;
  serviceType: string;
  validTo: string;
  validFrom: string;
}

interface LineStatus {
  id: number;
  lineId: string;
  statusSeverity: number;
  statusSeverityDescription: string;
  reason: string;
  created: string;
  modified: string;
  validityPeriods: ValidityPeriod[];
  disruption: Disruption;
}

interface ValidityPeriod {
  fromDate: string;
  toDate: string;
  isNow: boolean;
}

export interface Journey {
  startDateTime: string;
  duration: number;
  arrivalDateTime: string;
  description: string;
  alternativeRoute: boolean;
  legs: Leg[];
  fare: Fare2;
}

interface Fare2 {
  totalCost: number;
  fares: Fare[];
  caveats: Caveat[];
}

interface Caveat {
  text: string;
  type: string;
}

interface Fare {
  lowZone: number;
  highZone: number;
  cost: number;
  chargeProfileName: string;
  isHopperFare: boolean;
  chargeLevel: string;
  peak: number;
  offPeak: number;
  taps: Tap[];
}

interface Tap {
  atcoCode: string;
  tapDetails: TapDetails;
}

interface TapDetails {
  modeType: string;
  validationType: string;
  hostDeviceType: string;
  busRouteId: string;
  nationalLocationCode: number;
  tapTimestamp: string;
}

interface Leg {
  duration: number;
  speed: string;
  instruction: Instruction;
  obstacles: Obstacle[];
  departureTime: string;
  arrivalTime: string;
  departurePoint: DeparturePoint;
  arrivalPoint: DeparturePoint;
  path: Path;
  routeOptions: RouteOption[];
  mode: StopPoint;
  disruptions: Disruption[];
  plannedWorks: PlannedWork[];
  distance: number;
  isDisrupted: boolean;
  hasFixedLocations: boolean;
  scheduledDepartureTime: string;
  scheduledArrivalTime: string;
  interChangeDuration: string;
  interChangePosition: string;
}

interface PlannedWork {
  id: string;
  description: string;
  createdDateTime: string;
  lastUpdateDateTime: string;
}

interface Disruption {
  category: string;
  type: string;
  categoryDescription: string;
  description: string;
  summary: string;
  additionalInfo: string;
  created: string;
  lastUpdate: string;
  affectedRoutes: AffectedRoute[];
  affectedStops: StopPoint2[];
  closureText: string;
}

interface AffectedRoute {
  id: string;
  lineId: string;
  routeCode: string;
  name: string;
  lineString: string;
  direction: string;
  originationName: string;
  destinationName: string;
  via: Via;
  isEntireRouteSection: boolean;
  validTo: string;
  validFrom: string;
  routeSectionNaptanEntrySequence: Via[];
}

interface Via {
  ordinal: number;
  stopPoint: StopPoint2;
}

interface StopPoint2 {
  naptanId: string;
  platformName: string;
  indicator: string;
  stopLetter: string;
  modes: string[];
  icsCode: string;
  smsCode: string;
  stopType: string;
  stationNaptan: string;
  accessibilitySummary: string;
  hubNaptanCode: string;
  lines: StopPoint[];
  lineGroup: LineGroup[];
  lineModeGroups: LineModeGroup[];
  fullName: string;
  naptanMode: string;
  status: boolean;
  individualStopId: string;
  id: string;
  url: string;
  commonName: string;
  distance: number;
  placeType: string;
  additionalProperties: AdditionalProperty[];
  children: Child2[];
  childrenUrls: string[];
  lat: number;
  lon: number;
}

interface Child2 {
  id: string;
  url: string;
  commonName: string;
  distance: number;
  placeType: string;
  additionalProperties: AdditionalProperty[];
  children: Child[];
  childrenUrls: string[];
  lat: number;
  lon: number;
}

interface Child {}

interface AdditionalProperty {
  category: string;
  key: string;
  sourceSystemKey: string;
  value: string;
  modified: string;
}

interface LineModeGroup {
  modeName: string;
  lineIdentifier: string[];
}

interface LineGroup {
  naptanIdReference: string;
  stationAtcoCode: string;
  lineIdentifier: string[];
}

interface RouteOption {
  id: string;
  name: string;
  directions: string[];
  lineIdentifier: StopPoint;
  direction: string;
}

interface Path {
  lineString: string;
  stopPoints: StopPoint[];
  elevation: Elevation[];
}

interface Elevation {
  distance: number;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  heightFromPreviousPoint: number;
  gradient: number;
}

interface StopPoint {
  id: string;
  name: string;
  uri: string;
  fullName: string;
  type: string;
  crowding: Crowding;
  routeType: string;
  status: string;
  motType: string;
  network: string;
}

interface Crowding {
  passengerFlows: PassengerFlow[];
  trainLoadings: TrainLoading[];
}

interface TrainLoading {
  line: string;
  lineDirection: string;
  platformDirection: string;
  direction: string;
  naptanTo: string;
  timeSlice: string;
  value: number;
}

interface PassengerFlow {
  timeSlice: string;
  value: number;
}

interface DeparturePoint {
  lat: number;
  lon: number;
}

interface Obstacle {
  type: string;
  incline: string;
  stopId: number;
  position: string;
}

interface Instruction {
  summary: string;
  detailed: string;
  steps: Step[];
}

interface Step {
  description: string;
  turnDirection: string;
  streetName: string;
  distance: number;
  cumulativeDistance: number;
  skyDirection: number;
  skyDirectionDescription: string;
  cumulativeTravelTime: number;
  latitude: number;
  longitude: number;
  pathAttribute: PathAttribute;
  descriptionHeading: string;
  trackType: string;
}

interface PathAttribute {
  name: string;
  value: string;
}
