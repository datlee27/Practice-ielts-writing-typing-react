declare module 'textract' {
  interface TextractCallback {
    (error: Error | null, text?: string): void;
  }

  interface Textract {
    fromFileWithPath(filePath: string, callback: TextractCallback): void;
  }

  const textract: Textract;
  export = textract;
}

