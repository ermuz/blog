import type { RollupAliasOptions, ResolvedAlias } from '@rollup/plugin-alias';
import type { Plugin } from 'rollup'

function getEnties({ entries, customResolver }: RollupAliasOptions): ResolvedAlias[] {
    if (!entries) return [];
    return []
}

export default function alias(options: RollupAliasOptions): Plugin {
    const enties = getEnties(options);
    if (!enties.length) return {
        name: 'alias',
        resolveId: () => void 0,
    }
    return {
        name: 'alias',

    }
}