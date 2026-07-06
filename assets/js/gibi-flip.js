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
            color:white;
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

        for (let i = 1; i <= pdf.numPages; i++) {

            const page = await pdf.getPage(i);

            const viewport = page.getViewport({
                scale: 2
            });

            const canvas = document.createElement("canvas");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: canvas.getContext("2d"),
                viewport
            }).promise;

            const div = document.createElement("div");
            div.className = "page";
            div.appendChild(canvas);

            pages.push(div);

        }

        container.innerHTML = "";

       const flipBook = new St.PageFlip(container, {

          width: 450,
          height: 675,
      
          size: "fixed",
      
          minWidth: 450,
          maxWidth: 450,
      
          minHeight: 675,
          maxHeight: 675,
      
          autoSize: false,
      
          usePortrait: true,
          showCover: true,
          drawShadow: true,
          mobileScrollSupport: true,
          flippingTime: 800
      
      });

        flipBook.loadFromHTML(pages);

        const root = container.parentElement;

        const nextBtn = root.querySelector(".next-page");
        const prevBtn = root.querySelector(".prev-page");
        const indicator = root.querySelector(".page-indicator");

        if (indicator) {
            indicator.innerText = `1/${pdf.numPages}`;
        }

        nextBtn?.addEventListener("click", () => flipBook.flipNext());

        prevBtn?.addEventListener("click", () => flipBook.flipPrev());

        flipBook.on("flip", e => {

            if (indicator) {
                indicator.innerText = `${e.data + 1}/${pdf.numPages}`;
            }

        });

    }
    catch (err) {

        console.error(err);

        container.innerHTML = `
            <div style="
                color:white;
                padding:20px;
                text-align:center;
            ">
                Erro ao carregar PDF
            </div>
        `;
    }

}

/* ==========================================
   AUTO START
========================================== */

const observer = new MutationObserver(() => {

    document.querySelectorAll("[id^='flipbook']").forEach(container => {

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
