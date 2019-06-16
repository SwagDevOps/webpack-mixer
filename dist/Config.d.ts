import { Path } from './Path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
/**
 * Describe config
 */
export declare class Config {
    readonly paths: {
        [key: string]: Path;
    };
    protected config: {
        [key: string]: any;
    };
    constructor(paths: {
        [key: string]: Path;
    });
    /**
     * Path where module is installed.
     */
    protected readonly modulePath: Path;
    configure(config?: {
        [key: string]: any;
    }): this;
    readonly cleanables: Path[];
    readonly buildables: Path[][];
    readonly copiables: Path[][];
    /**
     * Get webpack config.
     */
    readonly webpackConfig: object;
    /**
     * Get module root paths.
     *
     * @see https://github.com/tleunen/babel-plugin-module-resolver/issues/81
     */
    readonly moduleRoots: Path[];
    /**
     * @see Mixer.configure()
     */
    protected readonly defaults: object;
    protected makeCleanWebpackPlugin(): CleanWebpackPlugin;
    /**
     * @returns {WebpackNotifierPlugin}
     *
     * @see https://github.com/mikaelbr/node-notifier/issues/188
     * @see https://github.com/devanandb/webpack-mix/blob/0f61f71cf302acfcfb9f2e42004404f95eefbef4/src/components/Notifications.js#L3
     */
    protected makeWebpackNotifierPlugin(): any;
    /**
     * @returns {ExtraWatchWebpackPlugin}
     */
    protected makeExtraWatchWebpackPlugin(): any;
    /**
     * @returns {VersionFile}
     */
    protected makeVersionFilePlugin(): any;
}
