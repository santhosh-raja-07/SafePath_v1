


// document.getElementById('translateButton').addEventListener('click', async () => {
//     const targetLanguage = "ta"; // Tamil language code

//     // Initialize a TreeWalker to traverse text nodes
//     const walker = document.createTreeWalker(
//         document.body,
//         NodeFilter.SHOW_TEXT,
//         { acceptNode: (node) => /\S/.test(node.nodeValue) }
//     );

//     // Traverse and translate each text node
//     while (walker.nextNode()) {
//         const node = walker.currentNode;
//         const text = node.nodeValue.trim();
//         const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

//         try {
//             const response = await fetch(translateUrl);
//             const data = await response.json();
//             if (data && data[0] && data[0][0] && typeof data[0][0][0] === 'string') {
//                 const translatedText = data[0][0][0];
//                 node.textContent = translatedText; // Update the text node with the translated text
//             } else {
//                 console.error("Unexpected format in translation data:", data);
//             }
//         } catch (error) {
//             console.error("Error fetching translation:", error);
//         }
//     }
// });




const language = document.querySelector(".languagebtn");

// Store original text content of each node
const originalTextContent = new Map();

document.addEventListener("DOMContentLoaded", () => {
    // Initialize a TreeWalker to traverse text nodes and store original content
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        { acceptNode: (node) => /\S/.test(node.nodeValue) }
    );

    while (walker.nextNode()) {
        const node = walker.currentNode;
        originalTextContent.set(node, node.nodeValue.trim());
    }
});

language.addEventListener("click", () => {
    const languageSelect = document.querySelector(".translate");
    languageSelect.style.display = "initial"; // Show the language selector

    languageSelect.addEventListener("change", async () => {
        const langEnglish=document.getElementById("lang-english");
        const langTamil=document.getElementById("lang-tamil");
        const langTelugu=document.getElementById("lang-telugu");
        const langHindi=document.getElementById("lang-hindi");

        const selectedLanguage = languageSelect.value;
        setTimeout(async () => {
            languageSelect.style.display = "none"; // Hide the selector after selecting

            if (selectedLanguage === "english") {
                // Restore original English text content
                originalTextContent.forEach((text, node) => {
                    node.nodeValue = text;
                });
            } else if (selectedLanguage === "tamil") {
                const targetLanguage = "ta"; // Tamil language code

                // Traverse and translate each text node
                for (const [node, originalText] of originalTextContent.entries()) {
                    const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(originalText)}`;

                    try {
                        const response = await fetch(translateUrl);
                        const data = await response.json();
                        if (data && data[0] && data[0][0] && typeof data[0][0][0] === 'string') {
                            const translatedText = data[0][0][0];
                            node.nodeValue = translatedText; // Update the text node with the translated text
                            langEnglish.textContent="English";
                            langTamil.textContent="Tamil";
                            langTelugu.textContent="Telugu";
                            langHindi.textContent="Hindi";

                        } else {
                            console.error("Unexpected format in translation data:", data);
                        }
                    } catch (error) {
                        console.error("Error fetching translation:", error);
                    }
                }
            }

            else if (selectedLanguage === "telugu") {
                const targetLanguage = "te"; // Telugu language code

                // Traverse and translate each text node
                for (const [node, originalText] of originalTextContent.entries()) {
                    const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(originalText)}`;

                    try {
                        const response = await fetch(translateUrl);
                        const data = await response.json();
                        if (data && data[0] && data[0][0] && typeof data[0][0][0] === 'string') {
                            const translatedText = data[0][0][0];
                            node.nodeValue = translatedText; // Update the text node with the translated text
                            langEnglish.textContent="English";
                            langTamil.textContent="Tamil";
                            langTelugu.textContent="Telugu";
                            langHindi.textContent="Hindi";
                        } else {
                            console.error("Unexpected format in translation data:", data);
                        }
                    } catch (error) {
                        console.error("Error fetching translation:", error);
                    }
                }
            }

            else if (selectedLanguage === "hindi") {
                const targetLanguage = "hi"; // Hindi language code

                // Traverse and translate each text node
                for (const [node, originalText] of originalTextContent.entries()) {
                    const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(originalText)}`;

                    try {
                        const response = await fetch(translateUrl);
                        const data = await response.json();
                        if (data && data[0] && data[0][0] && typeof data[0][0][0] === 'string') {
                            const translatedText = data[0][0][0];
                            node.nodeValue = translatedText; // Update the text node with the translated text
                            langEnglish.textContent="English";
                            langTamil.textContent="Tamil";
                            langTelugu.textContent="Telugu";
                            langHindi.textContent="Hindi";
                        } else {
                            console.error("Unexpected format in translation data:", data);
                        }
                    } catch (error) {
                        console.error("Error fetching translation:", error);
                    }
                }
            }
        }, 500);
    });
});
