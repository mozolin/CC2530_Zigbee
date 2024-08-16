const zigbeeHerdsmanConverters = require('zigbee-herdsman-converters');
const zigbeeHerdsmanUtils = require('zigbee-herdsman-converters/lib/utils');


const exposes = zigbeeHerdsmanConverters['exposes'] || require("zigbee-herdsman-converters/lib/exposes");
const ea = exposes.access;
const e = exposes.presets;
const fz = zigbeeHerdsmanConverters.fromZigbeeConverters || zigbeeHerdsmanConverters.fromZigbee;
const tz = zigbeeHerdsmanConverters.toZigbeeConverters || zigbeeHerdsmanConverters.toZigbee;

const ptvo_switch = (zigbeeHerdsmanConverters.findByModel)?zigbeeHerdsmanConverters.findByModel('ptvo.switch'):zigbeeHerdsmanConverters.findByDevice({modelID: 'ptvo.switch'});
fz.legacy = ptvo_switch.meta.tuyaThermostatPreset;

fz.on_off = {
  cluster: 'genOnOff',
  type: ['attributeReport', 'readResponse'],
  convert: (model, msg, publish, options, meta) => {
    if(msg.data.hasOwnProperty('onOff')) {
      const property = getProperty('state', msg, model);
      return {[property]: msg.data['onOff'] === 1 ? 'ON' : 'OFF'};
    }
  },
};

fz.temperature = {
  cluster: 'msTemperatureMeasurement',
  type: ['attributeReport', 'readResponse'],
  convert: (model, msg, publish, options, meta) => {
    const temperature = parseFloat(msg.data['measuredValue']) / 100.0;
    return {temperature: calibrateAndPrecisionRoundOptions(temperature, options, 'temperature')};
  },
};

const device = {
    zigbeeModel: ['DIYRuZ_RT'],
    model: 'DIYRuZ_RT',
    vendor: 'DIYRuZ',
    description: 'DIYRuZ',
    supports: 'on/off, temperature',
    fromZigbee: [fz.on_off, fz.temperature],
    toZigbee: [tz.on_off],
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpERENFQ0QxNENGMDcxMUVFQUMzREI1RjVFQjU0MDBEMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpERENFQ0QxNUNGMDcxMUVFQUMzREI1RjVFQjU0MDBEMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkREQ0VDRDEyQ0YwNzExRUVBQzNEQjVGNUVCNTQwMEQxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkREQ0VDRDEzQ0YwNzExRUVBQzNEQjVGNUVCNTQwMEQxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bANneQAAOU5JREFUeNrs3QmYXFWZ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',
    configure: async (device, coordinatorEndpoint, logger) => {
      const endpoint = device.getEndpoint(1);
      await endpoint.read('genBasic', ['modelId', 'swBuildId', 'powerSource']);
    },

};

module.exports = device;
