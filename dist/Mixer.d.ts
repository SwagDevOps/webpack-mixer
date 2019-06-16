import { Config } from './Config';
import { Path } from './Path';
/**
 * Wrapper built on top of Laravel Mix.
 *
 * @see https://laravel-mix.com/
 * @see https://laravel.com/docs/5.8/mix
 */
export declare class Mixer {
    readonly paths: {
        [key: string]: Path;
    };
    protected config: Config;
    protected _mix: any;
    constructor(paths?: {
        [key: string]: Path | string;
    });
    /**
     * Configure with given config.
     *
     * @param config {object}
     * @returns {this}
     */
    configure(config?: object): this;
    protected readonly mix: any;
    run(): this;
    /**
     * @returns {this}
     */
    protected mixSourceMaps(): this;
    /**
     * @returns {this}
     */
    protected mixCopiables(): this;
    /**
     * @returns {this}
     */
    protected mixBuildables(): this;
    /**
     * Get current working directory.
     */
    readonly cwd: Path;
}
