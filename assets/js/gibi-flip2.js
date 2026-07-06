/* ==========================================
   GIBI-FLIP.JS
   Syncann Editorial OS
========================================== */
async function initGibiFlip(containerId, pdfPath){

    const container = document.getElementById(containerId);

    if (!container) return;

   // evita inicialização duplicada
    if (container.dataset.loaded) return;

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

    try{

        const pdf =
            await pdfjsLib
                .getDocument(pdfPath)
                .promise;

        const pages = [];

        for(
            let i=1;
            i<=pdf.numPages;
            i++
        ){

            const page =
                await pdf.getPage(i);

            const viewport =
                page.getViewport({
                    scale:2
                });

            const canvas =
                document.createElement(
                    "canvas"
                );

            canvas.width =
                viewport.width;

            canvas.height =
                viewport.height;

            await page.render({
                canvasContext:
                    canvas.getContext(
                        "2d"
                    ),
                viewport
            }).promise;

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "page";

            div.appendChild(
                canvas
            );

            pages.push(div);
        }

        container.innerHTML =
            "";

        const flipBook =
            new St.PageFlip(
                container,
                {
                    width:768,
                    height:1152,

                    size:"stretch",

                    minWidth:300,
                    maxWidth:1400,

                    minHeight:400,
                    maxHeight:2200,

                    autoSize:true,

                    usePortrait:true,

                    showCover:true,

                    drawShadow:true,

                    mobileScrollSupport:true,

                    flippingTime:800
                }
            );

        flipBook.loadFromHTML(
            pages
        );

        document
            .getElementById(
                "next-page"
            )
            ?.addEventListener(
                "click",
                ()=>flipBook.flipNext()
            );

        document
            .getElementById(
                "prev-page"
            )
            ?.addEventListener(
                "click",
                ()=>flipBook.flipPrev()
            );

        flipBook.on(
            "flip",
            e=>{

                const indicator =
                    document.getElementById(
                        "page-indicator"
                    );

                if(indicator){

                    indicator.innerText =
                        `${e.data+1}/${pdf.numPages}`;
                }
            }
        );

    }
    catch(err){

        console.error(err);

        container.innerHTML =
            `
            <div style="
                color:white;
                padding:20px;
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

    for (let i = 1; i <= 3; i++) {

        const flipbook = document.getElementById(`flipbook${i}`);

        if (flipbook && !flipbook.dataset.loaded) {

            initGibiFlip(
                `flipbook${i}`,
                `assets/bd/gibi${i}-syncann.pdf`
            );

            break;
        }
    }

});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
