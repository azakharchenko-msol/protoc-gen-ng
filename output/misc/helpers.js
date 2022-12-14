"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = exports.isNumberString = exports.isNumberNumber = exports.isPacked = exports.getDataType = exports.isFieldMessage = exports.getMapKeyValueFields = exports.isFieldMap = void 0;
var tslib_1 = require("tslib");
var types_1 = require("../../input/types");
function isFieldMap(proto, field) {
    if (isFieldMessage(field)) {
        var msg = proto.resolveTypeMetadata(field.typeName).message;
        if (msg && msg.options.mapEntry) {
            return true;
        }
    }
    return false;
}
exports.isFieldMap = isFieldMap;
function getMapKeyValueFields(proto, field) {
    var msg = proto.resolveTypeMetadata(field.typeName).message;
    var key = msg.fieldList.find(function (f) { return f.name === 'key'; });
    var value = msg.fieldList.find(function (f) { return f.name === 'value'; });
    return [key, value];
}
exports.getMapKeyValueFields = getMapKeyValueFields;
function isFieldMessage(field) {
    return field.type === types_1.ProtoMessageFieldType.message || field.type === types_1.ProtoMessageFieldType.group;
}
exports.isFieldMessage = isFieldMessage;
function getDataType(proto, field, options) {
    if (options === void 0) { options = {}; }
    if (isFieldMap(proto, field)) {
        var _a = (0, tslib_1.__read)(getMapKeyValueFields(proto, field), 2), key = _a[0], value = _a[1];
        return "{ [prop: ".concat(key.type === types_1.ProtoMessageFieldType.string || isNumberString(key) ? 'string' : 'number', "]: ").concat(getDataType(proto, value, options), "; }");
    }
    var suffix = !options.ignoreRepeating && field.label === types_1.ProtoMessageFieldCardinality.repeated ? '[]' : '';
    if (field.type === types_1.ProtoMessageFieldType.enum || isFieldMessage(field)) {
        return proto.getRelativeTypeName(field.typeName)
            + (options.asObjectDataType ? '.AsObject' : options.asProtobufJSONDataType ? '.AsProtobufJSON' : '')
            + suffix;
    }
    switch (field.type) {
        case types_1.ProtoMessageFieldType.string:
            return 'string' + suffix;
        case types_1.ProtoMessageFieldType.fixed64:
        case types_1.ProtoMessageFieldType.int64:
        case types_1.ProtoMessageFieldType.sfixed64:
        case types_1.ProtoMessageFieldType.sint64:
        case types_1.ProtoMessageFieldType.uint64:
            return (isNumberString(field) ? 'string' : 'number') + suffix;
        case types_1.ProtoMessageFieldType.bool:
            return 'boolean' + suffix;
        case types_1.ProtoMessageFieldType.bytes:
            return 'Uint8Array' + suffix;
        case types_1.ProtoMessageFieldType.double:
        case types_1.ProtoMessageFieldType.fixed32:
        case types_1.ProtoMessageFieldType.float:
        case types_1.ProtoMessageFieldType.int32:
        case types_1.ProtoMessageFieldType.sfixed32:
        case types_1.ProtoMessageFieldType.sint32:
        case types_1.ProtoMessageFieldType.uint32:
            return 'number' + suffix;
        default: throw new Error('Unknown data type ' + field.type);
    }
}
exports.getDataType = getDataType;
function isPacked(proto, field) {
    var explicitlyPacked = !!field.options.packed;
    var implicitlyPacked = proto.syntax === 'proto3'
        && typeof field.options.packed === 'undefined'
        && field.label === types_1.ProtoMessageFieldCardinality.repeated
        && [
            types_1.ProtoMessageFieldType.int32,
            types_1.ProtoMessageFieldType.int64,
            types_1.ProtoMessageFieldType.uint32,
            types_1.ProtoMessageFieldType.uint64,
            types_1.ProtoMessageFieldType.sint32,
            types_1.ProtoMessageFieldType.sint64,
            types_1.ProtoMessageFieldType.fixed32,
            types_1.ProtoMessageFieldType.fixed64,
            types_1.ProtoMessageFieldType.sfixed32,
            types_1.ProtoMessageFieldType.sfixed64,
            types_1.ProtoMessageFieldType.float,
            types_1.ProtoMessageFieldType.double,
            types_1.ProtoMessageFieldType.bool,
            types_1.ProtoMessageFieldType.enum,
        ].includes(field.type);
    return explicitlyPacked || implicitlyPacked;
}
exports.isPacked = isPacked;
var alwaysNumber = [
    types_1.ProtoMessageFieldType.double,
    types_1.ProtoMessageFieldType.fixed32,
    types_1.ProtoMessageFieldType.float,
    types_1.ProtoMessageFieldType.int32,
    types_1.ProtoMessageFieldType.sfixed32,
    types_1.ProtoMessageFieldType.sint32,
    types_1.ProtoMessageFieldType.uint32,
];
var implicitlyString = [
    types_1.ProtoMessageFieldType.fixed64,
    types_1.ProtoMessageFieldType.int64,
    types_1.ProtoMessageFieldType.sfixed64,
    types_1.ProtoMessageFieldType.sint64,
    types_1.ProtoMessageFieldType.uint64,
];
function isNumberNumber(field) {
    var always = alwaysNumber.includes(field.type);
    var explicitly = implicitlyString.includes(field.type) && field.options.jstype === 2;
    return isNumeric(field) && (always || explicitly);
}
exports.isNumberNumber = isNumberNumber;
function isNumberString(field) {
    return isNumeric(field) && !isNumberNumber(field);
}
exports.isNumberString = isNumberString;
function isNumeric(field) {
    return (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(alwaysNumber), false), (0, tslib_1.__read)(implicitlyString), false).includes(field.type);
}
exports.isNumeric = isNumeric;
//# sourceMappingURL=helpers.js.map