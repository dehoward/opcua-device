import { Client, Message, DeviceMethodRequest, DeviceMethodResponse } from 'azure-iot-device';

export default {
    startTelemetry,
    stopTelemetry
};

let telemetryInterval: NodeJS.Timer;
export function startTelemetry(
    request: DeviceMethodRequest,
    response: DeviceMethodResponse,
    client: Client
) {
    const interval = request.payload.interval;
    console.log(`Received asynchronous call to start telemetry with interval ${interval}`);

    const msg = interval
        ? `Telemetry interval set to ${interval} with ❤️`
        : `Payload invalid. Payload was: ${JSON.stringify(request.payload)}`;

    response.send(200, msg, (err) => {
        if (err) {
            console.error('Unable to send method response: ' + err.toString());
        } else if (!interval) {
            console.error(msg);
        }
        else {
            console.log('Starting telemetry...');

            // Send telemetry measurements to Azure IoT Central based on input interval:
            telemetryInterval = setInterval(() => sendTelemetry(client), interval);

            console.log(msg);

        }
    });
}

export function stopTelemetry(
    _request: DeviceMethodRequest,
    response: DeviceMethodResponse,
    _client: Client
) {
    const msg = telemetryInterval
        ? 'Telemetry stopped!'
        : 'Telemetry hasn\'t been started!';
    response.send(200, msg, (err) => {
        if (err) {
            console.error('Unable to send method response: ' + err.toString());
        } else if (!telemetryInterval) {

        }
        else {
            console.log('Stopping telemetry...');

            // Send telemetry measurements to Azure IoT Central based on input interval:
            clearInterval(telemetryInterval);
            telemetryInterval = undefined;

            console.log(msg);

        }
    });
}

function sendTelemetry(client: Client) {
    const min = 869500;
    const max = min + 100;

    const data = JSON.stringify({
        MessageType: 'ua-data',
        Messages: [{
            DataSetWriterId: 'data-transform-1_10000_dd587900-9159-4d20-b93e-ed601b70a7b6',
            MetaDataVersion: {
                MajorVersion: 1,
                MinorVersion: 0
            },
            Payload: {
                'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt1': {
                    ServerTimestamp: '2020-12-04T00:08:04.1004748Z',
                    SourceTimestamp: '2020-12-04T00:08:04.1004691Z',
                    Value: getRandomNumber(min, max)
                },
                'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt2': {
                    ServerTimestamp: '2020-12-04T00:08:04.1004748Z',
                    SourceTimestamp: '2020-12-04T00:08:04.1004691Z',
                    Value: getRandomNumber(min, max)
                },
                'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt3': {
                    ServerTimestamp: '2020-12-04T00:08:04.1004748Z',
                    SourceTimestamp: '2020-12-04T00:08:04.1004691Z',
                    Value: getRandomNumber(min, max)
                },
                'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt4': {
                    ServerTimestamp: '2020-12-04T00:08:04.1004748Z',
                    SourceTimestamp: '2020-12-04T00:08:04.1004691Z',
                    Value: 869500
                },
                'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt5': {
                    ServerTimestamp: '2020-12-04T00:08:04.1004748Z',
                    SourceTimestamp: '2020-12-04T00:08:04.1004691Z',
                    Value: 869556
                },
                'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt6': {
                    ServerTimestamp: '2020-12-04T00:08:04.1004748Z',
                    SourceTimestamp: '2020-12-04T00:08:04.1004691Z',
                    Value: 869578
                },
                'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt7': {
                    ServerTimestamp: '2020-12-04T00:08:04.1004748Z',
                    SourceTimestamp: '2020-12-04T00:08:04.1004691Z',
                    Value: 869556
                }
            }
        }]
    });

    const message = new Message(data);
    client.sendEvent(message, (err, res) => console.log(`Sent message: ${message.getData()}` +
        (err ? `; error: ${err.toString()}` : '') +
        (res ? `; status: ${res.constructor.name}` : '')));
}

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}