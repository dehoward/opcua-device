import { Twin } from 'azure-iot-device';

export default [
    sendDeviceLocation,
    updateDeviceMetadata
]

function updateDeviceMetadata(twin: Twin) {
    twin.on('properties.desired.metadata', async (value: any) => {
        // Wait before sending the response:
        await new Promise(res => setTimeout(res, 10000));

        updateReportedProperties(twin, {
            metadata: value
        })
    })
}

function sendDeviceLocation(twin: Twin) {
    updateReportedProperties(twin, {
        Location: {
            lon: -122.128519,
            lat: 47.643619
        }
    });
}

function updateReportedProperties(twin: Twin, properties: any) {
    twin.properties.reported.update(
        properties,
        (err: any) => console.log(err
            ? `Error sending device properties: ${err}`
            : `Sent device properties: ${JSON.stringify(properties)}`
        ));
}

