export const createDebounce = function (fn: Function, tick: number, delay: number) {
    let now = + new Date();
    let timerId: number | undefined;

    return function () {
        let timeStamp = +new Date();
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