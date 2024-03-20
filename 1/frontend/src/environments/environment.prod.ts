// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';

const scheme = 'http://';
const host = 'localhost';
const port = ':8000';
const path = '/api/';

const baseUrl = scheme + host + port + path;

export const environment = {
  production: true,
  version: packageInfo.version,
  appName: 'E-Cell Doc Portal',
  envName: EnvName.PROD,
  defaultLanguage: 'en',
  apiBaseUrl: baseUrl,
};
