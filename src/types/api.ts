// API Response Types
export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    svg: string;
    png: string;
  };
  cca3: string;
}

// REST Countries API
export interface RestCountriesData extends Country {
  capital?: string[];
  population?: number;
  area?: number;
  region?: string;
  subregion?: string;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol?: string } };
  timezones?: string[];
  borders?: string[];
  continents?: string[];
  coatOfArms?: { svg?: string; png?: string };
  landlocked?: boolean;
  independent?: boolean;
  unMember?: boolean;
}

// WikiData API
export interface WikipediaImage {
  title: string;
  file_description_url: string;
  preferred: {
    mediatype: string;
    size?: number;
    width: number;
    height: number;
    url: string;
  };
  original: {
    mediatype: string;
    size?: number;
    width: number;
    height: number;
    url: string;
  };
}

export interface WikiDataBasicFields {
  governmentType?: string;
  hdi?: number;
  gdpPerCapita?: number;
  lifeExpectancy?: number;
  literacyRate?: number;
  enwikiTitle?: string;
}

export interface WikiDataExtendedFields {
  religions?: string[];
  ethnicGroups?: string[];
  images?: WikipediaImage[];
}

export interface WikiDataFields
  extends WikiDataBasicFields,
    WikiDataExtendedFields {}

export interface CountryDetails extends RestCountriesData {
  wikiData?: WikiDataFields; // Optional in case API call fails
}

export type SummaryResponse = {
  query: string;
  summary: string;
  fromCache: boolean;
};

export interface CacheEntry {
  id?: number;
  queryKey: string;
  summary: string;
  createdAt: number;
  expiresAt: number;
}

export interface HuggingFaceMessage {
  role?: string;
  content?: string;
}

export interface HuggingFaceChoice {
  index?: number;
  message?: HuggingFaceMessage;
}

export interface HuggingFaceUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface HuggingFaceResponse {
  id?: string;
  object?: string;
  model?: string;
  choices?: HuggingFaceChoice[];
  usage?: HuggingFaceUsage;
  error?: any;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ApiError;
    };

export type TranslationKey =
  | "ara"
  | "bre"
  | "ces"
  | "cym"
  | "deu"
  | "est"
  | "fin"
  | "fra"
  | "hrv"
  | "hun"
  | "ind"
  | "ita"
  | "jpn"
  | "kor"
  | "nld"
  | "per"
  | "pol"
  | "por"
  | "rus"
  | "slk"
  | "spa"
  | "srp"
  | "swe"
  | "tur"
  | "urd"
  | "zho";
