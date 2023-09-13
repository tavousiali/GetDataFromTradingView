document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    Array.from(
      document.querySelectorAll(
        ".display-inline-block.vertical-align-middle.cursor-pointer"
      )
    ).map((x) => {
      const symbol = x.innerHTML.trim().slice(0, -1);
      return x.insertAdjacentHTML(
        "beforebegin",
        `<img style="width: 16px; height: 16px; margin: 2px 4px; cursor: pointer" onclick="window.open('https://tech.nadpco.com/Home/newTradingView?symbol=${symbol
          .replace(/ك/g, "ک")
          .replace(/ی/g, "ی")
          .replace(
            /ى/g,
            "ی"
          )}', '_blank')" src="https://nadpco.com/favicon.ico" />`
      );
    });
  }, 10000);
});
