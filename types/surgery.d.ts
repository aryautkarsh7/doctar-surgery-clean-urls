// Global types for Doctar Surgery Frontend

interface Window {
  DOCTAR_API_BASE: string;
  locInitMap: () => void;
  locLoadCities: () => void;
  _citiesLoaded: boolean;
  _cityDirectory: any[];
  closeLocationModal: () => void;
  openLocationModal: () => void;
  selectCity: (city: string) => void;
  handleRoute: () => void;
  reloadCityData: (city: string) => Promise<void>;
  STATIC_SUBCATEGORIES: any[];
  
  CategoryAPI: any;
  DoctorAPI: any;
  HospitalAPI: any;
  TreatmentAPI: any;
  
  // page renderers
  renderHomePage: () => void;
  renderCategoryPage: (slug: string) => void;
  renderTreatmentPage: (slug: string) => void;
  renderDoctorsPage: (city: string) => void;
  renderHospitalsPage: (city: string) => void;
  renderSearchPage: (query: string) => void;
  renderPetPage: (city: string) => void;
  renderStaticPage: (slug: string) => void;
  renderBlogPage: (slug?: string) => void;
  
  // Custom globals used on window
  closeFilter: (key?: any) => void;
  applyAllHospitalsFilter: (key?: any, value?: any) => void;
  setHospitalsView: (view?: any) => void;
  srShowAll: (section?: any) => void;
  srSubmitSearch: (ev?: any) => void;
  applyTPLFilter: (slug?: any, key?: any, value?: any) => void;
  toggleTPLFilter: (open?: any) => void;
  renderTreatmentPageGlobal: (slug?: any) => void;
  
  _tplFilters: any;
  _tplSlug: string;
  _allHospitalsFilters: any;
  _allHospitalsList: any[];
  _allHospitalsView: string;
  _allHospitalsMap: any;
  _hospitalDetailMap: any;
  
  API_BASE: string;
  DOCTAR_CLOUDINARY_CLOUD_NAME: string;
  DOCTAR_ROUTE_CITY: string;
  updatePageMeta: (options: any) => void;
  popularProcedures: any;
  _featuredHospitalMarkers: any;
  _featuredHospitalMap: any;
  highlightHospitalPin: (slug: string) => void;
  centerHospitalMapOnCity: (city: string) => void;
  
  // Doctor profile/list globals
  dpp2SwitchTab: (tab: string, btn?: any) => void;
  dpp2ToggleSlots: (idx: any, iso?: any, dateLabel?: any) => void;
  dpp2BookSlot: (docName: string, hospital?: any, iso?: any, slot?: any, dateLabel?: any, docSlug?: any) => void;
  switchDppTab: (tab: string, btn: any) => void;
  _bmState: any;
  
  _dlFilters: any;
  applyDLFilter: (catSlug?: any, key?: any, value?: any) => void;
  toggleDLFilter: (open?: any) => void;
  _allDoctorsFilters: any;
  applyAllDoctorsFilter: (key?: any, value?: any) => void;
  
  // Location/Map globals
  locConfirm: any;
  _locDetectedMarker: any;
  _locPending: any;
  _locMap: any;
  locFilterCities: (val?: any) => void;
  locSelectCity: (cityName?: any, available?: any) => void;
  detectCurrentLocation: () => Promise<string>;
  _locLastGPS: any;
  locUseCurrentLocation: () => void;
  
  // Booking modal globals
  bmSelectSlot: (btn?: any) => void;
  expandSlots: () => void;
  bmSetSex: (sex: any, btn?: any) => void;
  bmUseCurrentCity: () => void;
  bmSubmit: (ev?: any) => void;
  
  // Claim modal globals
  openClaimModal: (doctorName: string, doctorSlug: string) => void;
  closeClaimModal: () => void;
  submitClaim: () => void;
  
  submitBooking: (name: any, phone: any, disease: any, successMessage?: any, email?: any) => Promise<void>;
  submitDoctorBooking: (specialty: any) => void;
  submitHospitalBooking: (hospitalName: any) => void;
  bmSetFor: (who: any) => void;
  bmSetDate: (type: any, btn?: any, val?: any) => void;
}

// Global Leaflet map variable
declare const L: any;

// Global constants/variables from data.ts (using var to allow overrides/redeclarations)
declare var SITE_CONFIG: any;
declare var CATEGORIES: any[];
declare var TREATMENTS: Record<string, any[]>;
declare var CITIES: any[];
declare var DOCTORS: any[];
declare var HOSPITALS: any[];
declare var AVAILABLE_CITIES: string[];
declare var CITY_DATA: any;
declare var BLOG_POSTS: any[];

// Global helper functions
declare function slugify(text: string): string;
declare function sanitize(text: string): string;
declare function getQueryParam(param: string): string | null;
declare function showToast(message: string, type?: string): void;
declare function handleRoute(): void;
declare function formatDate(dateStr: string): string;
declare function updatePageMeta(options: any): void;
declare function urlAllDoctors(city?: string): string;
declare function detectCurrentLocation(): Promise<string>;

// Global filter helpers
declare function applyAllHospitalsFilter(key?: any, value?: any): void;
declare function applyDLFilter(catSlug?: any, key?: any, value?: any): void;
declare function toggleDLFilter(open?: any): void;
declare function applyAllDoctorsFilter(key?: any, value?: any): void;
declare function applyTPLFilter(slug?: any, key?: any, value?: any): void;
declare function toggleTPLFilter(open?: any): void;

// Components & Modules
declare function renderHeader(): void;
declare function renderFooter(): void;
declare function openBookingModal(name: string, hospital?: string, slug?: string): void;
declare function closeBookingModal(): void;
declare function closeClaimModal(): void;

// API wrapper objects
declare var CategoryAPI: any;
declare var DoctorAPI: any;
declare var HospitalAPI: any;
declare var TreatmentAPI: any;

// Global page renderer functions declared with rest params to accept any arguments
declare function renderHomePage(...args: any[]): void;
declare function renderSurgeonsNearMe(...args: any[]): void;
declare function renderPetSurgery(...args: any[]): void;
declare function renderAllDoctorsPage(...args: any[]): void;
declare function renderAllProceduresPage(...args: any[]): void;
declare function renderAllHospitalsPage(...args: any[]): void;
declare function renderAllCategoriesPage(...args: any[]): void;
declare function renderCategoryPage(...args: any[]): void;
declare function renderHospitalsNearMe(...args: any[]): void;
declare function renderTreatmentPage(...args: any[]): void;
declare function renderDoctorProfilePage(...args: any[]): void;
declare function renderDoctorsListingPage(...args: any[]): void;
declare function renderHospitalDetailPage(...args: any[]): void;
declare function renderBlogsPage(...args: any[]): void;
declare function renderBlogPage(...args: any[]): void;
declare function renderSearchPage(...args: any[]): void;
declare function renderPrivacyPage(...args: any[]): void;
declare function renderTermsPage(...args: any[]): void;
declare function renderAboutPage(...args: any[]): void;
declare function renderContactPage(...args: any[]): void;
declare function renderCareersPage(...args: any[]): void;
declare function renderPetHospitals(...args: any[]): void;
