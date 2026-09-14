(() => {
    const copyText = async value => {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(value);
            return;
        }
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
    };

    document.querySelectorAll("main pre > code").forEach((code, index) => {
        const pre = code.parentElement;
        let wrapper = pre.closest(".code-block");
        if (!wrapper) {
            wrapper = document.createElement("div");
            wrapper.className = "code-block";
            pre.before(wrapper);
            wrapper.append(pre);
        }
        let button = wrapper.querySelector(":scope > .copy-button");
        if (!button) {
            button = document.createElement("button");
            button.type = "button";
            button.className = "copy-button";
            button.textContent = "Copy";
            wrapper.prepend(button);
        }
        button.setAttribute("aria-label", `Copy code block ${index + 1}`);
        let reset;
        button.addEventListener("click", async () => {
            try {
                await copyText(code.textContent);
                button.textContent = "Copied!";
                button.setAttribute("aria-label", "Code copied");
            } catch (_) {
                button.textContent = "Copy failed";
            }
            clearTimeout(reset);
            reset = setTimeout(() => {
                button.textContent = "Copy";
                button.setAttribute("aria-label", `Copy code block ${index + 1}`);
            }, 1400);
        });
    });
})();
