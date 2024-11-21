interface PatternInterface {
    BENEFICIARIES: RegExp;
    PHONE_NUMBER: RegExp;
    PHONE_COUNTRY_CODE: RegExp;
    EMAIL: RegExp;
    POSTAL_CODE: RegExp;
    REFERENCE_PERSONNEL: RegExp;
    ORGANISATION_WEBSITE: RegExp;
    FACEBOOK_LINK: RegExp;
    LINKED_IN: RegExp;
    TWITTER: RegExp;
    INSTAGRAM: RegExp;
  }
  
  export const Patterns: PatternInterface = {
    BENEFICIARIES: /^[0-9]+$/g,
    PHONE_NUMBER: /^[0-9]{10}$/g,
    PHONE_COUNTRY_CODE: /^(\d{1,3})$/g,
    EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    POSTAL_CODE: /^[1-9][0-9]{5}$/g,
    REFERENCE_PERSONNEL: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g,
    ORGANISATION_WEBSITE: /''*$/g,
    FACEBOOK_LINK: /^(http(s)?:\/\/)?([\www]+\.)?facebook\.com\/[a-zA-Z0-9_]*$/g,
    LINKED_IN: /^(http(s)?:\/\/)?([\www]+\.)?linkedin\.com\/[a-zA-Z0-9_]*$/g,
    TWITTER: /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
    INSTAGRAM: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/,
  };
  