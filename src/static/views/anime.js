function pop ( tag , tt = 200){
    var init_trans = tag.style.transition;
    tag.style.transition = "0.1s";
    tag.style.transform = "scale(0.9)";
    setTimeout(() => {
        tag.style.transform = "scale(1)";
        tag.style.transition = init_trans;
    }, tt)
}

function pressed ( tag , bs = false){
    tag.style.transition = "0.2s";
    tag.style.transform = "translateY(3px)";
    if(bs) tag.style.boxShadow = "0px 1px 1px #666"
    setTimeout(() => {
        tag.style.transform = "translateY(0px)";
    	if(bs) tag.style.boxShadow = "0px 4px 1px #666"
    }, 200)
}
