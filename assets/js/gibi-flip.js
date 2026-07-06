/* ==========================================
   GIBI-FLIP.JS
   Syncann Editorial OS
========================================== */

async function initGibiFlip(containerId, pdfPath) {

    const container = document.getElementById(containerId);

    if (!container || container.dataset.loaded) return;

    container.dataset.loaded = "true";

    container.innerHTML = `
        <div style="
            color:#fff;
            padding:30px;
            text-align:center;
        ">
            Carregando Gibi...
        </div>
    `;

    try {

        const pdf = await pdfjsLib
            .getDocument(pdfPath)
            .promise;

        const pages = [];
        const scale = window.devicePixelRatio > 1 ? 2.5 : 2;

        for (let i = 1; i <= pdf.numPages; i++) {

            const page = await pdf.getPage(i);

            const viewport = page.getViewport({
                scale
            });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport
            }).promise;

            const pageDiv = document.createElement("div");
            pageDiv.className = "page";
            pageDiv.appendChild(canvas);

            pages.push(pageDiv);

        }

        container.innerHTML = "";

        const flipBook = new St.PageFlip(container, {

            width: 700,
            height: 1050,

            size: "stretch",
            minWidth: 300,
            maxWidth: 1200,

            minHeight: 450,
            maxHeight: 1800,

            autoSize: true,

            showCover: true,
            usePortrait: false,

            drawShadow: true,
            mobileScrollSupport: true,

            flippingTime: 800

        });

        container.flipBook = flipBook;

        flipBook.loadFromHTML(pages);

        const root = container.closest(".gibi-viewer") || container.parentElement;

        const prevBtn = root.querySelector("#prev-page");
        const nextBtn = root.querySelector("#next-page");
        const fullscreenBtn = root.querySelector("#fullscreen");
        const indicator = root.querySelector("#page-indicator");

        if (indicator) {
            indicator.textContent = `1 / ${pdf.numPages}`;
        }

        prevBtn?.addEventListener("click", () => {
            flipBook.flipPrev();
        });

        nextBtn?.addEventListener("click", () => {
            flipBook.flipNext();
        });

        fullscreenBtn?.addEventListener("click", async () => {

            try {

                if (!document.fullscreenElement) {
                    await root.requestFullscreen?.();
                } else {
                    await document.exitFullscreen?.();
                }

            } catch (err) {
                console.error(err);
            }

        });

        flipBook.on("flip", ({ data }) => {

            if (indicator) {
                indicator.textContent = `${data + 1} / ${pdf.numPages}`;
            }

        });

    }
    catch (err) {

        console.error(err);

        container.dataset.loaded = "";

        container.innerHTML = `
            <div style="
                color:#fff;
                padding:20px;
                text-align:center;
            ">
                Erro ao carregar PDF.
            </div>
        `;

    }

}

/* ==========================================
   AUTO START
========================================== */

const observer = new MutationObserver(() => {

    document
        .querySelectorAll("[id^='flipbook']")
        .forEach(container => {

            if (container.dataset.loaded) return;

            const numero = container.id.match(/\d+$/)?.[0];

            if (!numero) return;

            initGibiFlip(
                container.id,
                `assets/bd/gibi${numero}-syncann.pdf`
            );

        });

});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
