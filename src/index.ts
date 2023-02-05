import { App } from './App';
import { getSampleCollectionService } from './services/SampleCollectionService';

(async function bootstrapApp() {
    new App(getSampleCollectionService()).init();
})();
