export const createDebounce = function(fn: () => any, tick: number, delay: number): () => void {
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
