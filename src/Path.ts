'use strict';

/* global require */

import {Stats} from 'fs'

const glob = require('simple-glob');
const path = require('path');
const fs = require('fs');
const chdir = require('chdir');
const process = require('process');

/**
 * Path represents the name of a file or directory on the filesystem, but not the file itself.
 */
export class Path {
    readonly _path: string;

    constructor(path: string | Path) {
        this._path = path.toString()
    }

    get extension(): string {
        return path.extname(this.toString()).replace(/^\./, '')
    }

    join(...parts: string[]): Path {
        let fp = path.join(...([this.toString()].concat(parts)));

        return new Path(fp)
    }

    stat(): Stats {
        return fs.lstatSync(this.toString())
    }

    exists(): boolean {
        return fs.existsSync(this.toString())
    }

    /**
     * Return an array of all file paths matching the given wildcard pattern.
     *
     * @see https://github.com/jedmao/simple-glob
     */
    glob(pattern: string | string[], absolute: boolean = true) {
        let self = this;
        let matches: string[] | Path[] = [];
        let directory = this.toString();
        let patterns: string[] = Array.isArray(pattern) ? pattern : [pattern];

        if (this.exists() && this.stat().isDirectory()) {
            chdir(directory, function () {
                matches = glob(patterns)
                    .map(function (fp: string) {
                        return absolute ? self.join(fp) : new Path(fp)
                    })
            })
        }

        return matches;
    }

    /**
     * Returns a string representation of a string.
     */
    toString(): string {
        return this._path.toString()
    }

    /**
     * Determines whether two strings are equivalent in the current locale.
     * @param comparable String to compare to target string
     */
    localeCompare(comparable: string | Path): number {
        return this.toString().localeCompare(comparable.toString())
    }

    /**
     * Get current working directory.
     */
    static cwd(): Path {
        return new Path(process.cwd())
    }
}
