// ==UserScript==
// @name         Vim Patch for Colab
// @namespace    http://github.com/brentyi/vim-patch-for-colab
// @version      0.2
// @description  Adds support for Vim bindings outside of code cells
// @author       brentyi
// @match        https://colab.research.google.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  let unsafeWindow = window.wrappedJSObject;
  let timer = setInterval(() => {
    let monaco = unsafeWindow.monaco;

    // Run whenever Monaco is ready (hacky)
    if (monaco && "editor" in monaco) {
      unsafeWindow.require(
        ["vs/editor/editor.main", "monaco-vim"],
        (_, MonacoVim) => {
          console.log("Initializing monaco-vim");
          monaco.editor.onDidCreateEditor((editor) => {
            if (editor._domElement.closest(".codecell-input-output") !== null) {
              // Ignore code cells
              return;
            }

            // Add statusbar
            let statusNode = document.createElement("div");
            statusNode.classList.add("monaco-vim-statusbar");
            editor._domElement.parentNode.appendChild(statusNode);
            editor._domElement.parentNode.style.flexDirection = "column";

            // Init Vim mode
            MonacoVim.initVimMode(editor, statusNode);
          });
        }
      );
      clearInterval(timer);
    } else {
      console.log("Monaco not ready; will retry");
    }
  }, 500);
})();
