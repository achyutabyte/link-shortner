---
name: create-copilot
description: "Generate a new instructions file for Copilot"
agent: instructions-generator
---

Take the information below and generate a `[NAME].instructions.md` file in `.github/instructions/`.

If a filename is provided, use that; otherwise generate an appropriate filename for the `[NAME]` placeholder based on the generated content. Make sure the instructions are concise and well-structured.

If no information is provided below, prompt the user to provide the necessary details regarding the architecture layer or coding standards to document.
