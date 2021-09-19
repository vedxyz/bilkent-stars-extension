const observer = new MutationObserver(() => {
    let theadNode = document.querySelector("#poTable > thead");
    theadNode.style.position = "sticky";
    theadNode.style.top = 0;
    
    document.querySelectorAll("#poTable tbody tr td:nth-child(3) div a[href^='javascript:openEvalForInstructor']").forEach(rowSyllabusLink => {
        rowSyllabusLink.setAttribute("href", `/evalreport/index.php?mode=ins&insId=${rowSyllabusLink.getAttribute("href").split("'")[1]}`);
    });
});

observer.observe(
    document.querySelector("#DHTMLSuite_paneContentcenter"),
    { attributes: false, childList: true, subtree: true }
);
