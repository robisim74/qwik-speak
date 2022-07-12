import { component$ } from '@builder.io/qwik';

/**
 * Components that use translate hooks will be rerendered when locale changes
 */
export const Hooks = component$(
    () => {
        return (
            <div></div>
        );
    },
    {
        tagName: 'hooks',
    }
);
