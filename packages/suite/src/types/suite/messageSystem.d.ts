/**
 * DO NOT MODIFY BY HAND! This file was automatically generated.
 * Instead, please modify the original JSONSchema file in suite-data package, and run `npm run message-system-types` command.
 */

/**
 * Version of the messaging system. In case we would change the format of the config itself.
 */
export type Version = number;
/**
 * Publish date of the config in ISO 8601 date-time format.
 */
export type Timestamp = string;
/**
 * An increasing counter. Suite MUST decline any file with lower than latest number. This is to protect against replay attacks, where attacker could send an older version of the file and Suite would accept it
 */
export type Sequence = number;
/**
 * Services active
 */
export type Enabled = string[];
export type MacOS = string | string[] | null;
export type Linux = string | string[] | null;
export type Windows = string | string[] | null;
export type Desktop = string | string[] | null;
export type Mobile = string | string[] | null;
export type Web = string | string[] | null;
export type Firefox = string | string[] | null;
export type GoogleChrome = string | string[] | null;
export type Version1 = string | string[] | null;
export type Model = 't' | '1';
export type FirmwareVersion = string | string[] | null;
/**
 * Eligible authorized vendors
 */
export type Vendor = 'SatoshiLabs';
/**
 * Eligible device models
 */
export type Device = {
    model: Model;
    firmware: FirmwareVersion;
    vendor: Vendor;
}[];
/**
 * An array of required conditions to show the message.
 */
export type If = {
    enabled: Enabled;
    os: Os;
    environment: Environment;
    browser: Browser;
    transport: Transport;
    device: Device;
}[];
/**
 * A message is active and can be shown to users satisfying rules
 */
export type Active = boolean;
/**
 * A user can close the message and never see it again
 */
export type Dismissible = boolean;
/**
 * The location to which the message applies. Wildcards allowed.
 */
export type Location = string | string[];
export type Localization = string;
export type Severity = 'low' | 'medium' | 'high';
/**
 * An array of messages with specific conditions
 */
export type Actions = {
    if: If;
    then: Then;
}[];

/**
 * JSON schema of the Trezor Suite messaging system
 */
export interface MessageSystem {
    version: Version;
    timestamp: Timestamp;
    sequence: Sequence;
    actions: Actions;
}
/**
 * Eligible versions of operating systems
 */
export interface Os {
    macos: MacOS;
    linux: Linux;
    windows: Windows;
}
/**
 * Eligible versions of app releases
 */
export interface Environment {
    desktop: Desktop;
    mobile: Mobile;
    web: Web;
}
/**
 * Eligible versions of browsers
 */
export interface Browser {
    firefox: Firefox;
    chrome: GoogleChrome;
}
/**
 * Eligible versions of transport layer apps
 */
export interface Transport {
    trezord: Version1;
}
/**
 * A specific message configuration
 */
export interface Then {
    active: Active;
    notification: Notification;
}
export interface Notification {
    dismissible: Dismissible;
    location: Location;
    message: Message;
    severity: Severity;
    [k: string]: unknown;
}
/**
 * A multilingual message localization
 */
export interface Message {
    'en-GB': Localization;
    [k: string]: Localization;
}
