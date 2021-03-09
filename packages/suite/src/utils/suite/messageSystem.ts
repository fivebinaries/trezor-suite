import Bowser from 'bowser';
import { verify, decode, Algorithm, Signature } from 'jws';
import * as semver from 'semver';
import { TransportInfo } from 'trezor-connect';
import {
    MessageSystem,
    Then,
    Version,
    OperatingSystem,
    EnabledServices,
    Transport,
    Browser,
    Device,
} from '@suite-types/messageSystem';
import { Network } from '@wallet-types';
import { TrezorDevice } from '@suite-types';
import { getUserAgent, isWeb, isDesktop } from '@suite-utils/env';

// TODO: use production ready key; move to suite-data?
export const secp256k1PublicKey = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE77bZRAszhhlCqJDokcvjlXOPPPRnAOh+
ZkxZDuo75OAmRZFUJtb3jZQrLRhMa/YwOjUHgSa350GIi5L5oJ59+A==
-----END PUBLIC KEY-----
`;

export const decodeMessageSystemJwsConfig = (jwsConfig: string): Signature | null => {
    return decode(jwsConfig);
};

export const verifyMessageSystemJwsConfig = (jwsConfig: string, alg: Algorithm): boolean => {
    return verify(jwsConfig, alg, secp256k1PublicKey);
};

const normalizeVersion = (version: Version): string => {
    if (!version) {
        return '';
    }
    if (typeof version === 'string') {
        return version;
    }
    return version.join(' || ');
};

type CurrentlyEnabledServices = {
    tor: boolean;
    enabledNetworks: Network['symbol'][];
};

const validateEnabledServicesCompatibility = (
    enabledServicesCondition: EnabledServices,
    currentlyEnabledServices: CurrentlyEnabledServices,
): boolean => {
    const services: string[] = [...currentlyEnabledServices.enabledNetworks];
    currentlyEnabledServices.tor && services.push('tor');

    return enabledServicesCondition.every(enabledService => services.includes(enabledService));
};

const validateOSCompatibility = (
    osCondition: OperatingSystem,
    currentOsName: string,
    currentOsVersion: string,
): boolean => {
    const osConditionVersion = normalizeVersion(osCondition[currentOsName]);

    return semver.satisfies(currentOsVersion, osConditionVersion);
};

const validateBrowserCompatibility = (
    browserCondition: Browser,
    currentBrowserName: string,
    currentBrowserVersion: string,
) => {
    const browserConditionVersion = normalizeVersion(browserCondition[currentBrowserName]);

    return semver.satisfies(currentBrowserVersion, browserConditionVersion);
};

const validateEnvironmentCompatibility = (
    environmentVersionCondition: Version,
    suiteVersion: string,
) => {
    return semver.satisfies(suiteVersion, normalizeVersion(environmentVersionCondition));
};

const validateTransportCompatibility = (
    transportCondition: Transport,
    transport: Partial<TransportInfo> | undefined,
) => {
    if (!transport) {
        return false;
    }

    const { version, type } = transport;

    if (version && type === 'bridge') {
        return semver.satisfies(version, normalizeVersion(transportCondition.bridge));
    }

    return false;
};

const validateDeviceCompatibility = (
    deviceConditions: Device[],
    device: TrezorDevice | undefined,
) => {
    if (!device || !device.features) {
        return false;
    }

    const {
        model,
        major_version: majorVersion,
        minor_version: minorVersion,
        patch_version: patchVersion,
    } = device.features;

    const deviceVersion = `${majorVersion}.${minorVersion}.${patchVersion}`;

    return deviceConditions.some(device => {
        let validDevice = true;

        validDevice &&= device.model === model;
        validDevice &&= semver.satisfies(deviceVersion, normalizeVersion(device.firmware));

        return validDevice;
    });
};

export type Options = {
    tor: boolean;
    transport: Partial<TransportInfo> | undefined;
    device: TrezorDevice | undefined;
    enabledNetworks: Network['symbol'][];
};

export const getValidMessages = (
    messageSystemConfig: MessageSystem | null,
    options: Options,
): Then[] => {
    if (!messageSystemConfig) {
        return [];
    }

    const { device, transport, tor, enabledNetworks } = options;

    const currentlyEnabledServices = {
        tor,
        enabledNetworks,
    };

    const isDesktopEnvironment = isDesktop();
    const isWebEnvironment = isWeb();
    const ua = Bowser.getParser(getUserAgent());

    const osDetail = ua.getOS();
    const browserDetail = ua.getBrowser();

    const currentOsName = osDetail.name?.toLowerCase() || '';
    const currentOsVersion = semver.valid(semver.coerce(osDetail.version)) || '';

    const currentBrowserName = browserDetail.name?.toLowerCase() || '';
    const currentBrowserVersion = semver.valid(semver.coerce(browserDetail.version)) || '';

    const suiteVersion = semver.valid(semver.coerce(process.env.VERSION)) || '';

    return messageSystemConfig.actions
        .filter(action => {
            return action.if.some(condition => {
                let conditionValid = true;
                // TODO: if conditionValid === false, then it can return immediately
                const {
                    environment: environmentCondition,
                    os: osCondition,
                    browser: browserCondition,
                    transport: transportCondition,
                    enabled: enabledServicesCondition,
                    device: deviceCondition,
                } = condition;

                conditionValid &&= validateOSCompatibility(
                    osCondition,
                    currentOsName,
                    currentOsVersion,
                );

                if (isDesktopEnvironment) {
                    conditionValid &&= validateEnvironmentCompatibility(
                        environmentCondition.desktop,
                        suiteVersion,
                    );
                } else if (isWebEnvironment) {
                    conditionValid &&= validateEnvironmentCompatibility(
                        environmentCondition.web,
                        suiteVersion,
                    );

                    conditionValid &&= validateBrowserCompatibility(
                        browserCondition,
                        currentBrowserName,
                        currentBrowserVersion,
                    );
                }

                conditionValid &&= validateEnabledServicesCompatibility(
                    enabledServicesCondition,
                    currentlyEnabledServices,
                );

                conditionValid &&= validateTransportCompatibility(transportCondition, transport);

                conditionValid &&= validateDeviceCompatibility(deviceCondition, device);

                return conditionValid;
            });
        })
        .map(action => action.then);
};
