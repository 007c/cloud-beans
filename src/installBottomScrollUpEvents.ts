import eventBus from "./event-bus";

window.addEventListener('scroll', function () {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollY = window.scrollY;
    if (scrollHeight - clientHeight <= scrollY) {
        eventBus.$emit("bottomScrollUp");
    }
})

