export interface Motorcycle {
    id: string;
    model: string;
    year: number;
    condition: 'Brand new' | 'Second Hand';
    imageUrl: string;
    pricePerDay: number;
    maxDistance: number;
    rentalPeriod: string;
  }
  
  export interface StatusIndicator {
    label: string;
    value: string | number;
    icon: 'clock' | 'bike';
    bg?: string;
  }
  
  