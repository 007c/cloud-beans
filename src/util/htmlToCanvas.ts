import html2Canvas from "html2canvas";


function loadWaterMark(path: string): Promise<HTMLImageElement> {
    return new Promise(function (resolve, reject) {
        const image = new Image();
        image.onload = function () {
            resolve(image);
        }

        image.onerror = function () {
            reject(image);
        }

        image.src = path;
    })
}

export async function toCanvas(element: HTMLElement, ignoreElements: Element[] = []) {
    // const [logoWaterMark, textWaterMark] = await Promise.all([
    //     loadWaterMark("/static/img/logo.png"),
    //     loadWaterMark("/static/img/logo.png")
    // ])

    const screenWidth = window.screen.width;
    // const { naturalWidth: textImgWidth, naturalHeight: textImgHeight } = textWaterMark;
    // const { naturalWidth: logoImgWidth, naturalHeight: logoImgHeight } = logoWaterMark;
    // const textScale = screenWidth / textImgWidth;
    // const logoScale = screenWidth / logoImgHeight;
    // const offsetTop = textScale * textImgHeight + 20;
    const elementRect = element.getBoundingClientRect();
    const canvas: HTMLCanvasElement = await html2Canvas(element, {
        ignoreElements(elements) {
            return ignoreElements.indexOf(elements) !== -1 || elements.tagName === "hr"
        },
        y: element.offsetTop,
        scale: window.devicePixelRatio,
        // height: elementRect.height + offsetTop + logoScale * logoImgHeight
    })

    // canvas.id = "wxSaveImageToPhoto";

    // const ctx = canvas.getContext("2d");
    // if (ctx) {
    //     ctx.drawImage(
    //         textWaterMark,
    //         0,
    //         0,
    //         textImgWidth * textScale,
    //         textImgHeight * textScale
    //     );

    //     ctx.drawImage(
    //         logoWaterMark,
    //         0,
    //         elementRect.height + offsetTop,
    //         logoImgWidth * logoScale,
    //         logoImgHeight * logoScale
    //     );
    // }

    return canvas;
}
