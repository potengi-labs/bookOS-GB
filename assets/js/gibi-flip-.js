const flipBook = new St.PageFlip(
    document.getElementById("flipbook"),
    {
        width:300,
        height:500,

        size:"stretch",

        minWidth:315,
        maxWidth:1000,

        minHeight:420,
        maxHeight:1350,

        showCover:true,
        autoSize:true,

        usePortrait:true,
        mobileScrollSupport:false,

        maxShadowOpacity:0.6,

        flippingTime:800,

        drawShadow:true
    }
);

flipBook.loadFromHTML(
    document.querySelectorAll(".page")
);

document
.getElementById("next")
.onclick = ()=>flipBook.flipNext();

document
.getElementById("prev")
.onclick = ()=>flipBook.flipPrev();
