/* ==========================================
   TAB-LOADER.JS
   Syncann Editorial OS
========================================== */

async function loadTab(tabName) {

    const container =
        document.getElementById(
            "tab-container"
        );

    if (!container) return;

    try {

        const response =
            await fetch(
                `assets/tabs/${tabName}.html`
            );

        if (!response.ok)
            throw new Error(
                "Tab não encontrada"
            );

        container.innerHTML =
            await response.text();

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="card">
                <h3>Erro ao carregar conteúdo</h3>
                <p>${tabName}</p>
            </div>
        `;
    }
}


/* ==========================================
   MENU
========================================== */

function initTabs() {

    const tabs =
        document.querySelectorAll(
            ".tab"
        );

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(btn =>
                    btn.classList.remove(
                        "active"
                    )
                );

                tab.classList.add(
                    "active"
                );

                loadTab(
                    tab.dataset.target
                );
            }
        );
    });

}


/* ==========================================
   START
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initTabs();

        const active =
            document.querySelector(
                ".tab.active"
            );

        if (active) {

            loadTab(
                active.dataset.target
            );

        }
    }
);
