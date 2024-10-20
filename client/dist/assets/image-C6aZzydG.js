const A="data:image/webp;base64,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";export{A as default};
