"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    var option = "asdADSFAAFabsnmfbandbfn133214t23y819";
    var length = option.length;
    var ans = "";
    for (var i = 0; i < length; i++) {
        ans += option[Math.floor((Math.random() * length))];
    }
    return ans;
}
