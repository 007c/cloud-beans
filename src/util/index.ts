export const createDebounce = function(fn: () => () => void, tick: number, delay: number) {
    let now = + new Date();
    let timerId: number | undefined;

    return function() {
        const timeStamp = +new Date();
        if (timeStamp - now >= delay) {
            fn();
            now = timeStamp;
        } else {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                fn();
                now = +new Date();
            }, tick)
        }
    }
}
