let resloveGuide: () => any;
let rejectGuide: () => any;

export function startAsyncGuide() {
    return new Promise((reslove, reject) => {
        resloveGuide = reslove;
        rejectGuide = reject;
    })
}

export const getReslover = function () {
    return resloveGuide;
}
export const getRejecter = function () {
    return rejectGuide;
}
