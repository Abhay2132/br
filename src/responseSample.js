function getResult() {
    let tag = document.querySelectorAll("#midd_part_UN b");
    if (tag.length) return { error: tag[0].textContent };
    let markstags = document.querySelectorAll("tr > td > table > tbody > tr > td > table > tbody > tr > td.border1"),
        pdtags = document.querySelectorAll("div#midd_part_UN > table > tbody > tr > td > table > tbody > tr > td.border1");
    let result = {
        name: pdtags[3].textContent,
        rollno: pdtags[1].textContent,
        enrollno: pdtags[5].textContent,
        result: pdtags[pdtags.length - 1].textContent,
        tm: pdtags[pdtags.length - 3].textContent
    },
        a = [
            markstags[10].textContent, markstags[11].textContent, markstags[12].textContent, markstags[13].textContent, markstags[18].textContent
        ],
        b = [markstags[20].textContent, markstags[21].textContent, markstags[22].textContent, markstags[23].textContent, markstags[28].textContent
        ],
        c = [markstags[30].textContent, markstags[31].textContent, markstags[32].textContent, markstags[33].textContent, markstags[38].textContent
        ]
    result.sub = pdtags[13].textContent[0] == "M" ? "PCM" : "ZBC";
    let subOrder = pdtags[11].textContent[0] + pdtags[12].textContent[0] + pdtags[13].textContent[0]
    result[subOrder[0]] = a;
    result[subOrder[1]] = b;
    result[subOrder[2]] = c;
    return result;
}

getResult()