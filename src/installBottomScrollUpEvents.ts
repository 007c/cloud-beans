import eventBus from "./event-bus";

let isUserTouch = false;

window.addEventListener("touchstart", () => {
    isUserTouch = true;
})

window.addEventListener("touchend", () => {
    isUserTouch = false
})

window.addEventListener("touchmove", (event: TouchEvent) => {
    if (event.touches.length !== 0) {
        isUserTouch = true;
    }
})

window.addEventListener('scroll', function (event: Event) {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollY = window.scrollY;
    if (scrollHeight - clientHeight <= scrollY && isUserTouch) {
        eventBus.$emit("bottomScrollUp");
    }
})

