/**
 * DO NOT MODIFY BY HAND! This file was automatically generated.
 * Instead, please modify the original JSONSchema file in suite-data package, and run `npm run message-system-types` command.
 */

/**
 * Services active
 */
export type EnabledServices = 'tor'[];
export type Version = string | string[] | null;
export type Model = 't' | '1';
/**
 * Eligible authorized vendors
 */
export type Vendor = 'SatoshiLabs';
/**
 * An array of required conditions to show the message.
 */
export type If = {
    enabled: EnabledServices;
    os: OperatingSystem;
    environment: Environment;
    browser: Browser;
    transport: Transport;
    /**
     * Eligible device models
     */
    device: Device[];
}[];
export type Severity = 'low' | 'medium' | 'high';

/**
 * JSON schema of the Trezor Suite messaging system
 */
export interface MessageSystem {
    /**
     * Version of the messaging system. In case we would change the format of the config itself.
     */
    version: number;
    /**
     * Publish date of the config in ISO 8601 date-time format.
     */
    timestamp: string;
    /**
     * An increasing counter. Suite MUST decline any file with lower than latest number. This is to protect against replay attacks, where attacker could send an older version of the file and Suite would accept it
     */
    sequence: number;
    /**
     * An array of messages which are displayed on specific conditions
     */
    actions: Action[];
}
export interface Action {
    if: If;
    then: Then;
}
/**
 * Eligible versions of operating systems
 */
export interface OperatingSystem {
    macos: Version;
    linux: Version;
    windows: Version;
    android: Version;
    ios: Version;
    [k: string]: Version;
}
/**
 * Eligible versions of app releases
 */
export interface Environment {
    desktop: Version;
    mobile: Version;
    web: Version;
}
/**
 * Eligible versions of browsers
 */
export interface Browser {
    firefox: Version;
    chrome: Version;
    chromium: Version;
    [k: string]: Version;
}
/**
 * Eligible versions of transport layer apps
 */
export interface Transport {
    bridge: Version;
}
export interface Device {
    model: Model;
    firmware: Version;
    vendor: Vendor;
}
/**
 * A specific message configuration
 */
export interface Then {
    /**
     * A message is active and can be shown to users satisfying rules
     */
    active: boolean;
    notification: Notification;
}
export interface Notification {
    /**
     * A user can close the message and never see it again
     */
    dismissible: boolean;
    /**
     * The location to which the message applies. Wildcards allowed.
     */
    location: string | string[];
    message: Message;
    severity: Severity;
    [k: string]: unknown;
}
/**
 * A multilingual message localization
 */
export interface Message {
    'en-GB': string;
    [k: string]: string;
}
