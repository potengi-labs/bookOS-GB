function initGibiFlip() {

    const flipContainer =
        document.getElementById("flipbook");

    if (!flipContainer) return;

    const flipBook = new St.PageFlip(
        flipContainer,
        {
            width:768,
            height:1152,

            size:"stretch",

            minWidth:320,
            maxWidth:1200,

            minHeight:480,
            maxHeight:1800,

            autoSize:true,

            usePortrait:true,

            showCover:true,

            drawShadow:true,

            mobileScrollSupport:true
        }
    );

    flipBook.loadFromHTML(
        document.querySelectorAll(".page")
    );

    document
        .getElementById("next")
        ?.addEventListener(
            "click",
            ()=>flipBook.flipNext()
        );

    document
        .getElementById("prev")
        ?.addEventListener(
            "click",
            ()=>flipBook.flipPrev()
        );
}
