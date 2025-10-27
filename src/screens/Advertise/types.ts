export interface ImageData {
  uri?: string; // Opcional para compatibilidade
  base64: string;
  name: string;
  type: string;
  principal: boolean;
  index: number;
}

export interface Step5Data {
  descricao: string;
  valor: string;
  aceite_termos: string;
}

export type AdvertiseStackParamList = {
  advertiseHome: { editCodigo?: string } | undefined;
  advertiseStep1: { editCodigo?: string; shouldPublish?: boolean } | undefined;
  advertiseStep2: undefined;
  advertiseStep3: undefined;
  advertiseStep4: undefined;
  advertiseStep5: { images?: ImageData[] };
  advertiseStep6: { step5Data?: Step5Data };
  advertiseSuccess: { adNumber: string; isEditing?: boolean };
  selectOptions: {
    selectedOptions: string[];
    availableOptions?: Array<{id: number, descricao: string}>;
    onSelect: (options: string[]) => void;
  };
};

export interface VehicleData {
  brand: string;
  model: string;
  manufactureYear: string;
  modelYear: string;
  mileage: string;
  color: string;
  transmission: string;
  fuel: string;
  doors: string;
}

export interface VehicleOptions {
  ipvaPaid: string;
  vehicleInName: string;
  dealershipRevisions: string;
  ownerManual: string;
  spareKey: string;
  airConditioning: string;
  airConditioningWorking: string;
  exhaustSmoke: string;
  factoryWarranty: string;
  engineKnock: string;
  gearboxNoise: string;
  gearboxSlip: string;
  stolen: string;
  tireCondition: string;
  windshield: string;
  injectionLight: string;
  airbagLight: string;
  absLight: string;
  collisionType: string;
  auction: string;
}

export interface VehicleFeatures {
  airBag: boolean;
  alarm: boolean;
  airConditioning: boolean;
  cdPlayer: boolean;
  powerSteering: boolean;
  absBrakes: boolean;
  electricLocks: boolean;
  electricWindows: boolean;
  hotAir: boolean;
  driverSeatAdjustment: boolean;
  heatedFrontSeats: boolean;
  leatherSeat: boolean;
  onBoardComputer: boolean;
  cruiseControl: boolean;
  dvdPlayer: boolean;
  gps: boolean;
  tractionControl: boolean;
  rearDefogger: boolean;
  electricSteering: boolean;
  auxiliaryHeadlights: boolean;
  ledHeadlights: boolean;
  xenonHeadlight: boolean;
  rearWiper: boolean;
}

export interface AdvertiseFormData {
  vehicleData: VehicleData;
  vehicleOptions: VehicleOptions;
  vehicleFeatures: VehicleFeatures;
  photos: string[];
  description: string;
  price: string;
  agreeTerms: boolean;
  selectedPlan: 'free' | 'official';
}

