const A="data:image/webp;base64,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";export{A as default};
