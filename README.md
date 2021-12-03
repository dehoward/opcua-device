# opcua-device

## Quickstart
1. **Create a device**

    Create a device in your IoT Central app and copy the device keys to the `Keys` object in `opcua.ts`.
2. **Start the device**
    
    To start the device for the first time run:
    ```console
    $ npm i && npm run start
    ```

## Commands
- `startTelemetry`
    
    payload: 
    ```jsonc
    {
        "interval": 3000 // set the interval to 3s
    }
    ```
- `stopTelemetry`

## Properties
- `Location` (read-only)
- `metadata` (writable, any object)
