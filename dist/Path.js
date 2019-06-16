'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require('simple-glob');
var path = require('path');
var fs = require('fs');
var chdir = require('chdir');
var process = require('process');
/**
 * Path represents the name of a file or directory on the filesystem, but not the file itself.
 */
var Path = /** @class */ (function () {
    function Path(path) {
        this._path = path.toString();
    }
    Object.defineProperty(Path.prototype, "extension", {
        get: function () {
            return path.extname(this.toString()).replace(/^\./, '');
        },
        enumerable: true,
        configurable: true
    });
    Path.prototype.join = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        var fp = path.join.apply(path, ([this.toString()].concat(parts)));
        return new Path(fp);
    };
    Path.prototype.stat = function () {
        return fs.lstatSync(this.toString());
    };
    Path.prototype.exists = function () {
        return fs.existsSync(this.toString());
    };
    /**
     * Return an array of all file paths matching the given wildcard pattern.
     *
     * @see https://github.com/jedmao/simple-glob
     */
    Path.prototype.glob = function (pattern, absolute) {
        if (absolute === void 0) { absolute = true; }
        var self = this;
        var matches = [];
        var directory = this.toString();
        var patterns = Array.isArray(pattern) ? pattern : [pattern];
        if (this.exists() && this.stat().isDirectory()) {
            chdir(directory, function () {
                matches = glob(patterns)
                    .map(function (fp) {
                    return absolute ? self.join(fp) : new Path(fp);
                });
            });
        }
        return matches;
    };
    /**
     * Returns a string representation of a string.
     */
    Path.prototype.toString = function () {
        return this._path.toString();
    };
    /**
     * Determines whether two strings are equivalent in the current locale.
     * @param comparable String to compare to target string
     */
    Path.prototype.localeCompare = function (comparable) {
        return this.toString().localeCompare(comparable.toString());
    };
    /**
     * Get current working directory.
     */
    Path.cwd = function () {
        return new Path(process.cwd());
    };
    return Path;
}());
exports.Path = Path;
