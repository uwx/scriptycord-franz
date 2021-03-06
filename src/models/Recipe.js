import emailParser from 'address-rfc2822';
import semver from 'semver';

export default class Recipe {
  id = '';
  name = '';
  description = '';
  version = '';
  path = '';

  serviceURL = '';

  hasDirectMessages = true;
  hasIndirectMessages = false;
  hasNotificationSound = false;
  hasTeamId = false;
  hasPredefinedUrl = false;
  hasCustomUrl = false;
  hasHostedOption = false;
  urlInputPrefix = '';
  urlInputSuffix = '';

  message = '';

  hansenWebviewOptions = {};
  hansenDisableCSP = false;

  constructor(data) {
    if (!data) {
      throw Error('Recipe config not valid');
    }

    if (!data.id) {
      // Franz 4 recipes do not have an Id
      throw Error(`Recipe '${data.name}' requires Id`);
    }

    try {
      if (!semver.valid(data.version)) {
        throw Error(`Version ${data.version} of recipe '${data.name}' is not a valid semver version`);
      }
    } catch (e) {
      console.warn(e.message);
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.rawAuthor = data.author || this.author;
    this.description = data.description || this.description;
    this.version = data.version || this.version;
    this.path = data.path;

    this.serviceURL = data.config.serviceURL || this.serviceURL;
    if (data.config.hansenFastPreload) this.serviceURL += `#preload:${this.path}`;

    this.hasDirectMessages = data.config.hasDirectMessages || this.hasDirectMessages;
    this.hasIndirectMessages = data.config.hasIndirectMessages || this.hasIndirectMessages;
    this.hasNotificationSound = data.config.hasNotificationSound || this.hasNotificationSound;
    this.hasTeamId = data.config.hasTeamId || this.hasTeamId;
    this.hasPredefinedUrl = data.config.hasPredefinedUrl || this.hasPredefinedUrl;
    this.hasCustomUrl = data.config.hasCustomUrl || this.hasCustomUrl;
    this.hasHostedOption = data.config.hasHostedOption || this.hasHostedOption;

    this.urlInputPrefix = data.config.urlInputPrefix || this.urlInputPrefix;
    this.urlInputSuffix = data.config.urlInputSuffix || this.urlInputSuffix;

    this.message = data.config.message || this.message;
    this.hansenWebviewOptions = data.config.hansenWebviewOptions || this.hansenWebviewOptions;
    this.hansenDisableCSP = data.config.hansenDisableCSP || this.hansenDisableCSP;
  }

  get author() {
    try {
      const addresses = emailParser.parse(this.rawAuthor);
      return addresses.map(a => ({ email: a.address, name: a.phrase }));
    } catch (err) {
      console.warn(`Not a valid author for ${this.name}`);
    }

    return [];
  }
}
