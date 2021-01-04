"use strict";
const capitalize = (s) => {
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};
const clientList = [
    { name: 'Gabriel', old: 28 },
    { name: 'Keila', old: 32 }
];
const keys = Object.keys(clientList[0]);
const columns = keys.map((k) => ({
    header: capitalize(k),
    key: k,
    width: k.length * 2
}));
console.log(keys);
console.log(columns);
//# sourceMappingURL=teste.js.map