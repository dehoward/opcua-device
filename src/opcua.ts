import { Mqtt as IotHubMqtt } from 'azure-iot-device-mqtt';
import { Client } from 'azure-iot-device';
import { Mqtt as DPSMqtt } from 'azure-iot-provisioning-device-mqtt';
import { SymmetricKeySecurityClient } from 'azure-iot-security-symmetric-key';
import { ProvisioningDeviceClient } from 'azure-iot-provisioning-device';
import Commands from './commands';
import Properties from './properties';

const Keys = {
    scopeId: '',
    deviceId: '',
    deviceSasKey: ''
};

let hubClient: Client;
const provisioningClient = ProvisioningDeviceClient.create(
    'global.azure-devices-provisioning.net',
    Keys.scopeId,
    new DPSMqtt(),
    new SymmetricKeySecurityClient(Keys.deviceId, Keys.deviceSasKey)
);

function onConnect(err: Error) {
    if (err) {
        console.error(`Device could not connect to Azure IoT Central: ${err.toString()}`);
    } else {
        console.log('Device successfully connected to Azure IoT Central');

        // Register command handlers:
        for (const command in Commands) {
            hubClient.onDeviceMethod(
                command,
                (req, res) => Commands[command](req, res, hubClient)
            );
        }

        // Register property handlers:
        hubClient.getTwin((err, twin) => {
            err
                ? console.error(`Error getting device twin: ${err.toString()}`)
                : Properties.forEach(p => p(twin));
        });
    }
};

// Start the device (register and connect to Azure IoT Central).
provisioningClient.register((err, result) => {
    if (err) {
        console.error('Error registering device: ' + err);
    } else {
        const { assignedHub, deviceId } = result;

        console.log(`Registration successful! ✅
            Hub: ${assignedHub}
            DeviceId: ${deviceId}`);

        const connectionString = 'HostName=' + assignedHub + ';DeviceId=' + deviceId + ';SharedAccessKey=' + Keys.deviceSasKey;
        hubClient = Client.fromConnectionString(connectionString, IotHubMqtt);

        hubClient.open(onConnect);
    }
});