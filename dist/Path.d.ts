/// <reference types="node" />
import { Stats } from 'fs';
/**
 * Path represents the name of a file or directory on the filesystem, but not the file itself.
 */
export declare class Path {
    readonly _path: string;
    constructor(path: string | Path);
    readonly extension: string;
    join(...parts: string[]): Path;
    stat(): Stats;
    exists(): boolean;
    /**
     * Return an array of all file paths matching the given wildcard pattern.
     *
     * @see https://github.com/jedmao/simple-glob
     */
    glob(pattern: string | string[], absolute?: boolean): string[] | Path[];
    /**
     * Returns a string representation of a string.
     */
    toString(): string;
    /**
     * Determines whether two strings are equivalent in the current locale.
     * @param comparable String to compare to target string
     */
    localeCompare(comparable: string | Path): number;
    /**
     * Get current working directory.
     */
    static cwd(): Path;
}
