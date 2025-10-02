import { useCallback, useState } from 'react';

type StateUpdater<S> =
    | Partial<S>
    | ((previous: S) => Partial<S>);

const resolvePatch = <S,>(patch: StateUpdater<S>, previous: S): Partial<S> => {
    return typeof patch === 'function' ? patch(previous) : patch;
};

const useMergeState = <S,>(initialState: S): [S, (patch: StateUpdater<S>) => void] => {
    const [state, setState] = useState<S>(initialState);

    const mergeState = useCallback((patch: StateUpdater<S>) => {
        setState((previous) => ({
            ...previous,
            ...resolvePatch(patch, previous)
        }));
    }, []);

    return [state, mergeState];
};

export default useMergeState;
