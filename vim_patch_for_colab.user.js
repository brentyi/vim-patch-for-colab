// ==UserScript==
// @name         Vim Patch for Colab
// @namespace    http://github.com/brentyi/vim-patch-for-colab
// @version      0.3
// @description  Adds support for Vim bindings outside of code cells
// @author       brentyi
// @match        https://colab.research.google.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  const unsafeWindow = window.wrappedJSObject;
  const timer = setInterval(() => {
    const monaco = unsafeWindow.monaco;

    // Wait for Monaco to be ready (hacky)
    if (!monaco || !("editor" in monaco)) {
      console.log("Monaco not ready; will retry");
      return;
    }

    unsafeWindow.require(
      ["vs/editor/editor.main", "monaco-vim"],
      (_, MonacoVim) => {
        console.log("Initializing monaco-vim");
        monaco.editor.onDidCreateEditor((editor) => {
          // Ignore code cells
          if (editor._domElement.closest(".codecell-input-output") !== null) {
            return;
          }

          // Add statusbar
          const statusNode = document.createElement("div");
          statusNode.classList.add("monaco-vim-statusbar");
          editor._domElement.parentNode.appendChild(statusNode);
          editor._domElement.parentNode.style.flexDirection = "column";

          // Init Vim mode
          MonacoVim.initVimMode(editor, statusNode);
        });
      }
    );
    clearInterval(timer);
  }, 500);
})();
